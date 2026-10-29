import { getImageKitInstance } from "../config/imagekit.js";

export const getAuthParameters = (req, res) => {
  const imagekit = getImageKitInstance();

  if (!imagekit) {
    return res.status(503).json({
      success: false,
      message: "ImageKit service is not configured on the server.",
    });
  }

  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return res.status(200).json({
      success: true,
      data: authenticationParameters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate ImageKit authentication parameters.",
      error: error.message,
    });
  }
};
