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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="card w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 p-6 sm:p-8">
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-8 text-center text-primary dark:text-accent tracking-tight">
          🔗 Shorten URL
        </h1>

        {/* Input and Button */}
        <div className="flex flex-col gap-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text dark:text-gray-200">
                Enter Long URL
              </span>
            </div>
            <input
              type="url" // Use type="url" for better mobile keyboard/validation
              className="input input-bordered input-primary w-full text-base dark:bg-gray-700 dark:text-white"
              placeholder="e.g., https://very-long-url-here.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>

          <button
            onClick={handleShorten}
            className="btn btn-primary w-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Generate Short Link"
            )}
          </button>
        </div>

        {/* Result Section (Short URL and QR Code) */}
        {shortUrl && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col items-center w-full">
            <p className="font-semibold text-lg mb-4 text-center dark:text-gray-200">
              ✅ Your Short Link is Ready:
            </p>

            <div className="flex flex-col items-center gap-3 w-full">
              <a
                className="link link-hover text-lg font-mono text-secondary dark:text-accent break-all p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer" // Good practice for target="_blank"
                href={shortUrl}
              >
                {shortUrl}
              </a>

              <button
                onClick={handleCopy}
                className={`btn btn-sm w-full sm:w-1/2 mt-2 ${
                  copied ? "btn-success" : "btn-outline btn-secondary"
                } transition-colors duration-200`}
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>

            {/* QR Code and Download */}
            <div className="mt-8 p-6 bg-base-200 dark:bg-gray-700 rounded-xl shadow-inner flex flex-col items-center">
              <p className="mb-4 text-center font-bold text-gray-700 dark:text-gray-200">
                Scan QR Code:
              </p>
              <div className="p-2 bg-white rounded-lg shadow-md">
                <QRCode value={shortUrl} size={180} />
              </div>

              {qrimage && (
                <a
                  className="btn btn-outline btn-accent mt-4 w-full"
                  download="short-link-qr-code.png"
                  href={qrimage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download QR Code
                </a>
              )}
            </div>
          </div>
        )}
      </div>
      <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Built with React, Tailwind CSS, and DaisyUI.
      </footer>
    </div>
  );
};

export default App;
