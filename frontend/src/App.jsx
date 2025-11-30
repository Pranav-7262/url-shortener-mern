import React from "react";
import axios from "axios";
import { useState } from "react";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const BASE_API = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false); // to track copy status
  const [qrimage, setqrimage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url || loading) return;
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_API}/shorten`, {
        originalurl: url,
      }); // here originalurl is the key which the backend is expecting
      const newShortUrl = response.data.shortUrl; // shortUrl is like localhost:3000/abc1234
      setShortUrl(newShortUrl); // set the shortened URL to state
      setCopied(false); // reset copied status

      // Generate QR code image
      const qr = await QRCodeGenerator.toDataURL(newShortUrl); // here we are generating QR code for the shortened URL
      setqrimage(qr); // set the generated QR code image to state
    } catch (error) {
      console.error(error);
      alert("Error shortening URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset copied status after 2 seconds
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-4xl font-bold mb-4 text-center">URL SHORTENER</h1>
      <div className="flex flex-col gap-3 w-full max-w-3xl">
        <input
          type="text"
          className="input input-success w-full"
          placeholder="Enter long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleShorten}
          className="btn btn-primary w-full sm:auto"
          disabled={loading}
        >
          Shorten
        </button>
      </div>
      {shortUrl && (
        <div className="flex flex-col items-center max-w-3xl w-full">
          <p className="font-medium mb-2">Your short link:</p>
          <a
            className="link link-primary break-all"
            target="_blank"
            href={shortUrl}
          >
            {shortUrl}
          </a>
          <button
            onClick={handleCopy}
            className={`btn mt-2 w-full ${
              copied ? "btn-success" : "btn-secondary"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <p className="mb-2 text-center font-semibold text-gray-800">
              Scan QR Code:
            </p>
            <QRCode value={shortUrl} size={180} />
          </div>
          {qrimage && (
            <a
              className="btn btn-accent mt-3 w-full"
              download="qr-code.png"
              href={qrimage}
            >
              Download QR Code
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
