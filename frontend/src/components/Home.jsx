import { useState, useEffect } from "react";
import libraryBg from "../assets/library-bg.jpg";
import Feature from "./Feature";
import How_it_work from "./How_it_work";
import About from "./About";
import { useAuth } from "../context/AuthContext";

function Home({ onNavigateToDashboard }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signingIn, error, signInWithGoogle, logout, clearError } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("Sign-in attempt failed:", err);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0a] text-slate-200 overflow-x-hidden">
      {/* ─── Error Notification Toast ─── */}
      {error && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-red-500/40 bg-black/90 px-4 sm:px-5 py-3 text-xs sm:text-sm text-red-200 shadow-2xl backdrop-blur-md animate-fade-in max-w-md w-[92%] sm:w-[90%]">
          <svg
            className="h-5 w-5 shrink-0 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="flex-1 text-xs sm:text-sm">{error}</span>
          <button
            onClick={clearError}
            className="rounded p-1 text-red-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── Hero Section ─── */}
      <section id="home" className="relative min-h-screen overflow-hidden flex flex-col justify-between">
        {/* ─── Background Layer ─── */}
        <div className="absolute inset-0">
          <img
            src={libraryBg}
            alt="Library background"
            className="h-full w-full object-cover object-center"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          {/* Warm amber tint to complement library tones */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-black/70" />
        </div>

        {/* ─── Navbar ─── */}
        <nav className="relative z-30 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 py-4 sm:py-5 border-b border-white/10 md:border-transparent">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#d4a03d]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
              Edu<span className="text-amber-400">Vault</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            {["Home", "Features", "How It Works", "About"].map(
              (item, idx) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`text-sm font-medium transition-colors duration-200 ${idx === 0
                      ? "text-amber-400 underline underline-offset-8 decoration-2"
                      : "text-white/70 hover:text-amber-300"
                    }`}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {item}
                </a>
              )
            )}
          </div>

          {/* ─── Right Auth Actions (Desktop) ─── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md border border-white/20">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="h-7 w-7 rounded-full border border-amber-400/60 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/30 text-xs font-bold text-amber-300 border border-amber-400/40">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline-block text-xs font-medium text-white max-w-[120px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </div>

                {onNavigateToDashboard && (
                  <button
                    onClick={onNavigateToDashboard}
                    className="flex items-center gap-1.5 rounded-full bg-[#d4a03d] px-3.5 py-2 text-xs font-bold text-gray-900 shadow-md shadow-amber-500/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                    title="Go to Dashboard"
                  >
                    <span>Dashboard</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold text-red-300 border border-red-500/30 backdrop-blur-sm transition-all duration-300 hover:bg-red-500/20 hover:border-red-400 cursor-pointer"
                  title="Sign Out"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                id="navbar-signin-button"
                className="group flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-[#d4a03d] hover:border-[#d4a03d] hover:text-gray-900 hover:shadow-amber-400/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {signingIn ? (
                  <svg
                    className="animate-spin h-4 w-4 text-amber-300 group-hover:text-gray-900"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                )}
                <span>{signingIn ? "Signing In..." : "Sign In"}</span>
              </button>
            )}
          </div>

          {/* ─── Mobile Hamburger Toggle ─── */}
          <div className="flex md:hidden items-center gap-2">
            {user && onNavigateToDashboard && (
              <button
                onClick={onNavigateToDashboard}
                className="rounded-full bg-[#d4a03d] px-3 py-1.5 text-xs font-bold text-gray-900 cursor-pointer"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-white/20 bg-white/10 text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* ─── Mobile Dropdown Menu ─── */}
        {mobileMenuOpen && (
          <div className="relative z-30 md:hidden bg-black/95 backdrop-blur-xl border-b border-white/15 px-6 py-6 animate-fade-in flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {["Home", "Features", "How It Works", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-white/90 hover:text-amber-400 py-1 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-white/15 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="h-8 w-8 rounded-full border border-amber-400/60 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/30 text-xs font-bold text-amber-300 border border-amber-400/40">
                        {(user.displayName || user.email || "U")[0].toUpperCase()}
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{user.displayName || "User"}</p>
                      <p className="text-[11px] text-white/60 truncate">{user.email}</p>
                    </div>
                  </div>

                  {onNavigateToDashboard && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigateToDashboard();
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#d4a03d] py-3 text-sm font-bold text-gray-900"
                    >
                      <span>Open Dashboard</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-red-300 border border-red-500/30"
                  >
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#d4a03d] py-3 text-sm font-bold text-gray-900"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                    <span>{signingIn ? "Signing In..." : "Sign in with Google"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigateToDashboard?.();
                    }}
                    className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 text-sm font-semibold text-white"
                  >
                    Explore as Guest
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ─── Hero Content ─── */}
        <div className="relative z-10 flex min-h-[calc(100vh-88px)] items-center px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-20">
          <div
            className={`max-w-2xl transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
          >
            {/* Tagline badge */}
            <div className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 sm:px-4 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-amber-200 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-amber-200">
                Less searching · Better Preparation
              </span>
            </div>

            {/* Main heading */}
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              One Stop Solution To{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
                  Ace Your Exams
                </span>
                <span className="absolute -bottom-1.5 sm:-bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 opacity-60" />
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="mt-5 sm:mt-6 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed text-white/70"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Master every subject with unit-wise notes, previous-year questions, repeated-topic analysis, and focused exam preparation.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {user ? (
                <>
                  <button
                    onClick={onNavigateToDashboard}
                    className="group flex items-center justify-center gap-2 rounded-full bg-[#d4a03d] px-6 sm:px-7 py-3.5 text-sm font-bold text-gray-900 shadow-xl shadow-amber-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                  >
                    <span>Go to Dashboard</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 01.75-.75h10.638L11.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.04-1.08l3.158-2.96H3.75A.75.75 0 013 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-200/90 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-sm truncate">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="truncate">Signed in as <strong>{user.displayName || user.email}</strong></span>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    id="hero-signin-google-button"
                    className="group flex items-center justify-center gap-2 rounded-full bg-[#d4a03d] px-6 sm:px-7 py-3.5 text-sm font-bold text-gray-900 shadow-xl shadow-amber-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {signingIn ? (
                      <svg
                        className="animate-spin h-5 w-5 text-gray-900"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                      </svg>
                    )}
                    <span>{signingIn ? "Signing in..." : "Sign in with Google"}</span>
                    {!signingIn && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 01.75-.75h10.638L11.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.04-1.08l3.158-2.96H3.75A.75.75 0 013 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={onNavigateToDashboard}
                    className="flex items-center justify-center rounded-full border-2 border-white/25 bg-white/5 px-6 sm:px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/40 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                  >
                    Explore as Guest
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ─── Bottom scroll indicator ─── */}
        <a
          href="#features"
          className="absolute bottom-4 sm:bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce cursor-pointer group"
          aria-label="Scroll to features"
        >
          <div className="flex flex-col items-center gap-1 transition-opacity duration-300">
            <span className="text-[10px] uppercase tracking-widest text-slate-400/70 group-hover:text-amber-400 transition-colors">
              Scroll
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400/70 group-hover:text-amber-400 transition-colors"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </a>
      </section>

      {/* ─── Bottom Features Section ─── */}
      <Feature />

      {/* ─── How It Works Section ─── */}
      <How_it_work />

      {/* ─── About Section ─── */}
      <About />
    </div>
  );
}

export default Home;
