import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Search, Sparkles, X } from 'lucide-react';
import Sidebar, { MobileSidebarToggle } from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import NoteCard from '../components/notes/NoteCard';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { noteService } from '../services/noteService';

const COLOR_CHOICES = ['blue', 'green', 'purple', 'yellow', 'red', 'gray', 'pink', 'orange'];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  useEffect(() => {
    fetchNotes();
  }, [debouncedSearch, filter]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filter !== 'all') params.set('filter', filter);
    if (isNewNoteOpen) params.set('new', '1');
    setSearchParams(params, { replace: true });
  }, [search, filter, isNewNoteOpen, setSearchParams]);

  const pinnedNotes = useMemo(() => notes.filter((note) => note.isPinned), [notes]);

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

  const handlePin = async (note) => {
    await noteService.togglePin(note._id);
    await fetchNotes();
  };

  const handleArchive = async (note) => {
    await noteService.toggleArchive(note._id);
    await fetchNotes();
  };

  const handleDelete = async (note) => {
    if (!window.confirm('Delete this note?')) return;
    await noteService.deleteNote(note._id);
    await fetchNotes();
  };

  return (
    <div className="min-h-screen bg-[#eef1f6] p-4 md:p-6">
      <div className="mx-auto flex max-w-[1400px] items-start gap-4">
        <div className="hidden xl:block xl:w-[260px]">
          <Sidebar noteCount={notes.length} pinnedCount={pinnedNotes.length} archivedCount={0} />
        </div>

        <div className="xl:hidden">
          <MobileSidebarToggle onClick={() => setMobileSidebarOpen(true)} />
        </div>

        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-30 xl:hidden">
            <Sidebar noteCount={notes.length} pinnedCount={pinnedNotes.length} archivedCount={0} mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        <main className="min-w-0 flex-1 rounded-[28px] border border-slate-200 bg-[#f8f9fd] p-4 shadow-sm">
          <TopBar
            title="Notes"
            searchValue={search}
            onSearch={setSearch}
            onCreate={() => navigate('/dashboard?new=1')}
          />

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-800">{user?.name ? `Good afternoon, ${user.name.split(' ')[0]}!` : 'Good afternoon!'}</h1>
              <p className="mt-1 text-sm text-slate-500">Capture your thoughts, organize your ideas, and build your knowledge.</p>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            {['all', 'pinned', 'archive'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-xl px-3 py-2 text-sm ${filter === option ? 'bg-[#5f54f7] text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}
              >
                {option === 'all' ? 'All Notes' : option === 'pinned' ? 'Pinned' : 'Archive'}
              </button>
            ))}
          </div>

          {isNewNoteOpen && (
            <div className="mb-5 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Create note</h2>
                <button type="button" onClick={() => navigate('/dashboard')} className="rounded-lg p-1.5 hover:bg-slate-100">
                  <X size={16} />
                </button>
              </div>
              <input
                value={createData.title}
                onChange={(event) => setCreateData((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Title"
                className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#5f54f7]"
              />
              <textarea
                rows={4}
                value={createData.content}
                onChange={(event) => setCreateData((prev) => ({ ...prev, content: event.target.value }))}
                placeholder="Write your note..."
                className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#5f54f7]"
              />
              <div className="mb-3 flex flex-wrap gap-2">
                {COLOR_CHOICES.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCreateData((prev) => ({ ...prev, color }))}
                    className={`h-7 w-7 rounded-full border-2 ${createData.color === color ? 'border-slate-700' : 'border-transparent'} ${
                      { blue: 'bg-[#cfe1ff]', green: 'bg-[#d8f5da]', purple: 'bg-[#ebdcff]', yellow: 'bg-[#fde7a9]', red: 'bg-[#ffd0d0]', gray: 'bg-[#dfe3ed]', pink: 'bg-[#fdd4ee]', orange: 'bg-[#f8d9b6]' }[color]
                    }`}
                    aria-label={`Select ${color} note color`}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => navigate('/dashboard')} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="button" onClick={handleCreateNote} disabled={isCreating} className="rounded-xl bg-[#5f54f7] px-4 py-2 text-sm text-white disabled:opacity-60">
                  {isCreating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Pinned Notes</h2>
            <Link to="/dashboard?pinned=true" className="text-sm font-medium text-[#5f54f7]">View all →</Link>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-48 animate-pulse rounded-[18px] bg-slate-200/80" />
              ))}
            </div>
          ) : pinnedNotes.length > 0 ? (
            <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pinnedNotes.slice(0, 3).map((note) => (
                <NoteCard key={note._id} note={note} onPin={handlePin} onArchive={handleArchive} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="mb-6 rounded-[18px] border border-dashed border-slate-200 bg-white/60 p-10 text-center text-sm text-slate-500">
              No pinned notes yet.
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Recent Notes</h2>
            <Link to="/dashboard" className="text-sm font-medium text-[#5f54f7]">View all →</Link>
          </div>

          {!loading && notes.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-slate-200 bg-white/80 p-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0ecff] text-[#5f54f7]">
                <Search size={20} />
              </div>
              <div className="text-lg font-semibold text-slate-700">No notes match your search.</div>
              <div className="mt-2 text-sm text-slate-500">Create a new note or try a different keyword.</div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} onPin={handlePin} onArchive={handleArchive} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
