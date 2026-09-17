import { useEffect, useState } from 'react';
import { Bell, ChevronRight, LogOut, Moon, Palette, Shield, Sun, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useConfirm } from '../context/ConfirmContext';
import { authService } from '../services/authService';

const settingsNav = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { confirm } = useConfirm();
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { setName(user?.name || ''); }, [user?.name]);

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

  const handleSave = async () => {
    setMessage({ type: '', text: '' });
    setSaving(true);
    try {
      const payload = {};
      if (name.trim()) payload.name = name.trim();
      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) throw new Error('Both current and new passwords are required.');
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      if (!payload.name && !payload.currentPassword) {
        setMessage({ type: 'info', text: 'No changes to save.' });
        return;
      }
      await authService.updateProfile(payload);
      await refreshUser();
      setCurrentPassword('');
      setNewPassword('');
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || err?.message || 'Unable to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Settings</h1>
            <p className="text-xs text-slate-500">Manage your account and preferences.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-[#5f54f7] hover:underline"
          >
            ← Back to notes
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:gap-6">
          {/* Left nav */}
          <aside className="md:w-[200px] flex-shrink-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              {settingsNav.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    activeSection === id
                      ? 'bg-[#eef0ff] text-[#5f54f7]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* ─── Profile ─── */}
            {activeSection === 'profile' && (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-base font-bold text-slate-800">Profile</h2>

                  {/* Avatar */}
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8e5ff] text-xl font-bold text-[#5f54f7]">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
                      <button type="button" className="mt-0.5 text-xs font-medium text-[#5f54f7] hover:underline">
                        Change photo
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#5f54f7] focus:ring-2 focus:ring-[#5f54f7]/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                      <input
                        value={user?.email || ''}
                        disabled
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                      />
                      <p className="mt-1.5 text-[11px] text-slate-400">Your email address cannot be changed.</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {message.text && (
                  <div className={`rounded-xl border px-3.5 py-2.5 text-sm ${
                    message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : message.type === 'error' ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-slate-200 bg-white text-slate-600'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-[#5f54f7] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5f54f7]/25 transition hover:bg-[#4d45d8] disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </>
            )}

            {/* ─── Appearance ─── */}
            {activeSection === 'appearance' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-slate-800">Appearance</h2>
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">Theme</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'light', label: 'Light', icon: <Sun size={14} /> },
                      { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
                      { id: 'system', label: 'System', icon: <Palette size={14} /> },
                    ].map(({ id, label, icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTheme(id)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                          theme === id
                            ? 'border-[#5f54f7] bg-[#eef0ff] text-[#5f54f7]'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {icon}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Security ─── */}
            {activeSection === 'security' && (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-base font-bold text-slate-800">Security</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Current password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#5f54f7] focus:ring-2 focus:ring-[#5f54f7]/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">New password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#5f54f7] focus:ring-2 focus:ring-[#5f54f7]/10"
                      />
                    </div>
                  </div>
                </div>

                {message.text && (
                  <div className={`rounded-xl border px-3.5 py-2.5 text-sm ${
                    message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : message.type === 'error' ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-slate-200 bg-white text-slate-600'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-[#5f54f7] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5f54f7]/25 transition hover:bg-[#4d45d8] disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Update password'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
