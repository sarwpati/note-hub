import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Archive, ArrowLeft, Check, Clock3, Save, Trash2, Pin } from 'lucide-react';
import { noteService } from '../services/noteService';

const NOTE_COLORS = ['blue', 'green', 'purple', 'yellow', 'red', 'gray', 'pink', 'orange'];

const colorMap = {
  blue: '#dfe9ff',
  green: '#daf7ea',
  purple: '#ece1ff',
  yellow: '#fef3c7',
  red: '#ffe3e3',
  gray: '#e6edf8',
  pink: '#fce7f3',
  orange: '#fde7d8',
};

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchNote = async () => {
    setLoading(true);
    try {
      const response = await noteService.getNote(id);
      setNote(response.data.data.note);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load note');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [id]);

  const updateNote = async (patch) => {
    if (!note) return;
    setSaving(true);
    setError('');

    try {
      const updated = await noteService.updateNote(note._id, patch);
      setNote(updated.data.data.note);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!note) return;
    updateNote({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      color: note.color,
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    await noteService.deleteNote(id);
    navigate('/dashboard');
  };

  const handlePin = async () => {
    await noteService.togglePin(id);
    fetchNote();
  };

  const handleArchive = async () => {
    await noteService.toggleArchive(id);
    fetchNote();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading note…</div>;
  }

  if (!note) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Note not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#eef1f6] p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handlePin} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600">
              <Pin size={16} className={note.isPinned ? 'fill-current text-[#5f54f7]' : ''} />
            </button>
            <button type="button" onClick={handleArchive} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600">
              <Archive size={16} />
            </button>
            <button type="button" onClick={handleDelete} className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600">
              <Trash2 size={16} />
            </button>
            <button type="button" onClick={handleSave} className="rounded-xl bg-[#5f54f7] px-4 py-2 text-sm font-medium text-white">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-[#f8f9fd] p-4 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-sm text-slate-500">Saved {new Date(note.updatedAt).toLocaleString()}</div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock3 size={14} />
              Last updated
            </div>
          </div>

          <input
            value={note.title}
            onChange={(event) => setNote((prev) => ({ ...prev, title: event.target.value }))}
            className="mb-4 w-full border-0 bg-transparent text-4xl font-semibold tracking-[-0.04em] text-slate-800 outline-none placeholder:text-slate-300"
            placeholder="Note title"
          />

          <div className="mb-4 flex flex-wrap gap-2">
            {(note.tags || []).map((tag, index) => (
              <span key={`${tag}-${index}`} className="rounded-full bg-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700">#{tag}</span>
            ))}
            <button
              type="button"
              onClick={() => setNote((prev) => ({ ...prev, tags: [...(prev.tags || []), 'tag'] }))}
              className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs text-slate-500"
            >
              + Add tag
            </button>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Color</span>
            {NOTE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNote((prev) => ({ ...prev, color }))}
                className={`h-7 w-7 rounded-full border-2 ${note.color === color ? 'border-slate-700' : 'border-transparent'}`}
                style={{ backgroundColor: colorMap[color] }}
                aria-label={`Set ${color} color`}
              />
            ))}
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <textarea
              value={note.content}
              onChange={(event) => setNote((prev) => ({ ...prev, content: event.target.value }))}
              className="min-h-[260px] w-full resize-none border-0 bg-transparent text-base leading-7 text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Write your note..."
            />
          </div>

          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
