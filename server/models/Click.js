import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true },
  shortCode: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },
  country: { type: String, default: "Unknown" },
  device: { type: String, enum: ["mobile", "tablet", "desktop"], default: "desktop" },
  browser: { type: String },
  referrer: { type: String, default: "Direct" },
});

export default mongoose.model("Click", clickSchema);
