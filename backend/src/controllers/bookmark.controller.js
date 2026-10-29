import Bookmark from "../models/Bookmark.js";

/**
 * Get all bookmarks for the logged-in user
 */
export const getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { type } = req.query;

    const query = { userId };
    if (type && type !== "all") {
      query.type = type;
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle bookmark (add if absent, remove if present)
 */
export const toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const {
      id: bookmarkKey,
      type = "notes",
      categoryLabel = "Handwritten Notes",
      title,
      subject = "",
      subjectCode = "",
      semester = "",
      branch = "",
      university = "RGPV",
      unit = "",
      description = "",
      author = "",
      year = "",
      frequency = "",
      pages = "",
      fileUrl = "",
      materialId = null,
    } = req.body;

    if (!bookmarkKey) {
      return res.status(400).json({
        success: false,
        message: "Bookmark ID (id) is required",
      });
    }

    const existing = await Bookmark.findOne({ userId, bookmarkKey });

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed successfully",
      });
    }

    const newBookmark = await Bookmark.create({
      userId,
      bookmarkKey,
      type,
      categoryLabel,
      title: title || bookmarkKey,
      subject,
      subjectCode,
      semester,
      branch,
      university,
      unit,
      description,
      author,
      year,
      frequency,
      pages,
      fileUrl,
      materialId,
    });

    return res.status(201).json({
      success: true,
      bookmarked: true,
      message: "Bookmark added successfully",
      data: newBookmark,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all bookmarks for user
 */
export const clearUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    await Bookmark.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: "All bookmarks cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Sync bulk bookmarks (e.g. migrate localStorage bookmarks on first login)
 */
export const syncBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { bookmarks = [] } = req.body;

    if (!Array.isArray(bookmarks)) {
      return res.status(400).json({
        success: false,
        message: "bookmarks must be an array",
      });
    }

    for (const item of bookmarks) {
      if (item && item.id) {
        await Bookmark.findOneAndUpdate(
          { userId, bookmarkKey: item.id },
          {
            userId,
            bookmarkKey: item.id,
            type: item.type || "notes",
            categoryLabel: item.categoryLabel || "Handwritten Notes",
            title: item.title || item.id,
            subject: item.subject || "",
            subjectCode: item.subjectCode || "",
            semester: item.semester || "",
            branch: item.branch || "",
            university: item.university || "RGPV",
            unit: item.unit || "",
            description: item.description || "",
            author: item.author || "",
            year: item.year || "",
            frequency: item.frequency || "",
            pages: item.pages || "",
            fileUrl: item.fileUrl || "",
          },
          { upsert: true, new: true }
        );
      }
    }

    const currentList = await Bookmark.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Bookmarks synchronized successfully",
      count: currentList.length,
      data: currentList,
    });
  } catch (error) {
    next(error);
  }
};
