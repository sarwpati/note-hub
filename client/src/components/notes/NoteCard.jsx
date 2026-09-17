import { Archive, Ellipsis, Pin, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const colorDotMap = {
  blue: 'bg-[#cfe1ff]',
  green: 'bg-[#c6f6d5]',
  purple: 'bg-[#e9d8fd]',
  yellow: 'bg-[#fef08a]',
  red: 'bg-[#fecaca]',
  gray: 'bg-[#e2e8f0]',
  pink: 'bg-[#fbcfe8]',
  orange: 'bg-[#fed7aa]',
};

const tagColorMap = {
  blue: 'bg-[#dfe9ff] text-[#2d4d9c]',
  green: 'bg-[#daf7ea] text-[#197a46]',
  purple: 'bg-[#ece1ff] text-[#6f4bc8]',
  yellow: 'bg-[#fef3c7] text-[#b7791f]',
  red: 'bg-[#ffe3e3] text-[#b42318]',
  gray: 'bg-[#e6edf8] text-[#475467]',
  pink: 'bg-[#fce7f3] text-[#b4357a]',
  orange: 'bg-[#fde7d8] text-[#b15b13]',
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}h ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

const NoteCard = ({ note, onPin, onArchive, onDelete }) => {
  const preview = note.content?.trim() || 'No content';
  const dotClass = colorDotMap[note.color] || colorDotMap.blue;
  const tagClass = tagColorMap[note.color] || tagColorMap.blue;

  return (
    <Link
      to={`/notes/${note._id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Color dot */}
          <div className={`mt-1 h-3 w-3 flex-shrink-0 rounded-sm ${dotClass}`} />
          <h3 className="line-clamp-2 text-[15px] font-semibold text-slate-800 leading-snug">{note.title}</h3>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onPin?.(note); }}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#5f54f7]"
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={13} className={note.isPinned ? 'fill-current text-[#5f54f7]' : ''} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); }}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="More actions"
          >
            <Ellipsis size={13} />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-500 flex-1">{preview}</div>

      {/* Tags */}
      {(note.tags || []).length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(note.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tagClass}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[11px] text-slate-400">{timeAgo(note.updatedAt)}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onArchive?.(note); }}
            aria-label={note.isArchived ? 'Restore note' : 'Archive note'}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Archive size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onDelete?.(note); }}
            aria-label="Delete note"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
