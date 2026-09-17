import { useEffect, useState } from 'react';
import { ArrowLeft, Bell, LogOut, Moon, Shield, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSave = async () => {
    setMessage({ type: '', text: '' });
    setSaving(true);

    try {
      const payload = {};

      if (name.trim()) {
        payload.name = name.trim();
      }

      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          throw new Error('Both current and new passwords are required to change your password.');
        }

        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      if (!payload.name && !payload.currentPassword && !payload.newPassword) {
        setMessage({ type: 'info', text: 'No changes to save.' });
        return;
      }

      await authService.updateProfile(payload);
      await refreshUser();
      setCurrentPassword('');
      setNewPassword('');
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err?.response?.data?.message || err?.message || 'Unable to update settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef1f6] p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-[#f8f9fd] p-4 shadow-sm md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="text-sm text-slate-500">Manage your account</div>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-[20px] border border-slate-200 bg-white p-4">
            <div className="mb-4 text-lg font-semibold text-slate-800">Settings</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2 rounded-xl bg-[#efeefe] px-3 py-2 font-medium text-[#4d45d8]">
                <UserRound size={16} /> Profile
              </div>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2"> <Moon size={16} /> Appearance </div>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2"> <Shield size={16} /> Security </div>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2"> <Bell size={16} /> Notifications </div>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="rounded-[20px] border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-xl font-semibold text-slate-800">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Name</label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#5f54f7]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
                  <input value={user?.email || ''} disabled className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" />
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-xl font-semibold text-slate-800">Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#5f54f7]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#5f54f7]"
                  />
                </div>
              </div>
            </div>

            {message.text && (
              <div
                className={`rounded-xl border px-3 py-2 text-sm ${
                  message.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : message.type === 'error'
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button type="button" onClick={handleSave} disabled={saving} className="rounded-xl bg-[#5f54f7] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
