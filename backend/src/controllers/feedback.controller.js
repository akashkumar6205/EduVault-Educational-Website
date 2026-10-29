import Feedback from "../models/Feedback.js";

/**
 * Submit Feedback
 */
export const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comments } = req.body;
    const userId = req.user?.uid || req.body.userId;
    const userName = req.user?.displayName || req.body.userName || "Student User";
    const userEmail = req.user?.email || req.body.userEmail || "student@eduvault.io";

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    if (!comments || comments.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Comments must be at least 5 characters long",
      });
    }

    const feedback = await Feedback.create({
      userId,
      userName,
      userEmail,
      rating: Number(rating),
      comments: comments.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully. Thank you for your review!",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all feedback reviews with summary statistics
 */
export const getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    const totalReviews = feedbacks.length;
    const avgRating =
      totalReviews > 0
        ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalReviews).toFixed(1)
        : 5.0;

    return res.status(200).json({
      success: true,
      stats: {
        totalReviews,
        avgRating: Number(avgRating),
      },
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};
