import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: '', color: '' },
    { label: 'Weak', color: 'bg-red-400' },
    { label: 'Fair', color: 'bg-orange-400' },
    { label: 'Good', color: 'bg-yellow-400' },
    { label: 'Strong', color: 'bg-emerald-500' },
  ];
  return { score, ...levels[score] };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d5efc] to-[#8b7cf8] shadow-lg shadow-[#6d5efc]/30">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div className="text-xl font-bold text-slate-800">NoteHub</div>
          <div className="text-xs text-slate-400 mt-0.5">A calmer mind, everyday</div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Create your account</h1>
          <p className="mt-1.5 text-sm text-slate-500">Start capturing your ideas today.</p>

          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#5f54f7] focus:bg-white focus:ring-2 focus:ring-[#5f54f7]/10"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#5f54f7] focus:bg-white focus:ring-2 focus:ring-[#5f54f7]/10"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#5f54f7] focus:bg-white focus:ring-2 focus:ring-[#5f54f7]/10"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Password strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i <= strength.score ? strength.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className={`mt-1 text-[11px] font-medium ${
                      strength.score <= 1 ? 'text-red-500' :
                      strength.score === 2 ? 'text-orange-500' :
                      strength.score === 3 ? 'text-yellow-600' : 'text-emerald-600'
                    }`}>
                      {strength.label}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#5f54f7] focus:bg-white focus:ring-2 focus:ring-[#5f54f7]/10"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#5f54f7] py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5f54f7]/25 transition hover:bg-[#4d45d8] disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#5f54f7] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
