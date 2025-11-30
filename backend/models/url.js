import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema); // Create the Url model using the schema
export default Url;
