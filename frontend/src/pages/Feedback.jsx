import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getBookmarkCount } from "../utils/bookmarkStorage";
import { submitServerFeedback } from "../services/api";
import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";
import MobileBottomNav from "../components/MobileBottomNav";

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
  const [bookmarkCount, setBookmarkCount] = useState(() => getBookmarkCount());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      // Store review in local storage
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

      // Save to MongoDB backend
      submitServerFeedback(feedbackRecord).catch((serverErr) => {
        console.warn("[Backend Warning] Could not persist feedback to server:", serverErr.message);
      });
    } catch (storageErr) {
      console.warn("Could not save feedback:", storageErr);
    }

    setErrorMsg("");
    setSubmitted(true);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f8fafd] text-slate-800"} flex flex-col font-sans transition-colors duration-200`}>
      {/* ─── Top Responsive Navbar ─── */}
      <AppHeader
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToHome={onNavigateToHome}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        user={user}
        logout={logout}
        badgeText="Feedback"
      />

      {/* ─── Body Layout: Left Sidebar + Main Content ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop + Mobile Drawer) */}
        <AppSidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          activeTab="feedback"
          bookmarkCount={bookmarkCount}
          onNavigateToDashboard={onNavigateToDashboard}
          onNavigateToBookmark={onNavigateToBookmark}
          onNavigateToFeedback={() => { }}
          onNavigateToSettings={onNavigateToSettings}
          backShortcuts={[
            {
              label: "Back to Dashboard",
              onClick: onNavigateToDashboard,
              primary: true,
            },
          ]}
          isDarkMode={isDarkMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-16 py-6 sm:py-10 pb-24 md:pb-10">
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
              <div className={`rounded-2xl p-8 border text-center shadow-xs ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
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
                className={`rounded-2xl p-6 sm:p-8 border shadow-xs transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
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
                            className={`p-0.5 focus:outline-none transition-transform ${user ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed"
                              }`}
                            title={user ? `${star} Star` : "Please sign in to rate"}
                          >
                            <svg
                              className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${isFilled
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${!user
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
                      className={`w-full p-4 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 resize-none ${!user
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

      {/* ─── Mobile Bottom Navigation Bar ─── */}
      <MobileBottomNav
        activeTab="feedback"
        bookmarkCount={bookmarkCount}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToBookmark={onNavigateToBookmark}
        onNavigateToFeedback={() => { }}
        onNavigateToSettings={onNavigateToSettings}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
