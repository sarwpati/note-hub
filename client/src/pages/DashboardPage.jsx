import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import Sidebar, { MobileBottomNav, MobileSidebarToggle } from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import NoteCard from '../components/notes/NoteCard';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';
import { useDebounce } from '../hooks/useDebounce';
import { noteService } from '../services/noteService';

const COLOR_CHOICES = ['blue', 'green', 'purple', 'yellow', 'red', 'gray', 'pink', 'orange'];

const colorSwatchMap = {
  blue: '#cfe1ff',
  green: '#c6f6d5',
  purple: '#e9d8fd',
  yellow: '#fef08a',
  red: '#fecaca',
  gray: '#e2e8f0',
  pink: '#fbcfe8',
  orange: '#fed7aa',
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { confirm } = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
  const [isCreating, setIsCreating] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createData, setCreateData] = useState({ title: '', content: '', tags: '[]', color: 'blue' });
  const isNewNoteOpen = searchParams.get('new') === '1';

  const debouncedSearch = useDebounce(search, 300);

  const fetchNotes = async (nextSearch = debouncedSearch, nextFilter = filter) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: 1,
        limit: 12,
        search: nextSearch || undefined,
        archived: false,
      };
      if (nextFilter === 'pinned') params.pinned = true;
      const response = await noteService.getNotes(params);
      setNotes(response.data.data.notes || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, [debouncedSearch, filter]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filter !== 'all') params.set('filter', filter);
    if (isNewNoteOpen) params.set('new', '1');
    setSearchParams(params, { replace: true });
  }, [search, filter, isNewNoteOpen, setSearchParams]);

  const pinnedNotes = useMemo(() => notes.filter((n) => n.isPinned), [notes]);
  const recentNotes = useMemo(() => notes.filter((n) => !n.isPinned), [notes]);

  const handleCreateNote = async () => {
    try {
      setIsCreating(true);
      const payload = {
        title: createData.title || 'Untitled note',
        content: createData.content || 'New note',
        tags: JSON.parse(createData.tags || '[]'),
        color: createData.color,
      };
      await noteService.createNote(payload);
      setCreateData({ title: '', content: '', tags: '[]', color: 'blue' });
      await fetchNotes();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create note');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePin = async (note) => { await noteService.togglePin(note._id); await fetchNotes(); };
  const handleArchive = async (note) => { await noteService.toggleArchive(note._id); await fetchNotes(); };
  const handleDelete = async (note) => {
    const ok = await confirm({
      title: 'Delete note?',
      message: `"${note.title}" will be permanently deleted and cannot be recovered.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    await noteService.deleteNote(note._id);
    await fetchNotes();
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'pinned', label: 'Pinned' },
    { key: 'archive', label: 'Archive', navigateTo: '/archive' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      {/* Desktop sidebar */}
      <Sidebar
        noteCount={notes.length}
        pinnedCount={pinnedNotes.length}
        archivedCount={0}
      />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <Sidebar
          noteCount={notes.length}
          pinnedCount={pinnedNotes.length}
          archivedCount={0}
          mobileOpen
          onClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 md:p-6 pb-24 md:pb-6">
        {/* Mobile top row */}
        <div className="flex items-center gap-3 mb-4 md:hidden">
          <MobileSidebarToggle onClick={() => setMobileSidebarOpen(true)} />
          <div className="text-base font-bold text-slate-800">NoteHub</div>
        </div>

        {/* TopBar (search + create) */}
        <TopBar
          searchValue={search}
          onSearch={setSearch}
        />

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">What's on your mind today?</p>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex items-center gap-1 border-b border-slate-200">
          {filterTabs.map(({ key, label, navigateTo }) => (
            <button
              key={key}
              type="button"
              onClick={() => navigateTo ? navigate(navigateTo) : setFilter(key)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
                filter === key
                  ? 'border-[#5f54f7] text-[#5f54f7]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Create note panel */}
        {isNewNoteOpen && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Create a note</h2>
              <button type="button" onClick={() => navigate('/dashboard')} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X size={15} />
              </button>
            </div>
            <input
              value={createData.title}
              onChange={(e) => setCreateData((p) => ({ ...p, title: e.target.value }))}
              placeholder="Title"
              className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#5f54f7] focus:ring-2 focus:ring-[#5f54f7]/10"
            />
            <textarea
              rows={4}
              value={createData.content}
              onChange={(e) => setCreateData((p) => ({ ...p, content: e.target.value }))}
              placeholder="Write your note..."
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#5f54f7] focus:ring-2 focus:ring-[#5f54f7]/10 resize-none"
            />
            {/* Color picker */}
            <div className="mb-4 flex flex-wrap gap-2">
              {COLOR_CHOICES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCreateData((p) => ({ ...p, color }))}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    createData.color === color ? 'border-slate-600 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorSwatchMap[color] }}
                  aria-label={`Select ${color} note color`}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => navigate('/dashboard')} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="button" onClick={handleCreateNote} disabled={isCreating} className="rounded-xl bg-[#5f54f7] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[#4d45d8]">
                {isCreating ? 'Saving...' : 'Save note'}
              </button>
            </div>
          </div>
        )}

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>}

        {/* Pinned Notes */}
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>📌</span> Pinned
            </h2>
            <button onClick={() => setFilter('pinned')} className="text-sm font-medium text-[#5f54f7] hover:underline">
              View all →
            </button>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-200/60" />)}
            </div>
          ) : pinnedNotes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pinnedNotes.slice(0, 3).map((note) => (
                <NoteCard key={note._id} note={note} onPin={handlePin} onArchive={handleArchive} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 py-8 text-center text-sm text-slate-400">
              No pinned notes yet — pin a note to keep it at the top.
            </div>
          )}
        </section>

        {/* Recent Notes */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>📝</span> Recent Notes
            </h2>
            <button onClick={() => setFilter('all')} className="text-sm font-medium text-[#5f54f7] hover:underline">
              View all →
            </button>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-200/60" />)}
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef0ff] text-[#5f54f7]">
                <Search size={20} />
              </div>
              <div className="text-base font-semibold text-slate-700">No notes match your search</div>
              <p className="mt-1.5 text-sm text-slate-500">Create a new note or try a different keyword.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentNotes.map((note) => (
                <NoteCard key={note._id} note={note} onPin={handlePin} onArchive={handleArchive} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav onCreateClick={() => navigate('/dashboard?new=1')} />
    </div>
  );
};

export default DashboardPage;
