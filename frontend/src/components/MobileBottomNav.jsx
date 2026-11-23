import React from "react";

export default function MobileBottomNav({
  activeTab = "dashboard",
  bookmarkCount = 0,
  onNavigateToDashboard,
  onNavigateToBookmark,
  onNavigateToFeedback,
  onNavigateToSettings,
  isDarkMode = false,
}) {
  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-2 py-2 flex items-center justify-around transition-colors backdrop-blur-md ${
        isDarkMode
          ? "bg-slate-900/90 border-slate-800 text-slate-300"
          : "bg-white/90 border-slate-200 text-slate-600 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
      }`}
    >
      {/* Dashboard */}
      <button
        onClick={onNavigateToDashboard}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === "dashboard"
            ? "text-[#0284c7] font-bold"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span className="text-[10px]">Dashboard</span>
      </button>

      {/* Bookmark */}
      <button
        onClick={onNavigateToBookmark}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative cursor-pointer ${
          activeTab === "saved" || activeTab === "bookmark"
            ? "text-[#0284c7] font-bold"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <div className="relative">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {bookmarkCount > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-[#0284c7] text-white text-[9px] font-bold rounded-full">
              {bookmarkCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Bookmarks</span>
      </button>

      {/* Rate & Feedback */}
      <button
        onClick={onNavigateToFeedback}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === "feedback"
            ? "text-[#0284c7] font-bold"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-[10px]">Feedback</span>
      </button>

      {/* Settings */}
      <button
        onClick={onNavigateToSettings}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === "settings"
            ? "text-[#0284c7] font-bold"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[10px]">Settings</span>
      </button>
    </nav>
  );
}
