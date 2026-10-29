import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  getBookmarkCount,
  isBookmarked,
  toggleBookmark,
} from "../utils/bookmarkStorage";
import {
  getMaterials,
  recordMaterialView,
  recordMaterialDownload,
} from "../services/api";
import { rgpvUnitsMap } from "../utils/curriculumData";

export default function Resources({
  university = { code: "RGPV", name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya" },
  course = { id: "btech", code: "B.Tech", name: "Bachelor of Technology", duration: "4 Years · 8 Semesters" },
  branch = { id: "cse", code: "CSE", name: "Computer Science & Engineering" },
  semester = { id: 1, name: "Semester 1" },
  subject = { id: "chem", code: "BT-101", name: "Engineering Chemistry" },
  onNavigateToDashboard,
  onNavigateToCourses,
  onNavigateToBranch,
  onNavigateToSemester,
  onNavigateToSubject,
  onNavigateToSettings,
  onNavigateToFeedback,
  onNavigateToBookmark,
  onNavigateToHome,
  onNavigateToUnit,
  onSelectResource,
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
  const [selectedResource, setSelectedResource] = useState(null);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [syllabusMaterial, setSyllabusMaterial] = useState(null);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(() => getBookmarkCount());
  const [toastMessage, setToastMessage] = useState("");

  const syllabusBookmarkId = `syllabus-${subject?.code || "BT101"}`;
  const [syllabusIsBookmarked, setSyllabusIsBookmarked] = useState(() =>
    isBookmarked(syllabusBookmarkId)
  );

  useEffect(() => {
    const handleBookmarkChange = () => {
      setBookmarkCount(getBookmarkCount());
      setSyllabusIsBookmarked(isBookmarked(syllabusBookmarkId));
    };
    window.addEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
    return () => window.removeEventListener("eduvault_bookmarks_changed", handleBookmarkChange);
  }, [syllabusBookmarkId]);

  // Fetch syllabus material if uploaded to backend
  useEffect(() => {
    if (!subject?.code) return;
    setLoadingSyllabus(true);
    getMaterials({
      subjectCode: subject.code,
      resourceType: "syllabus",
    })
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setSyllabusMaterial(res.data[0]);
        } else {
          setSyllabusMaterial({
            _id: `syllabus-${subject.code}`,
            title: `${subject.code} Official RGPV Syllabus`,
            file: {
              url: `https://ik.imagekit.io/eduvault_demo/syllabus/${subject.code.replace("-", "")}_Syllabus.pdf`,
              fileName: `${subject.code}_Official_Syllabus.pdf`,
              pagesCount: 4,
            },
            author: "RGPV Academic Council",
          });
        }
      })
      .catch(() => {
        setSyllabusMaterial({
          _id: `syllabus-${subject.code}`,
          title: `${subject.code} Official RGPV Syllabus`,
          file: {
            url: `https://ik.imagekit.io/eduvault_demo/syllabus/${subject.code.replace("-", "")}_Syllabus.pdf`,
            fileName: `${subject.code}_Official_Syllabus.pdf`,
            pagesCount: 4,
          },
          author: "RGPV Academic Council",
        });
      })
      .finally(() => setLoadingSyllabus(false));
  }, [subject]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2800);
  };

  const defaultSyllabusUrl =
    syllabusMaterial?.file?.url ||
    `https://ik.imagekit.io/eduvault_demo/syllabus/${(subject?.code || "BT101").replace("-", "")}_Syllabus.pdf`;

  const handleOpenSyllabusPdf = () => {
    if (syllabusMaterial?._id && !syllabusMaterial._id.startsWith("syllabus-")) {
      recordMaterialView(syllabusMaterial._id).catch(() => {});
    }
    window.open(defaultSyllabusUrl, "_blank", "noopener,noreferrer");
    showToast("Opening Official Syllabus PDF from ImageKit...");
  };

  const handleDownloadSyllabusPdf = () => {
    if (syllabusMaterial?._id && !syllabusMaterial._id.startsWith("syllabus-")) {
      recordMaterialDownload(syllabusMaterial._id).catch(() => {});
    }
    window.open(defaultSyllabusUrl, "_blank", "noopener,noreferrer");
    showToast("Starting Syllabus PDF download...");
  };

  const handleToggleSyllabusBookmark = (e) => {
    if (e) e.stopPropagation();
    const itemToSave = {
      id: syllabusBookmarkId,
      type: "syllabus",
      categoryLabel: "Official Syllabus",
      title: `${subject.code ? `${subject.code} ` : ""}Syllabus: ${subject.name}`,
      subject: subject.name,
      subjectCode: subject.code,
      semester: semester.name,
      branch: branch.code,
      university: university.code,
      description: `Official RGPV curriculum outline for ${subject.name} (${subject.code})`,
      fileUrl: defaultSyllabusUrl,
      date: "Saved",
    };

    const res = toggleBookmark(itemToSave);
    setSyllabusIsBookmarked(res.bookmarked);
    showToast(
      res.bookmarked
        ? `Saved "${subject.code} Syllabus" to Bookmarks!`
        : `Removed "${subject.code} Syllabus" from Bookmarks`
    );
  };

  // Four resources requested
  const resourcesList = [
    {
      id: "handwritten-notes",
      name: "Handwritten Notes",
      subtitle: "Verified chapter-wise notes",
      actionText: "Browse Units →",
      icon: (
        <svg className="w-6 h-6 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: "pyq",
      name: "PYQ",
      subtitle: "Previous year question papers",
      actionText: "View PYQs →",
      icon: (
        <svg className="w-6 h-6 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "syllabus",
      name: "Syllabus",
      subtitle: "Official RGPV curriculum outline",
      actionText: "View PDF",
      hasPdfButton: true,
      icon: (
        <svg className="w-6 h-6 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: "unit-wise-important",
      name: "Unit Wise Important",
      subtitle: "High-yield repeated exam topics",
      actionText: "View Topics →",
      icon: (
        <svg className="w-6 h-6 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  const filteredResources = resourcesList.filter((res) =>
    res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResourceClick = (res) => {
    setSelectedResource(res);
    if (res.id === "handwritten-notes" && onNavigateToUnit) {
      onNavigateToUnit(res, subject);
    } else if (res.id === "syllabus") {
      setShowSyllabusModal(true);
    } else if (onSelectResource) {
      onSelectResource(res);
    }
  };

  const subjectKey = subject?.code?.toUpperCase();
  const currentUnits = rgpvUnitsMap[subjectKey] || [
    { id: "u1", number: "UNIT I", name: "Fundamentals & Core Concepts", topics: "Basic definitions, Introduction, Mathematical foundations, Core theorems and architecture" },
    { id: "u2", number: "UNIT II", name: "Methods & Algorithmic Analysis", topics: "Key algorithmic techniques, Methodologies, Mathematical formulations, Practical structures" },
    { id: "u3", number: "UNIT III", name: "Intermediate Systems & Applications", topics: "Detailed system design, Standard methods, Real-world applications and structural models" },
    { id: "u4", number: "UNIT IV", name: "Advanced Optimization & Design", topics: "Advanced design patterns, Performance optimization, Analytical frameworks and evaluation" },
    { id: "u5", number: "UNIT V", name: "Emerging Technologies & Case Studies", topics: "Current industry trends, Case studies, Advanced implementations and standard practices" },
  ];

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
              placeholder="Search resources (notes, pyq, syllabus)..."
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
          {/* Bookmark Navigation Icon */}
          <button
            onClick={onNavigateToBookmark}
            className={`p-2 rounded-full border transition-colors cursor-pointer relative ${
              isDarkMode
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            title="Saved Bookmarks"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0284c7] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </button>

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
                  Home Page
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
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

      {/* ─── Main Shell: Left Sidebar + Content Area ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className={`w-64 border-r hidden md:flex flex-col justify-between p-4 transition-colors ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div className="space-y-6">
            {/* Main Navigation links */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Navigation</p>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    onNavigateToDashboard();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-950/60 dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("courses");
                    onNavigateToCourses?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "courses"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-950/60 dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  <span>Courses</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("branches");
                    onNavigateToBranch?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "branches"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-950/60 dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Branches</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("semesters");
                    onNavigateToSemester?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "semesters"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-950/60 dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Semesters</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("subjects");
                    onNavigateToSubject?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "subjects"
                      ? "bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-950/60 dark:text-sky-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Subjects</span>
                </button>
              </nav>
            </div>

            {/* Quick Actions */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Options</p>
              <div className="space-y-1">
                <button
                  onClick={onNavigateToBookmark}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#0284c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Saved Bookmarks</span>
                  {bookmarkCount > 0 && (
                    <span className="ml-auto bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-950 dark:text-sky-300 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                      {bookmarkCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={onNavigateToFeedback}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Rate & Feedback</span>
                </button>

                <button
                  onClick={onNavigateToSettings}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick jump navigation footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <button
              onClick={onNavigateToSubject}
              className="w-full flex items-center gap-2 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Change Subject</span>
            </button>

            <button
              onClick={onNavigateToSemester}
              className="w-full flex items-center gap-2 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Change Semester</span>
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
            <button
              onClick={onNavigateToSubject}
              className="text-slate-600 dark:text-slate-300 font-semibold hover:text-[#0284c7] transition-colors cursor-pointer"
            >
              {subject.code || subject.name || "Subject"}
            </button>
            <span className="text-slate-300">›</span>
            <span className="bg-[#e0f2fe] text-[#0284c7] font-bold px-3 py-1 rounded-full shadow-xs">
              Resources
            </span>
          </div>

          {/* Selected Path Banner Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-900/50 bg-[#e0f2fe]/60 px-4 py-1.5 mb-6 text-xs text-[#0284c7] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse" />
            <span>
              {university.code} • {course.code} • {branch.code} • {semester.name} • {subject.code ? `${subject.code} - ` : ""}{subject.name}
            </span>
          </div>

          {/* Section Heading */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Select Resource
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Access verified handwritten notes, previous year papers, official syllabus, and unit-wise important topics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToSubject}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs hover:border-[#0284c7] hover:bg-[#e0f2fe]/30 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#0284c7] transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Subjects</span>
              </button>
            </div>
          </div>

          {/* Empty search state */}
          {filteredResources.length === 0 && (
            <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No resources match "{searchQuery}"</h3>
              <p className="text-xs text-slate-400 mt-1">Try searching with a different resource name.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-[#0284c7] text-white text-xs font-semibold rounded-xl hover:bg-[#0369a1] transition-all cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* ─── 4 Resources Cards Grid (Medium Card Size) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl">
            {filteredResources.map((res) => {
              const isSyllabusCard = res.id === "syllabus";

              return (
                <div
                  key={res.id}
                  onClick={() => handleResourceClick(res)}
                  className={`group relative rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-between text-center cursor-pointer min-h-[175px] sm:min-h-[190px] ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 hover:border-[#0284c7]/50 hover:bg-slate-850/80"
                      : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-[#0284c7]/40 hover:-translate-y-0.5"
                  } ${
                    selectedResource?.id === res.id ? "ring-2 ring-[#0284c7] border-[#0284c7]" : ""
                  }`}
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                      {res.icon}
                    </div>

                    <h2
                      className={`text-base font-bold tracking-tight transition-colors ${
                        isDarkMode
                          ? "text-white group-hover:text-[#38bdf8]"
                          : "text-slate-800 group-hover:text-[#0284c7]"
                      }`}
                    >
                      {res.name}
                    </h2>

                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                      {res.subtitle}
                    </p>
                  </div>

                  {/* Action Section on the Card */}
                  <div className="mt-4 w-full flex items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {isSyllabusCard ? (
                      <div className="flex items-center justify-center gap-2 w-full">
                        {/* Primary View PDF Button on Syllabus Card */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSyllabusPdf();
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs transition-all cursor-pointer hover:scale-105"
                          title="View Official Syllabus PDF"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View PDF</span>
                        </button>

                        {/* Download Syllabus PDF Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadSyllabusPdf();
                          }}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-[#0284c7] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Download Syllabus PDF"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284c7] group-hover:underline">
                        {res.actionText}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ─── Official Syllabus Details & ImageKit PDF Modal ─── */}
      {showSyllabusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl p-6 sm:p-8 shadow-2xl border ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-800"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg border bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800">
                    Official Syllabus
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {subject.code || "Course"}
                  </span>
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {subject.name || "Subject Syllabus"}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {university.code} • {course.code} • {branch.code} • {semester.name}
                </p>
              </div>

              <button
                onClick={() => setShowSyllabusModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              {/* PDF Document Preview Card */}
              <div className="p-4 rounded-2xl border border-sky-100 dark:border-sky-900/50 bg-[#e0f2fe]/40 dark:bg-sky-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-[#0284c7] shrink-0 shadow-xs">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {subject.code || "BT-101"} Official Curriculum PDF
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      RGPV Approved Scheme & Syllabus • ImageKit CDN High-Speed Access
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* View PDF Button in Modal */}
                  <button
                    onClick={handleOpenSyllabusPdf}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs transition-all cursor-pointer hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View PDF</span>
                  </button>

                  {/* Download PDF Button in Modal */}
                  <button
                    onClick={handleDownloadSyllabusPdf}
                    className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Download Syllabus PDF"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 5 Units Curriculum Breakdown */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Syllabus Units Breakdown (5 Units)
                </p>

                <div className="space-y-3">
                  {currentUnits.map((u) => (
                    <div
                      key={u.id}
                      className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-[#0284c7] dark:text-sky-300">
                          {u.number}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {u.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-1">
                        {u.topics}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleToggleSyllabusBookmark}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  syllabusIsBookmarked
                    ? "bg-[#e0f2fe] text-[#0284c7] dark:bg-sky-950/80 dark:text-sky-300"
                    : "text-slate-500 hover:text-[#0284c7] hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <svg className="w-4 h-4" fill={syllabusIsBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{syllabusIsBookmarked ? "Bookmarked in Vault" : "Bookmark Syllabus"}</span>
              </button>

              <button
                onClick={() => setShowSyllabusModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast Notification ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-bounce">
          <svg className="w-4 h-4 text-emerald-400 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
