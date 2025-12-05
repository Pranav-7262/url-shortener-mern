import express from "express";
import Url from "../models/url.js";
import { auth } from "../middleware/auth.js";
import { nanoid } from "nanoid"; // tiny, collision-resistant id generator

const router = express.Router();

// Create a shortened URL (authenticated)
// - Validates original URL, generates a unique shortId, stores record, and
//   returns an absolute `shortUrl` so the frontend can open it directly.
router.post("/shorten", auth, async (req, res) => {
  try {
    const { originalurl } = req.body;
    if (!originalurl)
      return res.status(400).json({ message: "Original URL is required" });

    // Ensure value is a valid http(s) URL
    try {
      const parsed = new URL(originalurl);
      if (!["http:", "https:"].includes(parsed.protocol))
        return res.status(400).json({ message: "Invalid URL" });
    } catch (error) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    // Generate a unique shortId (loop only on collision)
    let shortId;
    while (true) {
      shortId = nanoid(7);
      const exists = await Url.findOne({ shortId });
      if (!exists) break;
    }

    const newUrl = await Url.create({
      originalurl,
      shortId,
      user: req.user?.id,
    });
    const shortUrl = `${req.protocol}://${req.headers.host}/${newUrl.shortId}`;
    return res
      .status(201)
      .json({ shortUrl, url: { ...newUrl.toObject(), shortUrl } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Return current user's URLs (adds absolute `shortUrl` to each item)
router.get("/user/urls", auth, async (req, res) => {
  try {
    const docs = await Url.find({ user: req.user.id }).sort({ createdAt: -1 });
    const urls = docs.map((u) => {
      const obj = u.toObject();
      obj.shortUrl = `${req.protocol}://${req.headers.host}/${u.shortId}`;
      return obj;
    });
    return res.json({ urls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Redirect route: when a short URL is visited, increment metrics and redirect
router.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });
    if (!url) return res.status(404).json({ message: "URL not found" });

    url.clicks += 1;
    url.lastClick = new Date();
    await url.save();
    return res.redirect(url.originalurl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Stats endpoint: return basic metrics for a shortId
router.get("/stats/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });
    if (!url) return res.status(404).json({ message: "URL not found" });
    return res.json({
      shortId: url.shortId,
      originalurl: url.originalurl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      lastClick: url.lastClick,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
