import React from "react";

export default function AppSidebar({
  isMobileOpen = false,
  onCloseMobile,
  activeTab = "dashboard",
  bookmarkCount = 0,
  onNavigateToDashboard,
  onNavigateToBookmark,
  onNavigateToFeedback,
  onNavigateToSettings,
  backShortcuts = [],
  isDarkMode = false,
}) {
  const navContent = (
    <div className="flex flex-col justify-between h-full py-6 px-3">
      {/* Top Menu Links */}
      <div className="space-y-1.5">
        {/* Dashboard */}
        <button
          onClick={() => {
            onNavigateToDashboard?.();
            onCloseMobile?.();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
            activeTab === "dashboard"
              ? isDarkMode
                ? "bg-[#0284c7]/20 text-[#38bdf8] border-l-4 border-[#0284c7]"
                : "bg-[#e0f2fe]/70 text-[#0284c7] border-l-4 border-[#0284c7]"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
          }`}
        >
          <svg className="w-4 h-4 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Dashboard</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => {
            onNavigateToBookmark?.();
            onCloseMobile?.();
          }}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
            activeTab === "saved" || activeTab === "bookmark"
              ? isDarkMode
                ? "bg-[#0284c7]/20 text-[#38bdf8] font-semibold border-l-4 border-[#0284c7]"
                : "bg-[#e0f2fe]/70 text-[#0284c7] font-semibold border-l-4 border-[#0284c7]"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Bookmark</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {bookmarkCount}
          </span>
        </button>

        {/* Rate & Feedback */}
        <button
          onClick={() => {
            onNavigateToFeedback?.();
            onCloseMobile?.();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
            activeTab === "feedback"
              ? isDarkMode
                ? "bg-[#0284c7]/20 text-[#38bdf8] font-semibold border-l-4 border-[#0284c7]"
                : "bg-[#e0f2fe]/70 text-[#0284c7] font-semibold border-l-4 border-[#0284c7]"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Rate & Feedback</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            onNavigateToSettings?.();
            onCloseMobile?.();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
            activeTab === "settings"
              ? isDarkMode
                ? "bg-[#0284c7]/20 text-[#38bdf8] font-semibold border-l-4 border-[#0284c7]"
                : "bg-[#e0f2fe]/70 text-[#0284c7] font-semibold border-l-4 border-[#0284c7]"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </button>
      </div>

      {/* Bottom Back Navigation Shortcuts (if any) */}
      {backShortcuts && backShortcuts.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 px-2">
          {backShortcuts.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => {
                sc.onClick?.();
                onCloseMobile?.();
              }}
              className={`w-full flex items-center gap-2 transition-colors py-1 cursor-pointer text-left ${
                sc.primary
                  ? "text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0284c7]"
                  : "text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {sc.primary ? (
                <svg className="w-3.5 h-3.5 text-[#0284c7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              )}
              <span className="truncate">{sc.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex w-56 lg:w-64 border-r flex-col shrink-0 overflow-y-auto transition-colors ${
          isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Body */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 shadow-2xl transition-transform ${
              isDarkMode ? "bg-slate-900 text-slate-100" : "bg-white text-slate-800"
            }`}
          >
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
