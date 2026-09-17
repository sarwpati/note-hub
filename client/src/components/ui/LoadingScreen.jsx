const LoadingScreen = () => (
  <div className="min-h-screen bg-[#f3f4f8] flex items-center justify-center text-slate-700">
    <div className="flex items-center gap-3">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#6d5efc] border-t-transparent" />
      <span className="text-sm font-medium">Loading…</span>
    </div>
  </div>
);

export default LoadingScreen;
