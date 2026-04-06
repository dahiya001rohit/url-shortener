import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: null },
  googleId: { type: String, default: null },
  avatar: { type: String, default: null },
  bio: { type: String, default: "" },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  preferences: {
    accentColor: { type: String, default: "#002F2D" },
    density: {
      type: String,
      enum: ["comfortable", "compact", "cozy"],
      default: "comfortable",
    },
    fontSize: { type: Number, default: 14 },
    notifications: {
      clickMilestones: { type: Boolean, default: true },
      weeklyDigest:    { type: Boolean, default: true },
      expiryWarnings:  { type: Boolean, default: true },
      productUpdates:  { type: Boolean, default: false },
      securityAlerts:  { type: Boolean, default: true },
    },
    emailFrequency: {
      type: String,
      enum: ["instant", "daily", "weekly"],
      default: "daily",
    },
    links: {
      defaultExpiry: { type: String, default: "never" },
      aliasStyle: {
        type: String,
        enum: ["Word-Scale", "Alpha-Numeric", "Short-Hash"],
        default: "Word-Scale",
      },
      autoTag:     { type: Boolean, default: false },
      utmEnabled:  { type: Boolean, default: false },
      utmSource:   { type: String, default: "" },
      utmMedium:   { type: String, default: "" },
      utmCampaign: { type: String, default: "" },
    },
    privacy: {
      allowAnonymousTracking: { type: Boolean, default: true },
      shareAnonymizedData:    { type: Boolean, default: true },
    },
  },
});

export default mongoose.model("User", userSchema);
