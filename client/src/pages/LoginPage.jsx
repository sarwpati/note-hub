import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
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
    <div className="flex min-h-screen items-center justify-center bg-[#edf0f5] p-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-[#f8f9fd] p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5f54f7] text-lg font-bold text-white">N</div>
          <div>
            <div className="text-2xl font-semibold text-slate-800">NoteHub</div>
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-800">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to continue your notes.</p>

        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-[#5f54f7] focus-within:ring-2 focus-within:ring-[#5f54f7]/10">
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-[#5f54f7] focus-within:ring-2 focus-within:ring-[#5f54f7]/10">
              <LockKeyhole size={16} className="text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Enter your password"
                required
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-slate-500" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-500">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              Remember me
            </label>
            <button type="button" className="text-[#5f54f7] hover:underline">Forgot password?</button>
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#5f54f7] px-4 py-3 text-sm font-medium text-white disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account?{' '}
          <Link to="/register" className="font-medium text-[#5f54f7] hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
