import { useState, useEffect } from "react";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Bookmark from "./components/Bookmark";
import Settings from "./components/Settings";
import Courses from "./pages/courses";
import Branch from "./pages/Branch";
import Semester from "./pages/Semester";
import Subject from "./pages/Subject";
import Resources from "./pages/Resources";
import Unit from "./pages/Unit";
import Feedback from "./pages/Feedback";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const STORAGE_KEYS = {
  VIEW: "eduvault_current_view",
  UNIVERSITY: "eduvault_selected_university",
  COURSE: "eduvault_selected_course",
  BRANCH: "eduvault_selected_branch",
  SEMESTER: "eduvault_selected_semester",
  SUBJECT: "eduvault_selected_subject",
};

const getStoredItem = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStoredItem = (key, value) => {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.error("Error writing to localStorage", err);
  }
};

function MainApp() {
  const { user, loading } = useAuth();
  const { theme, setTheme, isDarkMode, toggleTheme } = useTheme();
  const [view, setView] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.VIEW) || null;
  }); // "home", "dashboard", "courses", "branch", "semester", "subject", "resources", "unit", "settings", "feedback", "bookmark"
  const [selectedUniversity, setSelectedUniversity] = useState(() =>
    getStoredItem(STORAGE_KEYS.UNIVERSITY, {
      code: "RGPV",
      name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
    })
  );
  const [selectedCourse, setSelectedCourse] = useState(() =>
    getStoredItem(STORAGE_KEYS.COURSE, {
      id: "btech",
      code: "B.Tech",
      name: "Bachelor of Technology",
      duration: "4 Years · 8 Semesters",
    })
  );
  const [selectedBranch, setSelectedBranch] = useState(() =>
    getStoredItem(STORAGE_KEYS.BRANCH, {
      id: "cse",
      code: "CSE",
      name: "Computer Science & Engineering",
    })
  );
  const [selectedSemester, setSelectedSemester] = useState(() =>
    getStoredItem(STORAGE_KEYS.SEMESTER, { id: 1, name: "Semester 1" })
  );
  const [selectedSubject, setSelectedSubject] = useState(() =>
    getStoredItem(STORAGE_KEYS.SUBJECT, null)
  );

  // Sync state changes to localStorage
  useEffect(() => {
    if (view) {
      localStorage.setItem(STORAGE_KEYS.VIEW, view);
    }
  }, [view]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.UNIVERSITY, selectedUniversity);
  }, [selectedUniversity]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.COURSE, selectedCourse);
  }, [selectedCourse]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.BRANCH, selectedBranch);
  }, [selectedBranch]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.SEMESTER, selectedSemester);
  }, [selectedSemester]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.SUBJECT, selectedSubject);
  }, [selectedSubject]);

  // Restore current view on page refresh / auth state change
  useEffect(() => {
    if (loading) return;

    if (user) {
      setView((prev) => {
        const savedView = localStorage.getItem(STORAGE_KEYS.VIEW);
        const candidate = prev || savedView;
        const validViews = [
          "dashboard",
          "courses",
          "branch",
          "semester",
          "subject",
          "resources",
          "unit",
          "settings",
          "feedback",
          "bookmark",
        ];
        if (candidate && validViews.includes(candidate)) {
          return candidate;
        }
        return "dashboard";
      });
    } else {
      setView("home");
      localStorage.removeItem(STORAGE_KEYS.VIEW);
    }
}, [user, loading]);

if (loading) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading EduVault...</p>
      </div>
    </div>
  );
}

if (view === "courses") {
  return (
    <Courses
      university={selectedUniversity}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      theme={theme}
      onNavigateToDashboard={() => setView("dashboard")}
      onNavigateToBookmark={() => setView("bookmark")}
      onNavigateToHome={() => setView("home")}
      onNavigateToSettings={() => setView("settings")}
      onNavigateToFeedback={() => setView("feedback")}
      onNavigateToBranch={(course) => {
        if (course) setSelectedCourse(course);
        setView("branch");
      }}
    />
  );
}

if (view === "branch") {
  return (
    <Branch
      university={selectedUniversity}
      course={selectedCourse || { id: "btech", code: "B.Tech", name: "Bachelor of Technology", duration: "4 Years · 8 Semesters" }}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      theme={theme}
      onNavigateToDashboard={() => setView("dashboard")}
      onNavigateToBookmark={() => setView("bookmark")}
      onNavigateToCourses={() => setView("courses")}
      onNavigateToHome={() => setView("home")}
      onNavigateToSettings={() => setView("settings")}
      onNavigateToFeedback={() => setView("feedback")}
      onNavigateToSemester={(branch) => {
        if (branch) setSelectedBranch(branch);
        setView("semester");
      }}
    />
  );
}

if (view === "semester") {
  return (
    <Semester
      university={selectedUniversity}
      course={selectedCourse || { id: "btech", code: "B.Tech", name: "Bachelor of Technology", duration: "4 Years · 8 Semesters" }}
      branch={selectedBranch || { id: "cse", code: "CSE", name: "Computer Science & Engineering" }}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      theme={theme}
      onNavigateToDashboard={() => setView("dashboard")}
      onNavigateToBookmark={() => setView("bookmark")}
      onNavigateToCourses={() => setView("courses")}
      onNavigateToBranch={() => setView("branch")}
      onNavigateToHome={() => setView("home")}
      onNavigateToSettings={() => setView("settings")}
      onNavigateToFeedback={() => setView("feedback")}
      onNavigateToSubject={(sem) => {
        if (sem) setSelectedSemester(sem);
        setView("subject");
      }}
    />
  );
}

