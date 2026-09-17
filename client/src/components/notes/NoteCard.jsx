import { Archive, Ellipsis, Pin, PinOff, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const colorMap = {
  blue: 'bg-[#dfe9ff] text-[#2d4d9c]',
  green: 'bg-[#daf7ea] text-[#197a46]',
  purple: 'bg-[#ece1ff] text-[#6f4bc8]',
  yellow: 'bg-[#fef3c7] text-[#b7791f]',
  red: 'bg-[#ffe3e3] text-[#b42318]',
  gray: 'bg-[#e6edf8] text-[#475467]',
  pink: 'bg-[#fce7f3] text-[#b4357a]',
  orange: 'bg-[#fde7d8] text-[#b15b13]',
};

const NoteCard = ({ note, onPin, onArchive, onDelete }) => {
  const preview = note.content?.trim() || 'No content';

  return (
    <div className="group flex h-full flex-col rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-[17px] font-semibold text-slate-800">{note.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onPin?.(note)} className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}>
            {note.isPinned ? <Pin size={15} className="fill-current" /> : <Pin size={15} />}
          </button>
          <button type="button" className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="More actions">
            <Ellipsis size={15} />
          </button>
        </div>
      </div>

      <div className="mb-4 line-clamp-4 text-sm leading-6 text-slate-600">{preview}</div>

      <div className="mt-auto flex flex-wrap gap-2">
        {(note.tags || []).slice(0, 3).map((tag) => (
          <span key={tag} className={`rounded-full px-2 py-1 text-[10px] font-medium ${colorMap[note.color] || colorMap.blue}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onArchive?.(note)} aria-label={note.isArchived ? 'Restore note' : 'Archive note'} className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-700">
            <Archive size={13} />
          </button>
          <button type="button" onClick={() => onDelete?.(note)} aria-label="Delete note" className="rounded-md p-1.5 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <Link to={`/notes/${note._id}`} className="sr-only">Open note</Link>
    </div>
  );
};

export default NoteCard;
