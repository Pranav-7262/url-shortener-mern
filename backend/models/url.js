import mongoose from "mongoose";

// Url model: stores original URL, shortId, click metrics and optional owner
const urlSchema = new mongoose.Schema(
  {
    originalurl: {
      // The original URL
      type: String,
      required: true,
    },
    shortId: {
      // The unique short identifier for the URL
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      // The number of times the short URL has been accessed
      type: Number,
      default: 0,
    },
    lastClick: {
      // Timestamp of the last click
      type: Date,
      default: null,
    },
    // Reference to the owner of the short url (optional for anonymous creation)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema); // Create the Url model using the schema
export default Url;
