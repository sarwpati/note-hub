import { Bell, ChevronLeft, Command, Search, Shield, Sparkles } from 'lucide-react';

const TopBar = ({ title, onSearch, searchValue, onBack, showBack = false, actions, onCreate, searchPlaceholder = 'Search notes...' }) => (
  <div className="mb-5 flex items-center justify-between gap-4 rounded-[20px] border border-slate-200 bg-[#f4f6fb] p-3 shadow-sm">
    <div className="flex items-center gap-3">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
          aria-label="Go back"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div className="relative hidden min-w-[240px] flex-1 lg:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          value={searchValue}
          onChange={(event) => onSearch?.(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#5b56ea] focus:ring-2 focus:ring-[#5b56ea]/10"
        />
      </div>

      <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-500 md:flex">
        <Command size={13} />
        <span>Ctrl K</span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {onCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="rounded-xl bg-[#5d56f2] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[#5d56f2]/20 transition hover:bg-[#4f48df]"
        >
          + New Note
        </button>
      )}

      <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100" aria-label="Notifications">
        <Bell size={15} />
      </button>
      {actions}
    </div>
  </div>
);

export default TopBar;
