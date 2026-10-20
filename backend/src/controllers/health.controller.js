import mongoose from "mongoose";

const getDbStateString = (state) => {
  switch (state) {
    case 0:
      return "disconnected";
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";
    default:
      return "unknown";
  }
};

export const checkHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    success: true,
    message: "Backend API is up and running",
    timestamp: new Date().toISOString(),
    database: {
      status: getDbStateString(dbState),
      readyState: dbState,
      connected: dbState === 1
    }
  });
};
