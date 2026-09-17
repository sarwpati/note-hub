import { ArrowRight, Globe, NotebookPen, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="min-h-screen bg-[#1b1d22] p-3 text-slate-800 md:p-5">
    <div className="mx-auto max-w-[1700px] overflow-hidden rounded-[22px] border border-slate-700 bg-[#eef0f4] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      <header className="flex h-14 items-center justify-between border-b border-slate-700 bg-[#1f242c] px-4 text-white md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-bold text-slate-800">‹</div>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-bold text-slate-800">›</div>
          <div className="ml-2 flex h-9 items-center gap-2 rounded-md border border-slate-600 bg-[#2a3039] px-3 text-sm text-slate-200">
            <Globe size={14} className="text-slate-400" />
            localhost:5173
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-600 bg-[#2a3039]">
            <Sparkles size={14} />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-600 bg-[#2a3039]">
            <Search size={14} />
          </div>
          <div className="h-8 w-8 rounded-md bg-[#f97316]" />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4.5rem)]">
        <aside className="w-[280px] border-r border-slate-200 bg-[#f7f8fa] p-5">
          <div className="mb-8 flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5f54f7] text-lg font-bold text-white shadow-md shadow-[#5f54f7]/25">
              N
            </div>
            <div className="text-[15px] font-semibold tracking-[-0.03em] text-slate-700">NoteHub</div>
          </div>

          <nav className="space-y-2 text-sm">
            <Link to="/login" className="block rounded-xl px-3 py-2 font-medium text-slate-600 transition hover:bg-white hover:text-slate-800">
              Login
            </Link>
            <Link to="/register" className="block rounded-xl px-3 py-2 font-medium text-slate-600 transition hover:bg-white hover:text-slate-800">
              Register
            </Link>
          </nav>

          <div className="mt-8 space-y-6 text-slate-600">
            <div className="space-y-4">
              <div className="text-[15px] font-medium leading-7 text-slate-700">
                Smart notes for product builders
              </div>
              <div className="text-[15px] font-medium leading-7 text-slate-700">
                Capture ideas. Build momentum.
              </div>
              <p className="text-sm leading-6 text-slate-500">
                A clean, focused notes workspace for your plans, ideas, and personal knowledge.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#5f54f7] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[#5f54f7]/20 transition hover:bg-[#4f47e0]">
                Get started
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-10 space-y-4 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8ebff] text-[#4b57d7]">
                <NotebookPen size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-700">Daily workspace</div>
                <div className="text-[11px] text-slate-400">Live</div>
              </div>
            </div>

            {[{ title: 'Placement Preparation', accent: 'bg-[#dfeaff]' }, { title: 'Project Ideas', accent: 'bg-[#f2e3ff]' }, { title: 'Personal Growth', accent: 'bg-[#daf5e8]' }].map((note) => (
              <div key={note.title} className="rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm">
                <div className={`mb-2 h-2.5 w-20 rounded-full ${note.accent}`} />
                <div className="text-base font-semibold text-slate-700">{note.title}</div>
                <p className="mt-2 text-xs leading-5 text-slate-500">Capture ideas, plans, and next actions in one place.</p>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-[#edf0f5] p-8 lg:p-10">
          <div className="mx-auto max-w-6xl pt-4">
            <div className="mb-8 flex items-center gap-2 text-sm font-medium text-[#4b57d7]">
              <Sparkles size={14} />
              Smart notes for product builders
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
              Capture ideas. Build momentum.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              A clean, focused notes workspace for your plans, ideas, and personal knowledge.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#5f54f7] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#5f54f7]/20 transition hover:bg-[#4f47e0]">
                Get started
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                Sign in
              </Link>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {[
                { icon: <Zap size={18} />, title: 'Fast capture', text: 'Write thoughts quickly without breaking your flow.' },
                { icon: <ShieldCheck size={18} />, title: 'Private notes', text: 'Everything stays securely scoped to your account.' },
                { icon: <Sparkles size={18} />, title: 'Organized view', text: 'Search, pin, archive, and revisit notes with ease.' },
              ].map((feature) => (
                <div key={feature.title} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4d47d7]">{feature.icon}</div>
                  <div className="text-lg font-semibold text-slate-800">{feature.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
);

export default LandingPage;
