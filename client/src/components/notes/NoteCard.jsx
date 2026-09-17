import { useEffect, useRef, useState } from 'react';
import { Archive, ArchiveRestore, ExternalLink, Pin, PinOff, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

const NoteCard = ({ note, onPin, onArchive, onDelete }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const preview = note.content?.trim() || 'No content';
  const dotClass = colorDotMap[note.color] || colorDotMap.blue;
  const tagClass = tagColorMap[note.color] || tagColorMap.blue;

  // Dropdown menu actions
  const menuItems = [
    {
      label: 'Open note',
      icon: <ExternalLink size={13} />,
      onClick: () => navigate(`/notes/${note._id}`),
    },
    {
      label: note.isPinned ? 'Unpin' : 'Pin to top',
      icon: note.isPinned ? <PinOff size={13} /> : <Pin size={13} />,
      onClick: () => onPin?.(note),
    },
    {
      label: note.isArchived ? 'Restore' : 'Archive',
      icon: note.isArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />,
      onClick: () => onArchive?.(note),
    },
    {
      label: 'Delete',
      icon: <Trash2 size={13} />,
      onClick: () => onDelete?.(note),
      danger: true,
    },
  ];

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
      {/* Clickable area — navigates to note detail */}
      <Link
        to={`/notes/${note._id}`}
        className="flex flex-1 flex-col p-4"
        tabIndex={0}
      >
        {/* Header */}
        <div className="mb-3 flex items-start gap-2.5 pr-12">
          {/* Color dot */}
          <div className={`mt-1 h-3 w-3 flex-shrink-0 rounded-sm ${dotClass}`} />
          <h3 className="line-clamp-2 text-[15px] font-semibold text-slate-800 leading-snug">
            {note.title}
          </h3>
        </div>

        {/* Preview */}
        <div className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-500 flex-1">
          {preview}
        </div>

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
        <div className="flex items-center border-t border-slate-100 pt-2">
          <span className="text-[11px] text-slate-400">{timeAgo(note.updatedAt)}</span>
        </div>
      </Link>

      {/* ── Action buttons (top-right, always accessible) ── */}
      <div className="absolute right-2 top-2 flex items-center gap-0.5">
        {/* Pin quick-action */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPin?.(note); }}
          className="rounded-lg p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 transition hover:bg-slate-100 hover:text-[#5f54f7]"
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin size={13} className={note.isPinned ? 'fill-current text-[#5f54f7]' : ''} />
        </button>

        {/* Three-dot menu */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((prev) => !prev); }}
            className={`rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 ${
              menuOpen ? 'bg-slate-100 text-slate-700 opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            aria-label="More actions"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            {/* Three dots icon (manual SVG to avoid any import issue) */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/60">
              {menuItems.map(({ label, icon, onClick, danger }) => (
                <button
                  key={label}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onClick();
                  }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-medium transition hover:bg-slate-50 ${
                    danger ? 'text-red-500 hover:bg-red-50' : 'text-slate-700'
                  }`}
                >
                  <span className={danger ? 'text-red-400' : 'text-slate-400'}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
