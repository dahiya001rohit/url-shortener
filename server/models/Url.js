import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
});

export default mongoose.model("Url", urlSchema);
