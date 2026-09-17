import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Trash2 } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { noteService } from '../services/noteService';

const ArchivePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await noteService.getNotes({ archived: true, page: 1, limit: 50 });
      setNotes(response.data.data.notes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleRestore = async (id) => {
    await noteService.toggleArchive(id);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this archived note permanently?')) return;
    await noteService.deleteNote(id);
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-[#eef1f6] p-4 md:p-6">
      <div className="mx-auto grid max-w-[1400px] gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <Sidebar noteCount={notes.length} archivedCount={notes.length} />

        <main className="rounded-[28px] border border-slate-200 bg-[#f8f9fd] p-4 shadow-sm">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-800">Archive</h1>
              <p className="mt-1 text-sm text-slate-500">Restore or delete notes you no longer need.</p>
            </div>
          </header>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-48 animate-pulse rounded-[18px] bg-slate-200/80" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-slate-200 bg-white/80 p-12 text-center">
              <div className="text-lg font-semibold text-slate-700">No archived notes</div>
              <p className="mt-2 text-sm text-slate-500">Archived notes will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <div key={note._id} className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">{note.title}</h3>
                  </div>
                  <p className="line-clamp-4 text-sm text-slate-600">{note.content}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(note.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">#{tag}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button type="button" onClick={() => handleRestore(note._id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                      <RotateCcw size={14} /> Restore
                    </button>
                    <button type="button" onClick={() => handleDelete(note._id)} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArchivePage;
