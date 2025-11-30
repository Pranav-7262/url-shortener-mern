import express from "express";
import Url from "../models/url.js";
import { nanoid } from "nanoid"; // for generating unique short IDs

const router = express.Router();

router.post("/shorten", async (req, res) => {
  // Endpoint to create a shortened URL

  try {
    const { originalurl } = req.body; // Get the original URL from the request body
    if (!originalurl) {
      return res.status(400).json({ message: "Original URL is required" });
    }
    try {
      // Validate the original URL is properly formatted and uses http(s)
      const parsed = new URL(originalurl); // new URL() will throw if the URL is invalid
      if (!["http:", "https:"].includes(parsed.protocol)) {
        // only allow http and https protocols
        return res.status(400).json({ message: "Invalid URL" });
      }
    } catch (error) {
      // new URL() throws if given an invalid URL string
      return res.status(400).json({ message: "Invalid URL" });
    }

    let shortId; // ex . abc1234
    let exists = true;

    while (exists) {
      //this is for checking unique shortId , if exists generate new one
      shortId = nanoid(7); // Generate a unique short ID
      const url = await Url.findOne({ shortId });
      if (!url) {
        exists = false;
      }
    }
    const newUrl = await Url.create({ originalurl, shortId }); // Save the new URL mapping to the database

    const protocol = req.protocol;

    res.status(201).json({
      shortUrl: `${protocol}://${req.headers.host}/${newUrl.shortId}`,
    }); // Return the shortened URL , including the host , example: localhost:3000/abc1234 , req.headers.host is may be different based on environment
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:shortId", async (req, res) => {
  // Endpoint to redirect to the original URL using the short ID , when user access short url like localhost:3000/abc1234 ,
  try {
    const { shortId } = req.params; // Id is like , eg , abc1234
    const url = await Url.findOne({ shortId });
    if (url) {
      url.clicks += 1; // Increment the click count
      await url.save(); // Save the updated URL document
      return res.redirect(url.originalurl); // Redirect to the original URL
    } else {
      return res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
