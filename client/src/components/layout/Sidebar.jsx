import { Archive, FileText, LogOut, Menu, Moon, NotebookPen, Pin, Settings, Sun, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useConfirm } from '../../context/ConfirmContext';

const navItems = [
  { label: 'All Notes', to: '/dashboard', icon: FileText, countKey: 'note' },
  { label: 'Pinned', to: '/dashboard?filter=pinned', icon: Pin, countKey: 'pinned' },
  { label: 'Archive', to: '/archive', icon: Archive, countKey: 'archived' },
  { label: 'Settings', to: '/settings', icon: Settings, countKey: null },
];

/* ── Desktop Sidebar ────────────────────────────────────────────────── */
const Sidebar = ({ noteCount = 0, pinnedCount = 0, archivedCount = 0, mobileOpen = false, onClose }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const getCount = (key) => {
    if (key === 'note') return noteCount;
    if (key === 'pinned') return pinnedCount;
    if (key === 'archived') return archivedCount;
    return 0;
  };

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Log out?',
      message: 'You will be signed out of your account. Any unsaved changes will be lost.',
      confirmText: 'Log out',
      cancelText: 'Stay',
      variant: 'logout',
    });
    if (!ok) return;
    await logout();
    navigate('/login');
  };

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'flex flex-col bg-white border-r border-slate-200 h-full',
          'hidden md:flex md:w-[260px] md:min-h-screen md:sticky md:top-0',
          mobileOpen ? '!flex fixed left-0 top-0 z-40 w-[280px] min-h-screen shadow-2xl' : '',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6d5efc] to-[#8b7cf8] shadow-md shadow-[#6d5efc]/30">
              <NotebookPen size={16} className="text-white" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-800 tracking-tight">NoteHub</div>
              <div className="text-[10px] text-slate-400 leading-none mt-0.5">A calmer mind, everyday</div>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* New Note button */}
        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => { navigate('/dashboard?new=1'); if (onClose) onClose(); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5f54f7] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5f54f7]/25 transition hover:bg-[#4d45d8] active:scale-[0.98]"
          >
            <span className="text-base leading-none">+</span>
            New Note
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
          {navItems.map(({ label, to, icon: Icon, countKey }) => {
            const count = getCount(countKey);
            return (
              <NavLink
                key={label}
                to={to}
                onClick={onClose}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#eef0ff] text-[#5f54f7]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {label}
                </span>
                {count > 0 && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    {count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-100 px-3 py-4 space-y-1">
          {/* User info */}
          <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50 transition cursor-pointer">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#e8e5ff] text-sm font-bold text-[#5f54f7]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-700">{user?.name || 'User'}</div>
              <div className="truncate text-[11px] text-slate-400">{user?.email || ''}</div>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={handleThemeToggle}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <span className="flex items-center gap-3">
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
              {isDark ? 'Dark mode' : 'Light mode'}
            </span>
            {/* Animated toggle */}
            <div className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${isDark ? 'bg-[#5f54f7]' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${isDark ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

/* ── Mobile Bottom Nav ──────────────────────────────────────────────── */
export const MobileBottomNav = ({ onCreateClick }) => {
  const navigate = useNavigate();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-slate-200 bg-white px-2 pb-safe pt-2 md:hidden">
      <NavLink to="/dashboard" end className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-[10px] font-medium transition ${isActive ? 'text-[#5f54f7]' : 'text-slate-500'}`}>
        <FileText size={20} />
        Notes
      </NavLink>
      <NavLink to="/dashboard?filter=pinned" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-[10px] font-medium transition ${isActive ? 'text-[#5f54f7]' : 'text-slate-500'}`}>
        <Pin size={20} />
        Pinned
      </NavLink>
      <button type="button" onClick={onCreateClick} aria-label="Create new note" className="flex h-12 w-12 -mt-5 items-center justify-center rounded-full bg-[#5f54f7] text-white shadow-lg shadow-[#5f54f7]/35 active:scale-95 transition">
        <span className="text-2xl font-light leading-none">+</span>
      </button>
      <NavLink to="/archive" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-[10px] font-medium transition ${isActive ? 'text-[#5f54f7]' : 'text-slate-500'}`}>
        <Archive size={20} />
        Archive
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-[10px] font-medium transition ${isActive ? 'text-[#5f54f7]' : 'text-slate-500'}`}>
        <Settings size={20} />
        Settings
      </NavLink>
    </nav>
  );
};

/* ── Mobile Hamburger Toggle ────────────────────────────────────────── */
export const MobileSidebarToggle = ({ onClick }) => (
  <button type="button" onClick={onClick} aria-label="Open menu" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 md:hidden">
    <Menu size={17} />
  </button>
);

export default Sidebar;
