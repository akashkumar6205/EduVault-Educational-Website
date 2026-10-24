import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  getBookmarks,
  removeBookmark,
  clearAllBookmarks,
  addBookmark,
} from "../utils/bookmarkStorage";

export default function Bookmark({
  onNavigateToDashboard,
  onNavigateToSettings,
  onNavigateToFeedback,
  onNavigateToHome,
  onNavigateToResources,
  onNavigateToUnit,
  isDarkMode: propIsDarkMode,
  onToggleTheme,
}) {
  const { user, logout } = useAuth();
  const { isDarkMode: ctxDarkMode, toggleTheme: ctxToggleTheme } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : ctxDarkMode;
  const toggleTheme = onToggleTheme || ctxToggleTheme;

  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "notes", "pyq", "important"
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // For modal preview
  const [toastMessage, setToastMessage] = useState("");

  // Sync bookmarks from localStorage & listen for changes
  const loadBookmarks = () => {
    const list = getBookmarks();
    setBookmarks(Array.isArray(list) ? list : []);
  };

  useEffect(() => {
    loadBookmarks();
    const handleStorageChange = () => loadBookmarks();
    window.addEventListener("eduvault_bookmarks_changed", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("eduvault_bookmarks_changed", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleRemove = (e, id, title) => {
    e.stopPropagation();
    const updated = removeBookmark(id);
    setBookmarks(Array.isArray(updated) ? updated : []);
    showToast(`Removed "${title.slice(0, 24)}..." from Bookmarks`);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all your bookmarks?")) {
      const cleared = clearAllBookmarks();
      setBookmarks(cleared);
      showToast("All bookmarks cleared.");
      setSelectedItem(null);
    }
  };

  const displayName = user?.displayName || "Student User";
  const displayEmail = user?.email || "student@eduvault.io";
  const userInitial = displayName.charAt(0).toUpperCase() || "S";

  // Filter bookmarks by search
  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
  const filtered = safeBookmarks.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.title?.toLowerCase().includes(q) ||
      b.subject?.toLowerCase().includes(q) ||
      b.subjectCode?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.unit?.toLowerCase().includes(q);
    return matchesSearch;
  });

  // Divide into separate sections
  const notesBookmarks = filtered.filter((b) => b.type === "notes");
  const pyqBookmarks = filtered.filter((b) => b.type === "pyq");
  const importantBookmarks = filtered.filter((b) => b.type === "important");

  // Counter totals
  const totalCount = safeBookmarks.length;
  const notesCount = notesBookmarks.length;
  const pyqCount = pyqBookmarks.length;
  const importantCount = importantBookmarks.length;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f8fafd] text-slate-800"
      } flex flex-col font-sans transition-colors duration-200`}
    >
      {/* ─── Toast Notification ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-bounce">
          <svg className="w-4 h-4 text-emerald-400 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── Top Navbar ─── */}
      <header
        className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-30 transition-colors ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        }`}
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-0.5 text-xl tracking-tight cursor-pointer focus:outline-none"
            title="Return to Dashboard"
          >
            <span className={`font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Edu</span>
            <span className="font-extrabold text-[#0284c7]">Vault</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] inline-block ml-0.5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
            <span className="text-[11px] font-bold text-[#0284c7] bg-sky-50 dark:bg-sky-950/70 border border-sky-200/60 dark:border-sky-800/60 px-2 py-0.5 rounded-md">
              RGPV
            </span>
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Bookmarks Library</span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-md mx-6 hidden sm:block">
          <div className="relative">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search saved notes, PYQs, questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 transition-all ${
                isDarkMode
                  ? "bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-[#0284c7]"
                  : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0284c7]"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode
                ? "border-slate-800 hover:bg-slate-800 text-amber-400"
                : "border-slate-100 hover:bg-slate-50 text-slate-600"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0284c7] to-sky-400 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {userInitial}
              </div>
              <div className="hidden lg:block text-left text-xs pr-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200 leading-none">{displayName}</p>
                <p className="text-[10px] text-slate-400 leading-none mt-1">Student</p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                }`}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateToDashboard();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateToSettings();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                <button
                  onClick={async () => {
                    setShowProfileMenu(false);
                    await logout();
                    if (onNavigateToHome) onNavigateToHome();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Body Layout: Left Sidebar + Main Content ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside
          className={`w-64 border-r flex flex-col justify-between p-4 hidden md:flex transition-colors shrink-0 ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          }`}
        >
          <div className="space-y-1.5">
            {/* Dashboard */}
            <button
              onClick={onNavigateToDashboard}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </button>

            {/* Bookmark (ACTIVE!) */}
            <button
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left border-l-4 border-[#0284c7] cursor-pointer ${
                isDarkMode
                  ? "bg-[#0284c7]/20 text-[#38bdf8]"
                  : "bg-[#e0f2fe]/80 text-[#0284c7]"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Bookmark</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0284c7] text-white">
                {totalCount}
              </span>
            </button>

            {/* Rate & Feedback */}
            <button
              onClick={onNavigateToFeedback}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Rate & Feedback</span>
            </button>

            {/* Settings */}
            <button
              onClick={onNavigateToSettings}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 px-2 space-y-2">
            {totalCount > 0 && (
              <button
                onClick={handleClearAll}
                className="w-full flex items-center gap-2 text-[11px] font-medium text-slate-400 hover:text-rose-500 transition-colors py-1 cursor-pointer"
                title="Clear all saved bookmarks"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear All Bookmarks</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-slate-400">Sync Online</span>
            </div>
          </div>
        </aside>

        {/* ─── Main Content Area ─── */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-8">
          {/* Breadcrumb Steps */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-6">
            <button
              onClick={onNavigateToDashboard}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <span className="text-slate-300">›</span>
            <span className="bg-[#e0f2fe] text-[#0284c7] font-bold px-3 py-1 rounded-full shadow-xs">
              Bookmark
            </span>
          </div>

          {/* Page Heading & Metrics */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Saved Bookmarks
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your saved collection divided into Notes, PYQs, and Unit-wise Important Questions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {totalCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-rose-400 hover:text-rose-500 transition-all cursor-pointer shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear All</span>
                </button>
              )}
              <button
                onClick={onNavigateToDashboard}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0284c7] hover:bg-[#0369a1] text-white transition-all cursor-pointer shadow-xs"
              >
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>


          {/* ─── Metric Filter Cards ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {/* All */}
            <button
              onClick={() => setActiveTab("all")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTab === "all"
                  ? "ring-2 ring-[#0284c7] border-[#0284c7] bg-[#e0f2fe]/40 dark:bg-[#0284c7]/15"
                  : isDarkMode
                  ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                  : "bg-white border-slate-100 hover:border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">All Saved</span>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
              </div>
              <p className={`text-2xl font-black mt-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {totalCount}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Total saved items</p>
            </button>

            {/* Notes */}
            <button
              onClick={() => setActiveTab("notes")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTab === "notes"
                  ? "ring-2 ring-sky-500 border-sky-500 bg-sky-500/10"
                  : isDarkMode
                  ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                  : "bg-white border-slate-100 hover:border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-500">Notes</span>
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              </div>
              <p className={`text-2xl font-black mt-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {notesCount}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Handwritten Notes</p>
            </button>

            {/* PYQ */}
            <button
              onClick={() => setActiveTab("pyq")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTab === "pyq"
                  ? "ring-2 ring-indigo-500 border-indigo-500 bg-indigo-500/10"
                  : isDarkMode
                  ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                  : "bg-white border-slate-100 hover:border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">PYQ</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              </div>
              <p className={`text-2xl font-black mt-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {pyqCount}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Exam Papers</p>
            </button>

            {/* Important Questions */}
            <button
              onClick={() => setActiveTab("important")}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTab === "important"
                  ? "ring-2 ring-amber-500 border-amber-500 bg-amber-500/10"
                  : isDarkMode
                  ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                  : "bg-white border-slate-100 hover:border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Important</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <p className={`text-2xl font-black mt-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {importantCount}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Unit Questions</p>
            </button>
          </div>

          {/* Empty Global Search */}
          {filtered.length === 0 && (
            <div
              className={`p-12 text-center rounded-3xl border mb-8 ${
                isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {searchQuery ? `No bookmarks match "${searchQuery}"` : "No bookmarks saved yet"}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                {searchQuery
                  ? "Try searching for a different keyword or subject code."
                  : "You can bookmark Handwritten Notes, Previous Year Questions, and Important Questions while exploring resources."}
              </p>
              <div className="flex items-center justify-center gap-3 mt-5">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 bg-[#0284c7] text-white text-xs font-semibold rounded-xl hover:bg-[#0369a1] cursor-pointer"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    onClick={onNavigateToDashboard}
                    className="px-4 py-2 bg-[#0284c7] text-white text-xs font-semibold rounded-xl hover:bg-[#0369a1] cursor-pointer"
                  >
                    Explore Subjects
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* ─── SECTION 1: HANDWRITTEN NOTES ─── */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {filtered.length > 0 && (
            <>
              {(activeTab === "all" || activeTab === "notes") && (
                <section className="mb-12">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/60 flex items-center justify-center text-[#0284c7]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-lg font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        Handwritten Notes
                      </h2>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                        {notesBookmarks.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Verified handwritten chapter notes and formula summaries
                    </p>
                  </div>
                </div>
              </div>

              {notesBookmarks.length === 0 ? (
                <div className={`p-6 text-center rounded-2xl border text-xs text-slate-400 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-100"
                }`}>
                  No handwritten notes bookmarked.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {notesBookmarks.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`group relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 hover:border-sky-500/50 hover:bg-slate-850"
                          : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-sky-400/40 hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Top Bar: Subject Badge + Remove Icon */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 uppercase">
                            {item.subjectCode || "Notes"}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {item.unit || item.semester}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleRemove(e, item.id, item.title)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove bookmark"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Title & Subject */}
                      <div>
                        <h3 className={`text-sm font-bold line-clamp-2 transition-colors ${
                          isDarkMode ? "text-white group-hover:text-sky-400" : "text-slate-900 group-hover:text-[#0284c7]"
                        }`}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          {item.subject}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Footer Details & Action */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">
                          {item.pages || "Verified PDF"}
                        </span>
                        <span className="font-bold text-[#0284c7] group-hover:underline inline-flex items-center gap-1">
                          <span>Read Notes</span>
                          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* ─── SECTION 2: PREVIOUS YEAR QUESTIONS (PYQ) ─── */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {(activeTab === "all" || activeTab === "pyq") && (
            <section className="mb-12">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-lg font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        Previous Year Question Papers (PYQ)
                      </h2>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {pyqBookmarks.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      RGPV university semester exam question papers with solution guides
                    </p>
                  </div>
                </div>
              </div>

              {pyqBookmarks.length === 0 ? (
                <div className={`p-6 text-center rounded-2xl border text-xs text-slate-400 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-100"
                }`}>
                  No PYQ papers bookmarked.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {pyqBookmarks.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`group relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850"
                          : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-indigo-400/40 hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Top Bar: Subject Badge + Year Badge + Remove */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 uppercase">
                            {item.subjectCode || "PYQ"}
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md">
                            {item.year || "Exam Paper"}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleRemove(e, item.id, item.title)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove bookmark"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Title & Subject */}
                      <div>
                        <h3 className={`text-sm font-bold line-clamp-2 transition-colors ${
                          isDarkMode ? "text-white group-hover:text-indigo-400" : "text-slate-900 group-hover:text-indigo-600"
                        }`}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          {item.subject} • {item.semester}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">
                          {item.examType || "RGPV Main"}
                        </span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline inline-flex items-center gap-1">
                          <span>View Paper</span>
                          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* ─── SECTION 3: UNIT WISE IMPORTANT QUESTIONS ─── */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {(activeTab === "all" || activeTab === "important") && (
            <section className="mb-12">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-lg font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        Unit-Wise Important Questions
                      </h2>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        {importantBookmarks.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      High-yield repeated exam topics and guaranteed score boosters
                    </p>
                  </div>
                </div>
              </div>

              {importantBookmarks.length === 0 ? (
                <div className={`p-6 text-center rounded-2xl border text-xs text-slate-400 ${
                  isDarkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-100"
                }`}>
                  No important questions bookmarked.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {importantBookmarks.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`group relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 hover:border-amber-500/50 hover:bg-slate-850"
                          : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-amber-400/40 hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Top Bar: Subject Badge + Unit Pill + Remove */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 uppercase">
                            {item.subjectCode || "Important"}
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-md">
                            {item.unit || "Unit Q"}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleRemove(e, item.id, item.title)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove bookmark"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Title & Frequency */}
                      <div>
                        <h3 className={`text-sm font-bold line-clamp-2 transition-colors ${
                          isDarkMode ? "text-white group-hover:text-amber-400" : "text-slate-900 group-hover:text-amber-600"
                        }`}>
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            ★ {item.frequency || "High Yield"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-semibold">
                          Weightage: {item.marks || "7 Marks"}
                        </span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 group-hover:underline inline-flex items-center gap-1">
                          <span>View Solution</span>
                          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </main>
      </div>

      {/* ─── Item Preview Modal ─── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${
                    selectedItem.type === "notes"
                      ? "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200"
                      : selectedItem.type === "pyq"
                      ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200"
                      : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200"
                  }`}
                >
                  {selectedItem.categoryLabel || selectedItem.type}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {selectedItem.subjectCode}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              {selectedItem.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 my-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-[#0284c7]">{selectedItem.subject}</span>
              <span>•</span>
              <span>{selectedItem.semester}</span>
              <span>•</span>
              <span>{selectedItem.branch}</span>
              {selectedItem.unit && (
                <>
                  <span>•</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{selectedItem.unit}</span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
              {selectedItem.description}
            </p>

            {/* Extra highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Author / Source</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedItem.author || selectedItem.year || "RGPV Curriculum"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Exam Note / Frequency</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedItem.frequency || selectedItem.pages || "End-Sem Syllabus"}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={(e) => {
                  handleRemove(e, selectedItem.id, selectedItem.title);
                  setSelectedItem(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                Remove from Bookmarks
              </button>
              <button
                onClick={() => {
                  showToast("Opening study viewer...");
                  setSelectedItem(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0284c7] hover:bg-[#0369a1] text-white transition-all shadow-md cursor-pointer"
              >
                Open Study Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
