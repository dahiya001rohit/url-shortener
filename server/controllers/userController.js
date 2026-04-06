import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Url from "../models/Url.js";
import Click from "../models/Click.js";

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const urls = await Url.find({ userId: req.user.id });
    const totalLinks = urls.length;
    const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);
    const activeLinks = urls.filter(
      (u) => !u.expiresAt || u.expiresAt > new Date()
    ).length;

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      preferences: user.preferences,
      memberSince: user.createdAt,
      totalLinks,
      totalClicks,
      activeLinks,
      plan: "free",
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, email, bio } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: "Valid email is required" });

    const taken = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (taken) return res.status(409).json({ message: "Email already in use" });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, bio: bio || "" },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword)
      return res.status(400).json({ message: "Current password is required" });
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: "New password must be at least 6 characters" });

    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(401).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req, res, next) {
  try {
    const urls = await Url.find({ userId: req.user.id });
    await Click.deleteMany({ urlId: { $in: urls.map((u) => u._id) } });
    await Url.deleteMany({ userId: req.user.id });
    await User.findByIdAndUpdate(req.user.id, {
      isDeleted: true,
      deletedAt: new Date(),
      name: "Deleted User",
      password: "DELETED",
      bio: "",
    });
    res.clearCookie("refreshToken");
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function exportData(req, res, next) {
  try {
    const urls = await Url.find({ userId: req.user.id });

    const headers = ["Short Code", "Original URL", "Clicks", "Created At", "Expires At"].join(",");

    const rows = urls.map((u) => [
      `snip.ly/${u.shortCode}`,
      `"${u.originalUrl}"`,
      u.clicks || 0,
      new Date(u.createdAt).toLocaleDateString(),
      u.expiresAt ? new Date(u.expiresAt).toLocaleDateString() : "Never",
    ].join(","));

    const csv = [headers, ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="snip-export-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

export async function getPreferences(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("preferences");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.preferences);
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const { preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { preferences } },
      { new: true }
    ).select("preferences");
    res.json(user.preferences);
  } catch (err) {
    next(err);
  }
}
