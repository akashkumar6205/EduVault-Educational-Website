import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getBookmarkCount } from "../utils/bookmarkStorage";

export default function Subject({
  university = { code: "RGPV", name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya" },
  course = { id: "btech", code: "B.Tech", name: "Bachelor of Technology", duration: "4 Years · 8 Semesters" },
  branch = { id: "cse", code: "CSE", name: "Computer Science & Engineering" },
  semester = { id: 1, name: "Semester 1" },
  onNavigateToDashboard,
  onNavigateToCourses,
  onNavigateToBranch,
  onNavigateToSemester,
  onNavigateToSettings,
  onNavigateToFeedback,
  onNavigateToBookmark,
  onNavigateToHome,
  onNavigateToResources,
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
  const [bookmarkCount, setBookmarkCount] = useState(() => getBookmarkCount());

  useEffect(() => {
    const handleBookmarkChange = () => setBookmarkCount(getBookmarkCount());
    window.addEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
    return () => window.removeEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
  }, []);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Subject curriculum mapped by semester id with official RGPV CSE subject codes
  const semesterSubjectsMap = {
    1: [
      { id: "chem", code: "BT-101", name: "Engineering Chemistry" },
      { id: "m1", code: "BT-102", name: "Mathematics - I" },
      { id: "eng", code: "BT-103", name: "English for Communication" },
      { id: "beee", code: "BT-104", name: "Basic Electrical & Electronics Engineering" },
      { id: "eg", code: "BT-105", name: "Engineering Graphics" },
    ],
    2: [
      { id: "phy", code: "BT-201", name: "Engineering Physics" },
      { id: "m2", code: "BT-202", name: "Mathematics - II" },
      { id: "bme", code: "BT-203", name: "Basic Mechanical Engineering" },
      { id: "bce", code: "BT-204", name: "Basic Civil Engineering & Mechanics" },
      { id: "bcomp", code: "BT-205", name: "Basic Computer Engineering" },
    ],
    3: [
      { id: "es", code: "ES-301", name: "Energy & Environmental Engineering" },
      { id: "ds", code: "CS-302", name: "Discrete Structure" },
      { id: "dsa", code: "CS-303", name: "Data Structure" },
      { id: "digi", code: "CS-304", name: "Digital Systems" },
      { id: "oopm", code: "CS-305", name: "Object Oriented Programming & Methodology" },
    ],
    4: [
      { id: "m3", code: "BT-401", name: "Mathematics - III" },
      { id: "ada", code: "CS-402", name: "Analysis & Design of Algorithm" },
      { id: "se", code: "CS-403", name: "Software Engineering" },
      { id: "coa", code: "CS-404", name: "Computer Organization & Architecture" },
      { id: "os", code: "CS-405", name: "Operating Systems" },
    ],
    5: [
      { id: "toc", code: "CS-501", name: "Theory of Computation" },
      { id: "dbms", code: "CS-502", name: "Database Management Systems" },
      { id: "cs_sec", code: "CS-503", name: "Data Analytics" },
      { id: "iwt", code: "CS-504", name: "Internet & Web Technology" },
    ],
    6: [
      { id: "ml", code: "CS-601", name: "Machine Learning" },
      { id: "cn", code: "CS-602", name: "Computer Networks" },
      { id: "cd", code: "CS-603", name: "Compiler Design" },
      { id: "cg", code: "CS-604", name: "Computer Graphics & Visualization" },
    ],
    7: [
      { id: "sa", code: "CS-701", name: "Software Architectures" },
      { id: "dl", code: "CS-702", name: "Deep & Reinforcement Learning" },
      { id: "cns", code: "CS-703", name: "Cryptography & Information Security" },
      { id: "bda", code: "CS-704", name: "Big Data Analytics" },
    ],
    8: [
      { id: "iot", code: "CS-801", name: "Internet of Things (IoT)" },
      { id: "bc", code: "CS-802", name: "Blockchain Technologies" },
      { id: "cc", code: "CS-803", name: "Cloud Computing" },
      { id: "proj", code: "CS-804", name: "Major Project & Seminar" },
    ],
  };

  const currentSubjects = semesterSubjectsMap[semester?.id] || semesterSubjectsMap[1];

  const filteredSubjects = currentSubjects.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sub.code && sub.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubjectSelect = (sub) => {
    setSelectedSubject(sub);
    if (onNavigateToResources) {
      onNavigateToResources(sub);
    }
  };

  const displayName = user?.displayName || "Student User";
  const displayEmail = user?.email || "student@eduvault.io";
  const userInitial = displayName.charAt(0).toUpperCase() || "S";

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
              placeholder="Search subjects or codes (e.g. CS-402, Operating Systems)..."
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
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
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
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xs font-bold">{userInitial}</span>
              )}
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl border py-2 shadow-xl z-50 animate-fade-in ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-100 text-slate-800"
              }`}>
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateToHome?.();
                  }}
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
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
            {/* Dashboard Navigation */}
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

          {/* Bottom Back Navigation Shortcuts */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 px-2">
            <button
              onClick={onNavigateToSemester}
              className="w-full flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0284c7] transition-colors py-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Semesters</span>
            </button>

            <button
              onClick={onNavigateToBranch}
              className="w-full flex items-center gap-2 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Change Branch</span>
            </button>

            <button
              onClick={onNavigateToDashboard}
              className="w-full flex items-center gap-2 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
            <button
              onClick={onNavigateToCourses}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {course.code || "Course"}
            </button>
            <span className="text-slate-300">›</span>
            <button
              onClick={onNavigateToBranch}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {branch.code || "Branch"}
            </button>
            <span className="text-slate-300">›</span>
            <button
              onClick={onNavigateToSemester}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {semester.name || "Semester"}
            </button>
            <span className="text-slate-300">›</span>
            <span className="bg-[#e0f2fe] text-[#0284c7] font-bold px-3 py-1 rounded-full shadow-xs">
              Subject
            </span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-400">Resources</span>
          </div>

          {/* Selected Path Banner Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-900/50 bg-[#e0f2fe]/60  px-4 py-1.5 mb-6 text-xs text-[#0284c7] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse" />
            <span>
              {university.code} • {course.code} • {branch.code} • {semester.name}
            </span>
          </div>

          {/* Section Heading */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Select Subject
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose a subject to access syllabus, notes, and study resources.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToSemester}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs hover:border-[#0284c7] hover:bg-[#e0f2fe]/30 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#0284c7] transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Semesters</span>
              </button>
            </div>
          </div>

          {/* Empty search state */}
          {filteredSubjects.length === 0 && (
            <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No subjects match "{searchQuery}"</h3>
              <p className="text-xs text-slate-400 mt-1">Try searching with a different subject keyword.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-[#0284c7] text-white text-xs font-semibold rounded-xl hover:bg-[#0369a1] transition-all cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* ─── Subject Cards Grid (Medium Card Size with Subject Code & Name) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl">
            {filteredSubjects.map((sub) => (
              <div
                key={sub.id}
                onClick={() => handleSubjectSelect(sub)}
                className={`group relative rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer min-h-[115px] sm:min-h-[125px] ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 hover:border-[#0284c7]/50 hover:bg-slate-850/80"
                    : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-[#0284c7]/40 hover:-translate-y-0.5"
                } ${
                  selectedSubject?.id === sub.id ? "ring-2 ring-[#0284c7] border-[#0284c7]" : ""
                }`}
              >
                {sub.code && (
                  <span className="text-[11px] font-black tracking-wider uppercase text-[#0284c7] bg-sky-50 dark:text-sky-300 px-2.5 py-0.5 rounded-md border border-sky-200/60 dark:border-sky-800/60 mb-2">
                    {sub.code}
                  </span>
                )}
                <h2
                  className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                    isDarkMode
                      ? "text-white group-hover:text-[#38bdf8]"
                      : "text-slate-800 group-hover:text-[#0284c7]"
                  }`}
                >
                  {sub.name}
                </h2>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
