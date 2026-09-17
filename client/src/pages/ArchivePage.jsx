import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Trash2 } from 'lucide-react';
import Sidebar, { MobileBottomNav } from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { noteService } from '../services/noteService';
import { useConfirm } from '../context/ConfirmContext';

const colorDotMap = {
  blue: 'bg-[#cfe1ff]', green: 'bg-[#c6f6d5]', purple: 'bg-[#e9d8fd]',
  yellow: 'bg-[#fef08a]', red: 'bg-[#fecaca]', gray: 'bg-[#e2e8f0]',
  pink: 'bg-[#fbcfe8]', orange: 'bg-[#fed7aa]',
};

const ArchivePage = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await noteService.getNotes({ archived: true, page: 1, limit: 50 });
      setNotes(response.data.data.notes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleRestore = async (id) => { await noteService.toggleArchive(id); fetchNotes(); };
  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete permanently?',
      message: 'This archived note will be deleted forever and cannot be recovered.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    await noteService.deleteNote(id);
    fetchNotes();
  };

  const filtered = notes.filter((n) =>
    !search || n.title?.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      {/* Sidebar */}
      <Sidebar noteCount={0} archivedCount={notes.length} />

      {/* Main */}
      <main className="flex-1 min-w-0 p-4 md:p-6 pb-24 md:pb-6">
        {/* TopBar */}
        <TopBar
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search archive..."
        />

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Archive</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {notes.length} archived {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-200/60" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 py-16 text-center">
            <div className="text-base font-semibold text-slate-700">
              {notes.length === 0 ? 'No archived notes' : 'No notes match your search'}
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              {notes.length === 0 ? 'Archived notes will appear here.' : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((note) => (
              <div key={note._id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                {/* Header */}
                <div className="mb-3 flex items-start gap-2.5">
                  <div className={`mt-1 h-3 w-3 flex-shrink-0 rounded-sm ${colorDotMap[note.color] || colorDotMap.blue}`} />
                  <h3 className="flex-1 text-[15px] font-semibold text-slate-800 leading-snug line-clamp-2">{note.title}</h3>
                </div>

                {/* Content */}
                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-500 flex-1">{note.content}</p>

                {/* Tags */}
                {(note.tags || []).length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {(note.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => handleRestore(note._id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <RotateCcw size={13} /> Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(note._id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav onCreateClick={() => navigate('/dashboard?new=1')} />
    </div>
  );
};

export default ArchivePage;
