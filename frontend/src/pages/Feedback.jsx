import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getBookmarkCount } from "../utils/bookmarkStorage";

export default function Feedback({
  onNavigateToDashboard,
  onNavigateToSettings,
  onNavigateToBookmark,
  onNavigateToHome,
  isDarkMode: propIsDarkMode,
  onToggleTheme,
}) {
  const { user, logout, signInWithGoogle, signingIn, error: authError } = useAuth();
  const { isDarkMode: ctxDarkMode, toggleTheme: ctxToggleTheme } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : ctxDarkMode;
  const toggleTheme = onToggleTheme || ctxToggleTheme;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(() => getBookmarkCount());

  useEffect(() => {
    const handleBookmarkChange = () => setBookmarkCount(getBookmarkCount());
    window.addEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
    return () => window.removeEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
  }, []);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const ratingLabels = {
    0: "Select rating",
    1: "1 - Poor",
    2: "2 - Fair",
    3: "3 - Good",
    4: "4 - Very Good",
    5: "5 - Excellent!",
  };

  const displayName = user?.displayName || (user ? "EduVault Student" : "Guest User");
  const displayEmail = user?.email || (user ? "" : "Not logged in");
  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "G";

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setErrorMsg("");
    } catch (err) {
      console.error("Sign-in error on feedback page:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verification check: Only logged-in users can give feedback
    if (!user) {
      setErrorMsg("You must be logged in to submit feedback. Only logged-in users are able to give feedback.");
      return;
    }

    if (rating === 0) {
      setErrorMsg("Please select a rating of at least 1 star.");
      return;
    }
    if (comments.trim().length < 5) {
      setErrorMsg("Please write comments with at least 5 characters.");
      return;
    }

    try {
      // Optional: Store review in local storage
      const feedbackRecord = {
        userId: user.uid,
        userName: displayName,
        userEmail: displayEmail,
        rating,
        comments: comments.trim(),
        createdAt: new Date().toISOString(),
      };
      const existingReviews = JSON.parse(localStorage.getItem("eduvault_feedbacks") || "[]");
      localStorage.setItem("eduvault_feedbacks", JSON.stringify([...existingReviews, feedbackRecord]));
    } catch (storageErr) {
      console.warn("Could not save feedback to localStorage:", storageErr);
    }

    setErrorMsg("");
    setSubmitted(true);
  };

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
              placeholder="Search questions, topics, or units..."
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0284c7]/30 ${
                isDarkMode
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

          {/* User profile avatar / dropdown or Sign In button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center h-8 w-8 rounded-full overflow-hidden border border-slate-300 ring-2 ring-transparent hover:ring-[#0284c7]/40 transition-all cursor-pointer bg-[#7c3aed] text-white"
                title={displayName}
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
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] transition-all cursor-pointer shadow-xs disabled:opacity-60"
              title="Sign in with Google"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              <span>{signingIn ? "Signing In..." : "Sign In"}</span>
            </button>
          )}
        </div>
      </header>

      {/* ─── Body Layout: Left Sidebar + Main Content ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className={`w-56 lg:w-64 border-r flex flex-col justify-between py-6 px-3 shrink-0 transition-colors ${
          isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
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


            {/* Bookmark */}
            <button
              onClick={() => {
                if (onNavigateToBookmark) onNavigateToBookmark();
                else onNavigateToDashboard();
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

            {/* Rate & Feedback (Active!) */}
            <button
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                isDarkMode
                  ? "bg-[#0284c7]/20 text-[#38bdf8] border-l-4 border-[#0284c7]"
                  : "bg-[#e0f2fe]/70 text-[#0284c7] border-l-4 border-[#0284c7]"
              }`}
            >
              <svg className="w-4 h-4 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Bottom user status */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 px-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${user ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span className="text-[11px] text-slate-400">
                {user ? "Signed In" : "Guest (Not signed in)"}
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-16 py-10">
          <div className="max-w-2xl mx-auto">
            {/* Header: Speech Bubble Icon + Title + Subtitle */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-[#0284c7] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Rate & Share Feedback
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Your feedback shapes our study materials and software updates! Tell us what you think of UNITWISE.
              </p>
            </div>

            {/* ─── Login Status Notice Banner (When Not Logged In) ─── */}
            {!user && (
              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">
                      Login Required to Submit Feedback
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      You are currently not signed in. Only logged-in users are able to give feedback. Please sign in to submit your rating and comments.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={signingIn}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] shadow-xs transition-all shrink-0 cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                  <span>{signingIn ? "Signing In..." : "Sign in with Google"}</span>
                </button>
              </div>
            )}

            {/* Auth Context Global Error Message if any */}
            {authError && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            {/* Submitted Success Card */}
            {submitted ? (
              <div className={`rounded-2xl p-8 border text-center shadow-xs ${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Thank You for Your Feedback!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto">
                  Your review has been successfully submitted. We review all suggestions to improve unit notes and semester analysis.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setComments("");
                      setRating(0);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Submit Another Feedback
                  </button>
                  <button
                    onClick={onNavigateToDashboard}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#0284c7] text-white hover:bg-[#0369a1] transition-colors cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              /* Feedback Form Card */
              <form
                onSubmit={handleSubmit}
                className={`rounded-2xl p-6 sm:p-8 border shadow-xs transition-colors ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
                }`}
              >
                {/* 1. Rate Your Experience */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      1. Rate Your Experience
                    </h2>
                    {!user && (
                      <span className="text-[11px] font-medium text-amber-500 dark:text-amber-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Login required
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Stars */}
                    <div className={`flex items-center gap-2 ${!user ? "opacity-60 cursor-not-allowed" : ""}`}>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            disabled={!user}
                            onClick={() => {
                              if (!user) {
                                setErrorMsg("Please sign in first. Only logged-in users can give feedback.");
                                return;
                              }
                              setRating(star);
                              setErrorMsg("");
                            }}
                            onMouseEnter={() => {
                              if (user) setHoverRating(star);
                            }}
                            onMouseLeave={() => {
                              if (user) setHoverRating(0);
                            }}
                            className={`p-0.5 focus:outline-none transition-transform ${
                              user ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed"
                            }`}
                            title={user ? `${star} Star` : "Please sign in to rate"}
                          >
                            <svg
                              className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                isFilled
                                  ? "text-amber-400 fill-amber-400"
                                  : isDarkMode
                                  ? "text-slate-600 fill-transparent hover:text-amber-300"
                                  : "text-slate-300 fill-transparent hover:text-amber-300"
                              }`}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic Rating Pill Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      !user
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        : rating > 0
                        ? "bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-950/60 dark:text-sky-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}>
                      {!user ? "Login to rate" : ratingLabels[hoverRating || rating]}
                    </span>
                  </div>
                </div>

                {/* 2. Write Your Comments */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      2. Write Your Comments
                    </h2>
                    {!user && (
                      <span className="text-[11px] font-medium text-amber-500 dark:text-amber-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Disabled for guests
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <textarea
                      rows={5}
                      value={comments}
                      disabled={!user}
                      onChange={(e) => {
                        setComments(e.target.value);
                        if (e.target.value.trim().length >= 5) {
                          setErrorMsg("");
                        }
                      }}
                      placeholder={
                        user
                          ? "What do you like about UNITWISE? What features or study files would you like us to add? Feel free to write anything..."
                          : "You must be signed in to write and submit feedback. Please sign in using the button above."
                      }
                      className={`w-full p-4 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 resize-none ${
                        !user
                          ? "bg-slate-100/70 border-slate-200 text-slate-400 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-500 cursor-not-allowed"
                          : isDarkMode
                          ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-400 focus:bg-slate-800 focus:ring-[#0284c7]/30"
                          : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#0284c7]/60 focus:ring-[#0284c7]/30"
                      }`}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 text-right">
                    {user
                      ? "At least 5 characters. Authenticated profile details will accompany your submission."
                      : "Feedback is restricted to authenticated users only."}
                  </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errorMsg}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMsg("")}
                      className="text-red-400 hover:text-red-600 font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Profile row + Submit Button */}
                <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                  {/* Left: User Identity */}
                  <div className="flex items-center gap-3">
                    {user ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-[#7c3aed] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs overflow-hidden">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={displayName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span>{userInitial}</span>
                          )}
                        </div>
                        <div>
                          <p className={`text-xs font-bold leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {displayName}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            {displayEmail}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className={`text-xs font-bold leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            Guest User
                          </p>
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-tight mt-0.5">
                            Not logged in · Login required to give feedback
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right: Submit Review Button or Sign In Button */}
                  {user ? (
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0284c7] hover:bg-[#0369a1] shadow-md shadow-[#0284c7]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                      <span>Submit Review</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={signingIn}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0284c7] hover:bg-[#0369a1] shadow-md shadow-[#0284c7]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60"
                      title="Sign in with Google to give feedback"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                      </svg>
                      <span>{signingIn ? "Signing In..." : "Sign in to Give Feedback"}</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
