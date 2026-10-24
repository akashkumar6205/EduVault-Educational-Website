import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getBookmarkCount } from "../utils/bookmarkStorage";

export default function Courses({
  university = { code: "RGPV", name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya" },
  onNavigateToDashboard,
  onNavigateToHome,
  onNavigateToSettings,
  onNavigateToBranch,
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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [bookmarkCount, setBookmarkCount] = useState(() => getBookmarkCount());

  useEffect(() => {
    const handleBookmarkChange = () => setBookmarkCount(getBookmarkCount());
    window.addEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
    return () => window.removeEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
  }, []);

  const courses = [
    {
      id: "btech",
      code: "B.Tech",
      name: "Bachelor of Technology",
      duration: "4 Years · 8 Semesters",
      isAvailable: true,
      description:
        "Comprehensive unit-wise handwritten notes, pyq , repeat-topic analysis for all engineering branches.",
      branchesCount: "8 Branches",
      branches: ["CSE", "IT", "ECE", "ME", "CE", "EE", "AI/ML", "Data Science"],
      accentColor: "#0284c7",
      icon: (
        <svg className="w-8 h-8 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v7" />
        </svg>
      ),
    },
  ];

  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f8fafd] text-slate-800"} flex flex-col font-sans transition-colors duration-200`}>
      {/* ─── Top Navbar ─── */}
      <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-30 transition-colors ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
      }`}>
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-0.5 text-xl tracking-tight cursor-pointer focus:outline-none"
            title="Return to Dashboard"
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
              placeholder="Search courses, branches, or subjects..."
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${
                isDarkMode
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
            className={`p-2 rounded-full border transition-colors ${
              isDarkMode
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
              <div className={`absolute right-0 mt-2 w-56 rounded-xl border py-2 shadow-xl z-50 animate-fade-in ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-100 text-slate-800"
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
        <aside className={`w-56 lg:w-64 border-r flex flex-col justify-between py-6 px-3 shrink-0 transition-colors ${
          isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div className="space-y-1.5">
            {/* Dashboard (Active) */}
            <button
              onClick={onNavigateToDashboard}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left bg-[#e0f2fe]/70 text-[#0284c7] border-l-4 border-[#0284c7] cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
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
                setActiveTab("feedback");
                onNavigateToFeedback?.();
              }}
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

          {/* Bottom Back to Universities */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 px-2">
            <button
              onClick={onNavigateToDashboard}
              className="w-full flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0284c7] transition-colors py-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Change University</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-8">
          {/* Breadcrumb Steps */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-6">
            <button
              onClick={onNavigateToDashboard}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {university.code || "University"}
            </button>
            <span className="text-slate-300">›</span>
            <span className="bg-[#e0f2fe] text-[#0284c7] font-bold px-3 py-1 rounded-full shadow-xs">
              Course
            </span>
            <span className="text-slate-300">›</span>
            <button
              onClick={() => onNavigateToBranch && onNavigateToBranch(courses[0])}
              className="text-slate-400 hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              Branch
            </button>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Semester</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Subject</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Resources</span>
          </div>

          {/* Selected University Banner Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-900/50 bg-[#e0f2fe]/60  px-4 py-1.5 mb-6 text-xs text-[#0284c7] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse" />
            <span>Curriculum for {university.name} ({university.code})</span>
          </div>

          {/* Section Heading */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Select Course
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Currently showing active degree programs and syllabus for {university.code}.
              </p>
            </div>

            <button
              onClick={onNavigateToDashboard}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs hover:border-[#0284c7] hover:bg-[#e0f2fe]/30 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#0284c7] transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Universities</span>
            </button>
          </div>

          {/* Courses Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  if (c.isAvailable) {
                    setSelectedCourse(c.id);
                    if (onNavigateToBranch) {
                      onNavigateToBranch(c);
                    }
                  }
                }}
                className={`relative rounded-2xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                } ${
                  c.isAvailable
                    ? "hover:shadow-xl hover:border-[#0284c7]/50 hover:-translate-y-1 cursor-pointer ring-1 ring-[#0284c7]/20"
                    : "opacity-80 cursor-not-allowed"
                } ${
                  selectedCourse === c.id ? "ring-2 ring-[#0284c7] border-[#0284c7]" : ""
                }`}
                style={{ minHeight: "260px" }}
              >
                {/* Top header row */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        c.isAvailable
                          ? "bg-[#e0f2fe] border border-sky-200"
                          : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      }`}>
                        {c.icon}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold tracking-wider uppercase text-[#0284c7] bg-sky-50 dark:bg-sky-950/50 px-2.5 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/40">
                          {c.duration}
                        </span>
                        <h2 className={`text-xl font-bold tracking-tight mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          {c.code}
                        </h2>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {c.name}
                        </p>
                      </div>
                    </div>

                    {/* Lock or Active Status Badge */}
                    {!c.isAvailable ? (
                      <div className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/20 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active Course
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {c.description}
                  </p>

                  {/* Available branches tags for B.Tech */}
                  {c.isAvailable && c.branches && (
                    <div className="mb-4">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Supported Branches:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.branches.map((b) => (
                          <span
                            key={b}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">

                  {c.isAvailable ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigateToBranch) {
                          onNavigateToBranch(c);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] shadow-md shadow-[#0284c7]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>Explore Branches</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      COMING SOON
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
