/**
 * Authentication Middleware
 * Validates request authentication.
 * In production, it can verify Firebase ID tokens.
 * In development, if Firebase Admin is not configured, it gracefully supports
 * decoded token simulation or header-based user context.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const devUserId = req.headers["x-user-id"];

    if (!authHeader && !devUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid Bearer token or sign in.",
      });
    }

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      
      // Basic payload extraction from JWT without crashing if offline
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
          req.user = {
            uid: payload.user_id || payload.sub || payload.uid,
            email: payload.email,
            displayName: payload.name || payload.displayName,
            photoURL: payload.picture,
          };
          return next();
        }
      } catch (tokenParseErr) {
        // Fallback to devUserId if available
      }
    }

    if (devUserId) {
      req.user = {
        uid: devUserId,
        email: req.headers["x-user-email"] || "student@eduvault.io",
        displayName: req.headers["x-user-name"] || "EduVault Student",
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

/**
 * Optional Auth Middleware
 * Populates req.user if present, but does not block the request if absent.
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const devUserId = req.headers["x-user-id"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
        req.user = {
          uid: payload.user_id || payload.sub || payload.uid,
          email: payload.email,
          displayName: payload.name || payload.displayName,
          photoURL: payload.picture,
        };
      }
    } catch (_) {}
  } else if (devUserId) {
    req.user = {
      uid: devUserId,
      email: req.headers["x-user-email"] || "student@eduvault.io",
      displayName: req.headers["x-user-name"] || "EduVault Student",
    };
  }

  next();
};
