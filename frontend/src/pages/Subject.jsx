import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getBookmarkCount } from "../utils/bookmarkStorage";
import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";
import MobileBottomNav from "../components/MobileBottomNav";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(() => getBookmarkCount());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleBookmarkChange = () => setBookmarkCount(getBookmarkCount());
    window.addEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
    return () => window.removeEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
  }, []);

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

  const filteredSubjects = currentSubjects.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.code && sub.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubjectSelect = (sub) => {
    if (onNavigateToResources) {
      onNavigateToResources(sub);
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#f8fafd] text-slate-800"
        } flex flex-col font-sans transition-colors duration-200`}
    >
      {/* ─── Top Responsive Navbar ─── */}
      <AppHeader
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToHome={onNavigateToHome}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search subjects or codes (e.g. CS-402)..."
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        user={user}
        logout={logout}
        badgeText={`${university?.code} · ${semester?.name}`}
      />

      {/* ─── Body Layout: Left Sidebar + Main Content ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop + Mobile Drawer) */}
        <AppSidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          activeTab="dashboard"
          bookmarkCount={bookmarkCount}
          onNavigateToDashboard={onNavigateToDashboard}
          onNavigateToBookmark={onNavigateToBookmark}
          onNavigateToFeedback={onNavigateToFeedback}
          onNavigateToSettings={onNavigateToSettings}
          backShortcuts={[
            {
              label: "Back to Semesters",
              onClick: onNavigateToSemester,
              primary: true,
            },
            {
              label: "Change Branch",
              onClick: onNavigateToBranch,
              primary: false,
            },
            {
              label: "Change Course",
              onClick: onNavigateToCourses,
              primary: false,
            },
            {
              label: "Change University",
              onClick: onNavigateToDashboard,
              primary: false,
            },
          ]}
          isDarkMode={isDarkMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 pb-24 md:pb-8">
          {/* Breadcrumb Steps */}
          <div className="flex items-center gap-2 text-xs overflow-x-auto no-scrollbar py-1 whitespace-nowrap mb-6">
            <button
              onClick={onNavigateToDashboard}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer shrink-0"
            >
              {university.code || "University"}
            </button>
            <span className="text-slate-300 shrink-0">›</span>
            <button
              onClick={onNavigateToCourses}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer shrink-0"
            >
              {course.code || "Course"}
            </button>
            <span className="text-slate-300 shrink-0">›</span>
            <button
              onClick={onNavigateToBranch}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer shrink-0"
            >
              {branch.code || "Branch"}
            </button>
            <span className="text-slate-300 shrink-0">›</span>
            <button
              onClick={onNavigateToSemester}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer shrink-0"
            >
              {semester.name || "Semester"}
            </button>
            <span className="text-slate-300 shrink-0">›</span>
            <span className="bg-[#e0f2fe] text-[#0284c7] font-bold px-3 py-1 rounded-full shadow-xs shrink-0">
              Subject
            </span>
            <span className="text-slate-300 shrink-0">›</span>
            <span className="text-slate-400 shrink-0">Resources</span>
          </div>

          {/* Selected Path Banner Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-900/50 bg-[#e0f2fe]/60 px-3.5 sm:px-4 py-1.5 mb-6 text-xs text-[#0284c7] font-semibold max-w-full truncate">
            <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse shrink-0" />
            <span className="truncate">
              {university.code} • {course.code} • {branch.code} • {semester.name}
            </span>
          </div>

          {/* Section Heading */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Select Subject
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Access curated handwritten notes, official syllabus, and repeat PYQ trends.
              </p>
            </div>
            {searchQuery && (
              <span className="text-xs text-slate-400">
                Found {filteredSubjects.length} subject(s)
              </span>
            )}
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSubjects.map((sub) => (
              <div
                key={sub.id}
                onClick={() => handleSubjectSelect(sub)}
                className={`group relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${isDarkMode
                  ? "bg-slate-900 border border-slate-800"
                  : "bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                  } hover:shadow-xl hover:border-[#0284c7]/40 hover:-translate-y-1 cursor-pointer`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black tracking-wider px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200/60 dark:border-sky-800/60 text-[#0284c7]">
                      {sub.code}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      5 Units
                    </span>
                  </div>

                  <h3 className={`text-base sm:text-lg font-bold leading-snug ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Official RGPV syllabus notes, repeated questions & solutions.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Study Materials</span>
                  <span className="text-xs font-semibold text-[#0284c7] group-hover:underline flex items-center gap-1">
                    <span>View Resources</span>
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ─── Mobile Bottom Navigation Bar ─── */}
      <MobileBottomNav
        activeTab="dashboard"
        bookmarkCount={bookmarkCount}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToBookmark={onNavigateToBookmark}
        onNavigateToFeedback={onNavigateToFeedback}
        onNavigateToSettings={onNavigateToSettings}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
