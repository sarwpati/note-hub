import { Archive, FileText, LogOut, Menu, NotebookPen, Pin, Settings, Sparkles, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'All Notes', to: '/dashboard', icon: FileText },
  { label: 'Pinned', to: '/dashboard?pinned=true', icon: Pin },
  { label: 'Archive', to: '/archive', icon: Archive },
  { label: 'Settings', to: '/settings', icon: Settings },
];

const Sidebar = ({ noteCount = 0, pinnedCount = 0, archivedCount = 0, mobileOpen = false, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && <button type="button" aria-label="Close sidebar" onClick={onClose} className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" />}

      <aside
        className={[
          'relative flex h-full w-full flex-col rounded-[28px] border border-slate-200/80 bg-[#f7f8fc] p-4 shadow-sm',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          mobileOpen ? 'fixed left-4 top-4 z-40 h-[calc(100vh-2rem)] w-[280px] lg:static lg:h-full lg:w-full' : 'hidden lg:flex',
        ].join(' ')}
      >
        <div className="mb-6 flex items-center justify-between gap-3 px-2 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6d5efc] to-[#8d7cf8] text-lg font-bold text-white shadow-md">
              N
            </div>
            <div className="text-xl font-semibold text-slate-800">NoteHub</div>
          </div>

          {onClose && (
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 lg:hidden" aria-label="Close menu">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              navigate('/dashboard?new=1');
              if (onClose) onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5f54f7] px-4 py-3 text-sm font-medium text-white shadow-md shadow-[#5f54f7]/20 transition hover:bg-[#4d45d8]"
          >
            <NotebookPen size={16} />
            New Note
          </button>

          {navItems.map(({ label, to, icon: Icon }) => {
            const isPinned = label === 'Pinned';
            const isArchive = label === 'Archive';
            const count = isPinned ? pinnedCount : isArchive ? archivedCount : noteCount;

            return (
              <NavLink
                key={label}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-[#ececff] text-[#4d45d8]' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-800'
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {label}
                </span>
                {count > 0 && (
                  <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="mt-auto space-y-3 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7dff9] text-xs font-semibold text-[#4d45d8]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-700">{user?.name || 'User'}</div>
              <div className="truncate text-[11px] text-slate-500">{user?.email || ''}</div>
            </div>
            <Link to="/dashboard" onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <Sparkles size={16} />
            </Link>
          </div>

          <button
            type="button"
            onClick={async () => {
              await handleLogout();
              if (onClose) onClose();
            }}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <span className="flex items-center gap-3">
              <LogOut size={16} />
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const MobileSidebarToggle = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Open menu"
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
  >
    <Menu size={18} />
  </button>
);

export default Sidebar;
