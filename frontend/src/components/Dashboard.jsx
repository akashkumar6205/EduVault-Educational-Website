import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getBookmarkCount } from "../utils/bookmarkStorage";

export default function Dashboard({
  onNavigateToHome,
  onNavigateToSettings,
  onNavigateToCourses,
  onNavigateToFeedback,
  onNavigateToBookmark,
  isDarkMode: propIsDarkMode,
  onToggleTheme,
}) {
  const { user, logout } = useAuth();
  const { isDarkMode: ctxDarkMode, toggleTheme: ctxToggleTheme } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : ctxDarkMode;
  const toggleTheme = onToggleTheme || ctxToggleTheme;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [bookmarkCount, setBookmarkCount] = useState(() => getBookmarkCount());

  useEffect(() => {
    const updateCount = () => setBookmarkCount(getBookmarkCount());
    window.addEventListener("eduvault_bookmarks_changed", updateCount);
    return () => window.removeEventListener("eduvault_bookmarks_changed", updateCount);
  }, []);

  const universities = [
    {
      id: "rgpv",
      code: "RGPV",
      name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
      isAvailable: true,
      accentColor: "#dc2626",
      logo: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="46" fill="#fff" stroke="#dc2626" strokeWidth="3" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
          {/* Emblem details */}
          <path
            d="M50 16 L53 26 L63 26 L55 32 L58 42 L50 36 L42 42 L45 32 L37 26 L47 26 Z"
            fill="#dc2626"
            opacity="0.9"
          />
          <path
            d="M32 46 C32 60 50 68 50 68 C50 68 68 60 68 46 L68 40 L32 40 Z"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.5"
          />
          {/* Inner torch / book motif */}
          <path d="M48 45 L52 45 L52 56 L48 56 Z" fill="#dc2626" />
          <path d="M50 40 C46 43 54 43 50 40" fill="#dc2626" />
          <path d="M38 58 Q50 64 62 58" stroke="#dc2626" strokeWidth="2" fill="none" />
          {/* Base ribbon */}
          <path
            d="M26 73 Q50 82 74 73 L70 80 Q50 88 30 80 Z"
            fill="#dc2626"
          />
          <text
            x="50"
            y="79"
            textAnchor="middle"
            fontSize="5.5"
            fontWeight="bold"
            fill="#ffffff"
            letterSpacing="0.5"
          >
            BHOPAL
          </text>
        </svg>
      ),
    },
  ];

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUniversitySelect = (uni) => {
    if (!uni.isAvailable) return;
    setSelectedUniversity(uni);
    if (onNavigateToCourses) {
      onNavigateToCourses(uni);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f8fafd] text-slate-800"} flex flex-col font-sans transition-colors duration-200`}>
      {/* ─── Top Navbar ─── */}
      <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-30 transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        }`}>
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-0.5 text-xl tracking-tight cursor-pointer focus:outline-none"
            title="Return to Landing Page"
          >
            <span className={`font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Edu</span>
            <span className="font-extrabold text-[#0284c7]">Vault</span>
          </button>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-lg mx-6 hidden sm:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, topics, or units..."
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${isDarkMode
                  ? "bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-400 focus:bg-slate-800"
                  : "bg-white border border-slate-200 text-slate-700 placeholder-slate-400 shadow-xs focus:border-[#0284c7]/50"
                }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-colors ${isDarkMode
                ? "border-slate-700 text-amber-300 hover:bg-slate-800"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Palette button */}
          <button
            className={`p-2 rounded-full border transition-colors ${isDarkMode
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            title="Color Palette"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4 5 5 0 015-5h4a3 3 0 013 3v1a2 2 0 002 2h1a3 3 0 003-3 7 7 0 10-14 0" />
            </svg>
          </button>

          {/* Bell notification button */}
          <button
            className={`p-2 rounded-full border transition-colors relative ${isDarkMode
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            title="Notifications"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0284c7] rounded-full" />
          </button>

          {/* User profile avatar / dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center h-8 w-8 rounded-full overflow-hidden border border-slate-300 ring-2 ring-transparent hover:ring-[#0284c7]/40 transition-all cursor-pointer bg-slate-900 text-white"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl border py-2 shadow-xl z-50 animate-fade-in ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-100 text-slate-800"
                }`}>
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold truncate">{user?.displayName || "Guest User"}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || "guest@eduvault.io"}</p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateToHome?.();
                  }}
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Landing Page
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    onNavigateToHome?.();
                  }}
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Body Layout: Left Sidebar + Main Content ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className={`w-56 lg:w-64 border-r flex flex-col justify-between py-6 px-3 shrink-0 transition-colors ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
          }`}>
          <div className="space-y-1.5">
            {/* Dashboard (Active) */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left relative ${activeTab === "dashboard"
                  ? isDarkMode
                    ? "bg-[#0284c7]/20 text-[#38bdf8] font-semibold border-l-4 border-[#0284c7]"
                    : "bg-[#e0f2fe]/70 text-[#0284c7] font-semibold border-l-4 border-[#0284c7]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => {
                if (onNavigateToBookmark) onNavigateToBookmark();
                else setActiveTab("saved");
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                activeTab === "saved"
                  ? "bg-[#e0f2fe]/70 text-[#0284c7] font-semibold border-l-4 border-[#0284c7]"
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
            {/* Rate & Feedback */}
            <button
              onClick={() => {
                setActiveTab("feedback");
                onNavigateToFeedback?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${activeTab === "feedback"
                  ? "bg-[#e0f2fe]/70 text-[#0284c7] font-semibold border-l-4 border-[#0284c7]"
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
                setActiveTab("settings");
                onNavigateToSettings?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${activeTab === "settings"
                  ? "bg-[#e0f2fe]/70 text-[#0284c7] font-semibold border-l-4 border-[#0284c7]"
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

          {/* Bottom user status */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-slate-400">Sync Online</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-8">
          {/* Breadcrumb Steps */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-[#e0f2fe] text-[#0284c7] font-semibold px-3 py-1 rounded-full shadow-xs">
              University
            </span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Course</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Branch</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Semester</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Subject</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Resources</span>
          </div>

          {/* Section Heading */}
          <div className="mt-8 mb-6 flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Select University
              </h1>
              {selectedUniversity && (
                <p className="text-xs text-emerald-600 mt-1 font-medium">
                  Selected: {selectedUniversity.name} ({selectedUniversity.code})
                </p>
              )}
            </div>
            {searchQuery && (
              <span className="text-xs text-slate-400">
                Found {filteredUniversities.length} result(s)
              </span>
            )}
          </div>

          {/* University Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni) => (
              <div
                key={uni.id}
                onClick={() => handleUniversitySelect(uni)}
                className={`group relative rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${isDarkMode
                    ? "bg-slate-900 border border-slate-800"
                    : "bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                  } ${uni.isAvailable
                    ? "hover:shadow-xl hover:border-[#0284c7]/40 hover:-translate-y-1 cursor-pointer"
                    : "opacity-90 cursor-not-allowed"
                  } ${selectedUniversity?.id === uni.id
                    ? "ring-2 ring-[#0284c7] border-[#0284c7]"
                    : ""
                  }`}
                style={{ minHeight: "260px" }}
              >
                {/* Lock icon for unavailable universities */}
                {!uni.isAvailable && (
                  <div className="absolute top-5 right-5 w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                )}

                {/* University Emblem Container */}
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 p-2 transition-transform duration-300 ${isDarkMode ? "bg-slate-800" : "bg-white"
                  } ${uni.isAvailable ? "group-hover:scale-105" : ""}`}>
                  {uni.logo}
                </div>

                {/* University Short Code */}
                <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {uni.code}
                </h2>

                {/* University Full Name */}
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-[220px] leading-relaxed">
                  {uni.name}
                </p>

                {/* Coming Soon Badge */}
                {!uni.isAvailable && (
                  <div className="mt-6 flex justify-end w-full">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      COMING SOON
                    </span>
                  </div>
                )}

                {/* Active indicator for RGPV */}
                {uni.isAvailable && (
                  <div className="mt-6 flex justify-center w-full">
                    <span className="text-[11px] font-semibold text-[#0284c7] group-hover:underline flex items-center gap-1">
                      <span>Explore</span>
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
