import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Archive, ArrowLeft, Bold, Italic, Link2, List, MoreHorizontal, Pin, Share2, Trash2, Underline, X } from 'lucide-react';
import { noteService } from '../services/noteService';
import { useConfirm } from '../context/ConfirmContext';

const NOTE_COLORS = ['blue', 'green', 'purple', 'yellow', 'red', 'gray', 'pink', 'orange'];

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

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

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

  useEffect(() => { fetchNote(); }, [id]);

  const updateNote = async (patch) => {
    if (!note) return;
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const updated = await noteService.updateNote(note._id, patch);
      setNote(updated.data.data.note);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!note) return;
    updateNote({ title: note.title, content: note.content, tags: note.tags || [], color: note.color });
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete note?',
      message: 'This note will be permanently deleted and cannot be recovered.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    await noteService.deleteNote(id);
    navigate('/dashboard');
  };

  const handlePin = async () => { await noteService.togglePin(id); fetchNote(); };
  const handleArchive = async () => { await noteService.toggleArchive(id); fetchNote(); };

  const addTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    setNote((p) => ({ ...p, tags: [...(p.tags || []), tag] }));
    setNewTag('');
    setShowTagInput(false);
  };

  const removeTag = (index) => {
    setNote((p) => ({ ...p, tags: p.tags.filter((_, i) => i !== index) }));
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
      <div className="h-8 w-8 rounded-full border-2 border-[#5f54f7] border-t-transparent animate-spin" />
    </div>
  );

  if (!note) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] text-slate-600">Note not found.</div>
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        {/* Left */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Center — save status */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {saving ? (
            <span>Saving…</span>
          ) : saved ? (
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Saved just now
            </span>
          ) : (
            <span>{new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={handlePin} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition" aria-label="Pin note">
            <Pin size={15} className={note.isPinned ? 'fill-current text-[#5f54f7]' : ''} />
          </button>
          <button type="button" onClick={handleArchive} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition" aria-label="Archive note">
            <Archive size={15} />
          </button>
          <button type="button" onClick={handleDelete} className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition" aria-label="Delete note">
            <Trash2 size={15} />
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-[#5f54f7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4d45d8] transition"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        {/* Title */}
        <input
          value={note.title}
          onChange={(e) => setNote((p) => ({ ...p, title: e.target.value }))}
          className="mb-4 w-full border-0 bg-transparent text-3xl md:text-4xl font-bold tracking-tight text-slate-800 outline-none placeholder:text-slate-300"
          placeholder="Note title"
        />

        {/* Tags */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {(note.tags || []).map((tag, i) => (
            <span key={`${tag}-${i}`} className="group flex items-center gap-1.5 rounded-full bg-[#eef0ff] px-3 py-1 text-xs font-semibold text-[#5f54f7]">
              {tag}
              <button type="button" onClick={() => removeTag(i)} className="opacity-60 hover:opacity-100">
                <X size={10} />
              </button>
            </span>
          ))}
          {showTagInput ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') setShowTagInput(false); }}
                placeholder="tag name"
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs outline-none focus:border-[#5f54f7] w-28"
              />
              <button type="button" onClick={addTag} className="text-xs font-semibold text-[#5f54f7]">Add</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowTagInput(true)}
              className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs text-slate-500 hover:border-[#5f54f7] hover:text-[#5f54f7] transition"
            >
              + Add tag
            </button>
          )}
        </div>

        {/* Formatting toolbar */}
        <div className="mb-4 flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <select className="mr-2 rounded-lg border-0 bg-transparent py-1 pr-6 text-xs font-medium text-slate-600 outline-none">
            <option>Normal</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
          </select>
          <div className="mx-1 h-4 w-px bg-slate-200" />
          {[
            { icon: <Bold size={14} />, label: 'Bold' },
            { icon: <Italic size={14} />, label: 'Italic' },
            { icon: <Underline size={14} />, label: 'Underline' },
          ].map(({ icon, label }) => (
            <button key={label} type="button" aria-label={label} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition">
              {icon}
            </button>
          ))}
          <div className="mx-1 h-4 w-px bg-slate-200" />
          {[
            { icon: <List size={14} />, label: 'List' },
            { icon: <Link2 size={14} />, label: 'Link' },
          ].map(({ icon, label }) => (
            <button key={label} type="button" aria-label={label} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition">
              {icon}
            </button>
          ))}
        </div>

        {/* Content textarea */}
        <textarea
          value={note.content}
          onChange={(e) => setNote((p) => ({ ...p, content: e.target.value }))}
          className="min-h-[320px] w-full resize-none border-0 bg-transparent text-[15px] leading-8 text-slate-700 outline-none placeholder:text-slate-300"
          placeholder="Write your note…"
        />

        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>}

        {/* Color picker + meta */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-slate-500">Note color</span>
            {NOTE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNote((p) => ({ ...p, color }))}
                className={`h-7 w-7 rounded-full border-2 transition hover:scale-110 ${
                  note.color === color ? 'border-slate-600 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: colorSwatchMap[color] }}
                aria-label={`Set ${color} color`}
              />
            ))}
          </div>
          <div className="text-xs text-slate-400">
            Last updated {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
