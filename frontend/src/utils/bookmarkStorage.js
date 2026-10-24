// Utility for managing bookmarks across Notes, PYQs, and Important Questions
const STORAGE_KEY = "eduvault_bookmarks";

// Known dummy sample bookmark IDs to prune if they exist in user's localStorage
const SAMPLE_IDS = new Set([
  "note-chem-bt101",
  "note-math1-bt102",
  "pyq-chem-2023",
  "pyq-electrical-2023",
  "imp-chem-u1",
  "imp-math-u5",
  "imp-bee-u1",
]);

export const SAMPLE_BOOKMARKS = [];

/**
 * Get all bookmarks from localStorage (no sample data)
 * Always guarantees returning an Array to prevent "list.some is not a function" errors.
 */
export function getBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any previously seeded sample data
      const cleaned = parsed.filter((item) => item && item.id && !SAMPLE_IDS.has(item.id));
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    // If corrupted/non-array data was stored in localStorage, heal it to empty array
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (err) {
    console.error("Error reading bookmarks from localStorage:", err);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (_) {}
    return [];
  }
}

/**
 * Save bookmarks array to localStorage and notify listeners
 */
export function saveBookmarks(list) {
  try {
    const safeList = Array.isArray(list) ? list : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeList));
    // Trigger custom event so any component listening can re-render
    window.dispatchEvent(new Event("eduvault_bookmarks_changed"));
  } catch (err) {
    console.error("Error saving bookmarks to localStorage:", err);
  }
}

/**
 * Clear all bookmarks
 */
export function clearAllBookmarks() {
  saveBookmarks([]);
  return [];
}

/**
 * Check if a specific item is bookmarked by ID
 */
export function isBookmarked(id) {
  if (!id) return false;
  const list = getBookmarks();
  return Array.isArray(list) ? list.some((b) => b && b.id === id) : false;
}

/**
 * Add a new bookmark item
 */
export function addBookmark(item) {
  if (!item || !item.id) return getBookmarks();
  const list = getBookmarks();
  const safeList = Array.isArray(list) ? list : [];
  if (safeList.some((b) => b && b.id === item.id)) return safeList;
  const updated = [item, ...safeList];
  saveBookmarks(updated);
  return updated;
}

/**
 * Remove a bookmark by ID
 */
export function removeBookmark(id) {
  if (!id) return getBookmarks();
  const list = getBookmarks();
  const safeList = Array.isArray(list) ? list : [];
  const updated = safeList.filter((b) => b && b.id !== id);
  saveBookmarks(updated);
  return updated;
}

/**
 * Toggle bookmark status
 */
export function toggleBookmark(item) {
  if (!item || !item.id) return { bookmarked: false, list: getBookmarks() };
  if (isBookmarked(item.id)) {
    return { bookmarked: false, list: removeBookmark(item.id) };
  } else {
    return { bookmarked: true, list: addBookmark(item) };
  }
}

/**
 * Get count of bookmarks
 */
export function getBookmarkCount() {
  const list = getBookmarks();
  return Array.isArray(list) ? list.length : 0;
}

/**
 * Reset bookmarks (clears all)
 */
export function resetSampleBookmarks() {
  return clearAllBookmarks();
}
