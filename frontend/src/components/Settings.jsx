import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Settings({
  onNavigateToDashboard,
  onNavigateToHome,
  onNavigateToFeedback,
  currentTheme,
  onSaveTheme,
  isDarkMode: propIsDarkMode,
  onToggleTheme,
}) {
  const { user, logout } = useAuth();
  const { theme: ctxTheme, setTheme: ctxSetTheme, isDarkMode: ctxDarkMode, toggleTheme: ctxToggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [savedToast, setSavedToast] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState(user?.displayName || "Student");
  const [university, setUniversity] = useState("RGPV");
  const [course, setCourse] = useState("B.Tech");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [semester, setSemester] = useState("4th Semester");

  // Active theme selection in settings
  const effectiveTheme = currentTheme || ctxTheme || localStorage.getItem("eduvault_theme") || "light";
  const [themeMode, setThemeMode] = useState(effectiveTheme);
  const isDarkMode = themeMode === "dark";

  // Keep themeMode in sync if external theme changes
  useEffect(() => {
    if (currentTheme) {
      setThemeMode(currentTheme);
    } else if (ctxTheme) {
      setThemeMode(ctxTheme);
    }
  }, [currentTheme, ctxTheme]);

  const handleModeChange = (mode) => {
    setThemeMode(mode);
  };

  const handleToggleNavbarTheme = () => {
    const nextMode = isDarkMode ? "light" : "dark";
    setThemeMode(nextMode);
    if (ctxSetTheme) ctxSetTheme(nextMode);
    if (onSaveTheme) onSaveTheme(nextMode);
    localStorage.setItem("eduvault_theme", nextMode);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("eduvault_theme", themeMode);

    // Apply theme immediately to document
    document.documentElement.setAttribute("data-theme", themeMode);
    const themeClasses = [
      "dark",
      "theme-cosmic-gold",
      "theme-emerald-sage",
      "theme-crimson-velvet",
      "theme-ocean-cyan",
    ];
    themeClasses.forEach((cls) => document.documentElement.classList.remove(cls));

    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (themeMode === "cosmic-gold") {
      document.documentElement.classList.add("theme-cosmic-gold");
    } else if (themeMode === "emerald-sage") {
      document.documentElement.classList.add("theme-emerald-sage");
    } else if (themeMode === "crimson-velvet") {
      document.documentElement.classList.add("theme-crimson-velvet");
    } else if (themeMode === "ocean-cyan") {
      document.documentElement.classList.add("theme-ocean-cyan");
    }

    if (ctxSetTheme) {
      ctxSetTheme(themeMode);
    }
    if (onSaveTheme) {
      onSaveTheme(themeMode);
    }

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f8fafd] text-slate-800"} flex flex-col font-sans transition-colors duration-200`}>
      {/* ─── Top Navbar ─── */}
      <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-30 transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
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
              placeholder="Search settings, preferences..."
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${isDarkMode
                  ? "bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-400 focus:bg-slate-800"
                  : "bg-white border border-slate-200 text-slate-700 placeholder-slate-400 shadow-xs focus:border-[#0284c7]/50"
                }`}
            />
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Mode Toggle Button */}
          <button
            onClick={handleToggleNavbarTheme}
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

            {/* My Progress */}
            <button
              onClick={onNavigateToDashboard}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>My Progress (0)</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={onNavigateToDashboard}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Bookmark (0)</span>
            </button>

            {/* Rate & Feedback */}
            <button
              onClick={() => {
                if (onNavigateToFeedback) onNavigateToFeedback();
                else onNavigateToDashboard();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Rate & Feedback</span>
            </button>

            {/* Settings (Active Tab) */}
            <button
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${isDarkMode
                  ? "bg-[#0284c7]/20 text-[#38bdf8] border-l-4 border-[#0284c7]"
                  : "bg-[#e0f2fe]/70 text-[#0284c7] border-l-4 border-[#0284c7]"
                }`}
            >
              <svg className="w-4 h-4 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
          </div>

          {/* Bottom Back Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 px-2">
            <button
              onClick={onNavigateToDashboard}
              className="w-full flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0284c7] dark:hover:text-[#38bdf8] transition-colors py-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs mb-6">
            <button
              onClick={onNavigateToDashboard}
              className="font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <span className="text-slate-300">›</span>
            <span className="bg-[#e0f2fe] text-[#0284c7] font-semibold px-3 py-0.5 rounded-full">
              Settings
            </span>
          </div>

          {/* Page Heading & Back Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Account & Preferences
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize your university details, study preferences, and login credentials.
              </p>
            </div>

            <button
              onClick={onNavigateToDashboard}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs hover:border-[#0284c7] hover:bg-[#e0f2fe]/30 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#0284c7] transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-slate-900 dark:text-white group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8] font-bold">
                Return to Dashboard
              </span>
            </button>
          </div>

          {/* Success Notification Toast */}
          {savedToast && (
            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3 animate-fade-in">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Settings updated successfully! Your study profile is up to date.</span>
            </div>
          )}

          {/* Settings Section Navigation Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-8">
            {[
              { id: "profile", label: "Profile & Identity" },
              { id: "academic", label: "Academic Curriculum" },
              { id: "theme", label: "Theme" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSection === section.id
                    ? "bg-[#0284c7] text-white shadow-xs"
                    : isDarkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-800"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
            {/* ─── Profile & Identity ─── */}
            {activeSection === "profile" && (
              <div className={`rounded-2xl p-6 border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                }`}>
                <h2 className={`text-base font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Profile & Authentication
                </h2>

                {/* Avatar Row */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-16 h-16 rounded-full border-2 border-[#0284c7]/40 overflow-hidden flex items-center justify-center bg-slate-900 text-white text-xl font-bold">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      (user?.displayName || "U")[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {user?.displayName || "Guest Learner"}
                    </h3>
                    <p className="text-xs text-slate-400">{user?.email || "Signed in as guest"}</p>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Google Authenticated
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-slate-200 text-slate-800"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || "guest@eduvault.io"}
                      disabled
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border opacity-70 cursor-not-allowed ${isDarkMode
                          ? "bg-slate-800 border-slate-700 text-slate-400"
                          : "bg-slate-100 border-slate-200 text-slate-500"
                        }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Academic Curriculum ─── */}
            {activeSection === "academic" && (
              <div className={`rounded-2xl p-6 border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                }`}>
                <h2 className={`text-base font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Academic Enrollment
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Default University
                    </label>
                    <select
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}
                    >
                      <option value="RGPV">RGPV (Rajiv Gandhi Proudyogiki Vishwavidyalaya)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Degree / Program
                    </label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}
                    >
                      <option value="B.Tech">Bachelor of Technology (B.Tech)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Department / Branch
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Current Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}
                    >
                      <option value="1st Semester">Semester 1</option>
                      <option value="2nd Semester">Semester 2</option>
                      <option value="3rd Semester">Semester 3</option>
                      <option value="4th Semester">Semester 4</option>
                      <option value="5th Semester">Semester 5</option>
                      <option value="6th Semester">Semester 6</option>
                      <option value="7th Semester">Semester 7</option>
                      <option value="8th Semester">Semester 8</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Theme Section ─── */}
            {activeSection === "theme" && (
              <div className="space-y-6">
                {/* Theme Mode Selector Card */}
                <div className={`rounded-2xl p-6 border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                  }`}>
                  <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        Interface Theme & Color Palettes
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Select a curated combinational palette derived from our core design system tokens.
                      </p>
                    </div>
                    <span className="self-start sm:self-auto text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0284c7]/10 text-[#0284c7] border border-[#0284c7]/20">
                      6 Available Themes
                    </span>
                  </div>

                  {/* Theme Mode Cards Grid - Small & Compact Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "light",
                        name: "Light Mode",
                        type: "Classic",
                        desc: "Clean white aesthetic with crisp daytime clarity.",
                        combo: "Slate · Sky",
                        iconBg: "bg-amber-100 text-amber-600",
                        activeBorder: "border-[#0284c7] bg-[#e0f2fe]/30 ring-1 ring-[#0284c7]/30",
                        colors: ["#ffffff", "#e2e8f0", "#0284c7"],
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ),
                      },
                      {
                        id: "dark",
                        name: "Dark Mode",
                        type: "Classic",
                        desc: "Obsidian charcoal interface for night focus.",
                        combo: "Charcoal · Sky",
                        iconBg: "bg-slate-900 text-sky-400 border border-slate-700",
                        activeBorder: "border-[#0284c7] bg-[#0284c7]/10 ring-1 ring-[#0284c7]/30",
                        colors: ["#020617", "#1e293b", "#38bdf8"],
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        ),
                      },
                      {
                        id: "cosmic-gold",
                        name: "Cosmic Gold",
                        type: "Light",
                        desc: "Luminous amber & warm honey undertones.",
                        combo: "Amber · Honey",
                        iconBg: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-2xs",
                        activeBorder: "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40",
                        colors: ["#fcf9f2", "#f59e0b", "#d97706"],
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ),
                      },
                      {
                        id: "emerald-sage",
                        name: "Emerald Sage",
                        type: "Light",
                        desc: "Fresh mint emerald paired with sage tones.",
                        combo: "Emerald · Mint",
                        iconBg: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-2xs",
                        activeBorder: "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/40",
                        colors: ["#ecfdf5", "#10b981", "#047857"],
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        ),
                      },
                      {
                        id: "ocean-cyan",
                        name: "Ocean Cyan",
                        type: "Light",
                        desc: "Azure cyan merged with oceanic sky blue.",
                        combo: "Cyan · Blue",
                        iconBg: "bg-gradient-to-br from-cyan-400 to-sky-600 text-white shadow-2xs",
                        activeBorder: "border-sky-500 bg-sky-500/10 ring-1 ring-sky-500/40",
                        colors: ["#f0f9ff", "#06b6d4", "#0284c7"],
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ),
                      },
                      {
                        id: "crimson-velvet",
                        name: "Velvet Rose",
                        type: "Light",
                        desc: "Velvet rose with delicate ruby accents.",
                        combo: "Rose · Crimson",
                        iconBg: "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-2xs",
                        activeBorder: "border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/40",
                        colors: ["#fff1f2", "#f43f5e", "#be123c"],
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        ),
                      },
                    ].map((item) => {
                      const isSelected = themeMode === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleModeChange(item.id)}
                          className={`rounded-xl p-3 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? item.activeBorder
                              : isDarkMode
                              ? "border-slate-800 bg-slate-800/40 hover:border-slate-700"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                {item.icon}
                              </div>
                              <div className="flex items-center gap-1">
                                {isSelected ? (
                                  <span className="w-4 h-4 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[9px] font-black shadow-2xs">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="text-[8.5px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    {item.type}
                                  </span>
                                )}
                              </div>
                            </div>

                            <h3 className={`text-xs font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                              {item.name}
                            </h3>
                            <span className="inline-block text-[9.5px] font-semibold text-[#0284c7]">
                              {item.combo}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 leading-normal">
                              {item.desc}
                            </p>
                          </div>

                          {/* Mockup preview bar */}
                          <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs"
                                style={{ backgroundColor: item.colors[0] }}
                              />
                              <span
                                className="w-4 h-1 rounded-full"
                                style={{ backgroundColor: item.colors[1] }}
                              />
                              <span
                                className="w-2.5 h-1 rounded-full"
                                style={{ backgroundColor: item.colors[2] }}
                              />
                            </div>
                            <span className="text-[8px] font-mono text-slate-400 uppercase">
                              {item.id}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Save Buttons & Sign Out */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0284c7]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Save Theme & Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  onNavigateToHome?.();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out Account</span>
              </button>
            </div>
          </form>

          {/* Toast Notification when saved */}
          {savedToast && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xl animate-fade-in border border-emerald-500">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Theme & Settings saved! Applied across the entire dashboard.</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