if (view === "subject") {
  return (
    <Subject
      university={selectedUniversity}
      course={selectedCourse || { id: "btech", code: "B.Tech", name: "Bachelor of Technology", duration: "4 Years · 8 Semesters" }}
      branch={selectedBranch || { id: "cse", code: "CSE", name: "Computer Science & Engineering" }}
      semester={selectedSemester || { id: 1, name: "Semester 1" }}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      theme={theme}
      onNavigateToDashboard={() => setView("dashboard")}
      onNavigateToBookmark={() => setView("bookmark")}
      onNavigateToCourses={() => setView("courses")}
      onNavigateToBranch={() => setView("branch")}
      onNavigateToSemester={() => setView("semester")}
      onNavigateToHome={() => setView("home")}
      onNavigateToSettings={() => setView("settings")}
      onNavigateToFeedback={() => setView("feedback")}
      onNavigateToResources={(subject) => {
        if (subject) setSelectedSubject(subject);
        setView("resources");
      }}
      onNavigateToUnit={(subject) => {
        if (subject) setSelectedSubject(subject);
        setView("resources");
      }}
    />
  );
}

if (view === "resources") {
  return (
    <Resources
      university={selectedUniversity}
      course={selectedCourse || { id: "btech", code: "B.Tech", name: "Bachelor of Technology", duration: "4 Years · 8 Semesters" }}
      branch={selectedBranch || { id: "cse", code: "CSE", name: "Computer Science & Engineering" }}
      semester={selectedSemester || { id: 1, name: "Semester 1" }}
      subject={selectedSubject || { id: "chem", code: "BT-101", name: "Engineering Chemistry" }}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      theme={theme}
      onNavigateToDashboard={() => setView("dashboard")}
      onNavigateToBookmark={() => setView("bookmark")}
      onNavigateToCourses={() => setView("courses")}
      onNavigateToBranch={() => setView("branch")}
      onNavigateToSemester={() => setView("semester")}
      onNavigateToSubject={() => setView("subject")}
      onNavigateToHome={() => setView("home")}
      onNavigateToSettings={() => setView("settings")}
      onNavigateToFeedback={() => setView("feedback")}
      onNavigateToUnit={(resource, sub) => {
        if (sub) setSelectedSubject(sub);
        setView("unit");
      }}
    />
  );
}

if (view === "unit") {
  return (
    <Unit
      university={selectedUniversity}
      course={selectedCourse || { id: "btech", code: "B.Tech", name: "Bachelor of Technology", duration: "4 Years · 8 Semesters" }}
      branch={selectedBranch || { id: "cse", code: "CSE", name: "Computer Science & Engineering" }}
      semester={selectedSemester || { id: 1, name: "Semester 1" }}
      subject={selectedSubject || { id: "chem", code: "BT-101", name: "Engineering Chemistry" }}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      theme={theme}
      onNavigateToDashboard={() => setView("dashboard")}
      onNavigateToBookmark={() => setView("bookmark")}
      onNavigateToCourses={() => setView("courses")}
      onNavigateToBranch={() => setView("branch")}
      onNavigateToSemester={() => setView("semester")}
      onNavigateToSubject={() => setView("subject")}
      onNavigateToResources={() => setView("resources")}
      onNavigateToHome={() => setView("home")}
      onNavigateToSettings={() => setView("settings")}
      onNavigateToFeedback={() => setView("feedback")}
    />
  );
}

if (view === "feedback") {
  return (
    <Feedback
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      theme={theme}
      onNavigateToDashboard={() => setView("dashboard")}
      onNavigateToBookmark={() => setView("bookmark")}
      onNavigateToSettings={() => setView("settings")}
      onNavigateToHome={() => setView("home")}
    />
  );
}

if (view === "settings") {
  return (
    <Settings
      currentTheme={theme}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      onSaveTheme={(newTheme) => setTheme(newTheme)}
      onNavigateToDashboard={() => setView("dashboard")}
      onNavigateToBookmark={() => setView("bookmark")}
      onNavigateToHome={() => setView("home")}
      onNavigateToFeedback={() => setView("feedback")}
    />
  );
}

if (view === "bookmark") {
  return (
    <Bookmark
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      theme={theme}
      onNavigateToDashboard={() => setView("dashboard")}
      onNavigateToSettings={() => setView("settings")}
      onNavigateToFeedback={() => setView("feedback")}
      onNavigateToHome={() => setView("home")}
      onNavigateToResources={() => setView("resources")}
      onNavigateToUnit={() => setView("unit")}
    />
  );
}

const showDashboard = view === "dashboard" || (view === null && Boolean(user));

if (showDashboard) {
  return (
    <Dashboard
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      theme={theme}
      onNavigateToHome={() => setView("home")}
      onNavigateToBookmark={() => setView("bookmark")}
      onNavigateToSettings={() => setView("settings")}
      onNavigateToFeedback={() => setView("feedback")}
      onNavigateToCourses={(uni) => {
        if (uni) setSelectedUniversity(uni);
        setView("courses");
      }}
    />
  );
}

return <Home onNavigateToDashboard={() => setView("dashboard")} />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
