import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to continue your journey.</p>

          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                  placeholder="Enter your password"
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#5f54f7]" />
                Remember me
              </label>
              <button type="button" className="font-medium text-[#5f54f7] hover:underline">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#5f54f7] py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5f54f7]/25 transition hover:bg-[#4d45d8] disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#5f54f7] hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
