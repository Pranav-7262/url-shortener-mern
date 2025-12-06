import express from "express";
import Url from "../models/url.js";
import { auth } from "../middleware/auth.js";
import { nanoid } from "nanoid";

const router = express.Router();

// Create Short URL
router.post("/shorten", auth, async (req, res) => {
  try {
    const { originalurl } = req.body;
    if (!originalurl)
      return res.status(400).json({ message: "Original URL is required" });

    // Validate URL
    try {
      const parsed = new URL(originalurl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return res.status(400).json({ message: "Invalid URL" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    // Generate unique id
    let shortId;
    while (true) {
      shortId = nanoid(7);
      if (!(await Url.findOne({ shortId }))) break;
    }

    const newUrl = await Url.create({
      originalurl,
      shortId,
      user: req.user.id,
    });

    const shortUrl = `${process.env.BASE_URL}/${newUrl.shortId}`;

    return res.status(201).json({
      shortUrl,
      url: { ...newUrl.toObject(), shortUrl },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// User URLs
router.get("/user/urls", auth, async (req, res) => {
  try {
    const docs = await Url.find({ user: req.user.id }).sort({ createdAt: -1 });

    const urls = docs.map((u) => ({
      ...u.toObject(),
      shortUrl: `${process.env.BASE_URL}/${u.shortId}`,
    }));

    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
