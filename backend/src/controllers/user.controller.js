import User from "../models/User.js";

export const syncUser = async (req, res, next) => {
  try {
    const { uid, email, displayName, photoURL } = req.user;
    const { preferences } = req.body;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email || `${uid}@student.eduvault.io`,
        displayName: displayName || "EduVault Student",
        photoURL: photoURL || "",
        preferences: preferences || {
          university: "RGPV",
          course: "B.Tech",
          branch: "CSE",
          semester: 1,
          theme: "light",
        },
      });
    } else {
      // Update details if provided
      if (displayName) user.displayName = displayName;
      if (photoURL) user.photoURL = photoURL;
      if (preferences) {
        user.preferences = { ...user.preferences.toObject(), ...preferences };
      }
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "User synchronized successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found. Please sync user first.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { displayName, preferences } = req.body;
    let user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: req.user.uid,
        email: req.user.email || `${req.user.uid}@student.eduvault.io`,
        displayName: displayName || "EduVault Student",
        preferences: preferences || {},
      });
    } else {
      if (displayName) user.displayName = displayName;
      if (preferences) {
        user.preferences = { ...user.preferences.toObject(), ...preferences };
      }
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
