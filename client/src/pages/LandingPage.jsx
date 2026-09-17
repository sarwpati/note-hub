import { ArrowRight, BookOpen, Lock, Search, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Zap size={18} />,
    title: 'Fast capture',
    text: 'Write thoughts quickly without breaking your flow.',
    color: 'bg-[#fef3c7] text-[#b7791f]',
  },
  {
    icon: <Lock size={18} />,
    title: 'Private & secure',
    text: 'Everything stays securely scoped to your account only.',
    color: 'bg-[#daf7ea] text-[#197a46]',
  },
  {
    icon: <Search size={18} />,
    title: 'Organized view',
    text: 'Search, pin, archive, and revisit notes with ease.',
    color: 'bg-[#ece1ff] text-[#6f4bc8]',
  },
];

const exampleNotes = [
  { title: 'Placement Preparation', color: 'bg-[#cfe1ff]', tag: 'Career' },
  { title: 'Project Ideas', color: 'bg-[#e9d8fd]', tag: 'Ideas' },
  { title: 'Personal Growth', color: 'bg-[#c6f6d5]', tag: 'Mindset' },
];

const LandingPage = () => (
  <div className="min-h-screen bg-[#f4f5f7] flex flex-col">
    {/* Nav */}
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5 md:px-8">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6d5efc] to-[#8b7cf8] shadow-sm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <span className="text-base font-bold text-slate-800">NoteHub</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-800 transition">
          Sign in
        </Link>
        <Link
          to="/register"
          className="rounded-xl bg-[#5f54f7] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#5f54f7]/25 transition hover:bg-[#4d45d8]"
        >
          Get started
        </Link>
      </div>
    </header>

    {/* Hero */}
    <section className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center md:py-28">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c7c2fc] bg-[#eef0ff] px-3.5 py-1.5 text-xs font-semibold text-[#5f54f7]">
        <Sparkles size={12} />
        Smart notes for modern thinkers
      </div>
      <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl lg:text-6xl">
        Capture ideas.<br />
        <span className="text-[#5f54f7]">Build momentum.</span>
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
        A calm, focused notes workspace for your plans, ideas, and personal knowledge. Built for thinkers.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5f54f7] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5f54f7]/25 transition hover:bg-[#4d45d8]"
        >
          Start for free
          <ArrowRight size={15} />
        </Link>
        <Link
          to="/login"
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Sign in
        </Link>
      </div>
    </section>

    {/* Preview cards */}
    <section className="px-5 pb-12 md:pb-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="text-lg font-bold text-slate-800">Your ideas, beautifully organized</h2>
          <p className="mt-1.5 text-sm text-slate-500">Pin important notes, tag everything, and find it instantly.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {exampleNotes.map((note) => (
            <div key={note.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2.5">
                <div className={`h-3 w-3 rounded-sm ${note.color}`} />
                <span className="text-sm font-semibold text-slate-700">{note.title}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Capture your thoughts and organize them with tags, colors, and pins.
              </p>
              <div className="mt-3">
                <span className="rounded-full bg-[#eef0ff] px-2.5 py-0.5 text-[11px] font-medium text-[#5f54f7]">
                  {note.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="border-t border-slate-200 bg-white px-5 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Everything you need</h2>
          <p className="mt-2 text-sm text-slate-500">Simple, powerful, and always available.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-[#f4f5f7] p-5">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
                {f.icon}
              </div>
              <div className="text-base font-bold text-slate-800">{f.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="px-5 py-14 text-center md:py-20">
      <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">Ready to get started?</h2>
      <p className="mt-3 text-sm text-slate-500">Join thousands of people who organize their ideas with NoteHub.</p>
      <Link
        to="/register"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#5f54f7] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5f54f7]/25 transition hover:bg-[#4d45d8]"
      >
        Create your first note
        <ArrowRight size={15} />
      </Link>
    </section>

    {/* Footer */}
    <footer className="border-t border-slate-200 bg-white px-5 py-5 text-center text-xs text-slate-400">
      © {new Date().getFullYear()} NoteHub · A calmer mind, everyday
    </footer>
  </div>
);

export default LandingPage;
