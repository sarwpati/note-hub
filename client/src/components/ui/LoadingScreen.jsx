const LoadingScreen = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f4f5f7]">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d5efc] to-[#8b7cf8] shadow-lg shadow-[#6d5efc]/30">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </div>
    <div className="h-6 w-6 rounded-full border-2 border-[#5f54f7] border-t-transparent animate-spin" />
  </div>
);

export default LoadingScreen;
