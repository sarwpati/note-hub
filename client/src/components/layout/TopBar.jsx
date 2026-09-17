import { Bell, ChevronLeft, Plus, Search } from 'lucide-react';

const TopBar = ({
  searchValue,
  onSearch,
  onBack,
  showBack = false,
  actions,
  onCreate,
  searchPlaceholder = 'Search notes, tags, or anything...',
}) => (
  <div className="mb-6 flex items-center gap-3">
    {showBack && (
      <button
        type="button"
        onClick={onBack}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
        aria-label="Go back"
      >
        <ChevronLeft size={16} />
      </button>
    )}

    {/* Search */}
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
      <input
        value={searchValue}
        onChange={(event) => onSearch?.(event.target.value)}
        placeholder={searchPlaceholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#5f54f7] focus:ring-2 focus:ring-[#5f54f7]/10 placeholder:text-slate-400"
      />
    </div>

    {/* Create button */}
    {onCreate && (
      <button
        type="button"
        onClick={onCreate}
        className="hidden sm:flex items-center gap-2 rounded-xl bg-[#5f54f7] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5f54f7]/25 transition hover:bg-[#4d45d8] active:scale-[0.98] flex-shrink-0"
      >
        <Plus size={15} />
        Create a note
      </button>
    )}

    {/* Bell */}
    <button
      type="button"
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
      aria-label="Notifications"
    >
      <Bell size={16} />
    </button>

    {actions}
  </div>
);

export default TopBar;
