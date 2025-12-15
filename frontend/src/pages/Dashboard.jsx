import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";
import UrlCard from "../components/UrlCard";
import EmptyState from "../components/EmptyState";

const Dashboard = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrimage, setqrimage] = useState("");
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [compact, setCompact] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // BASE API handled by Vite proxy (/api → localhost:3000)

  // Fetch URLs of logged-in user
  const loadUrls = async () => {
    try {
      const res = await axios.get(`/user/urls`, {
        withCredentials: true,
      });
      setUrls(res.data.urls || []);
    } catch (err) {
      console.error("Error loading URLs:", err);
    }
  };

  // Create short URL
  const handleShorten = async () => {
    if (!url || loading) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `/shorten`,
        { originalurl: url },
        { withCredentials: true }
      );

      const newShort = res.data.shortUrl;
      setShortUrl(newShort);

      // Make sure the returned URL object includes the absolute shortUrl
      if (res.data.url) {
        const u = { ...res.data.url, shortUrl: res.data.shortUrl };
        setUrls((prev) => [u, ...prev]);
      } else {
        loadUrls();
      }

      // Generate QR Code
      const qr = await QRCodeGenerator.toDataURL(newShort);
      setqrimage(qr);

      setCopied(false);
    } catch (err) {
      console.error(err);
      alert("Error creating short URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const location = useLocation();
  useEffect(() => {
    loadUrls();
  }, []);

  useEffect(() => {
    if (location.hash === "#urls") {
      const el = document.getElementById("urls");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  const totalClicks = urls.reduce((acc, u) => acc + (u.clicks || 0), 0);

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto max-w-4xl">
        <div className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl mt-8 transition-all duration-300">
          <h1 className="text-4xl font-extrabold text-center mb-10 dark:text-white flex items-center justify-center gap-3">
            InstantLink 🔗
            <span className="text-2xl text-green-500">Shortener</span>
          </h1>

          {/* URL Input and Shorten Button */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full">
              <input
                type="url"
                placeholder="Paste your long URL here..."
                className="flex-1 px-5 py-3 text-lg rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-green-500/50 transition duration-200"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleShorten();
                }}
                aria-label="Original URL Input"
              />

              <button
                onClick={handleShorten}
                disabled={loading}
                className="px-8 py-3 text-lg rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-lg shadow-green-500/40 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full"
              >
                {loading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  "Shorten It!"
                )}
              </button>
            </div>
          </div>

          {/* Short URL Output */}
          {shortUrl && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="font-medium text-xl mb-4 dark:text-gray-200">
                ✅ Your new Short Link is ready:
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl max-w-xl mx-auto shadow-inner">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-mono text-lg break-all hover:underline transition-colors flex-1 text-center sm:text-left"
                >
                  {shortUrl}
                </a>

                <button
                  onClick={handleCopy}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    copied
                      ? "bg-green-500 text-white shadow-md shadow-green-500/50"
                      : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/80"
                  }`}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>

              {/* QR Code and Download */}
              <div className="flex flex-col items-center mt-6">
                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg shadow-xl inline-block">
                  <QRCode value={shortUrl} size={160} level="H" />
                </div>

                {qrimage && (
                  <a
                    download="instantlink-qr.png"
                    href={qrimage}
                    className="mt-4 px-6 py-2 text-sm rounded-lg font-medium text-green-600 border border-green-600 hover:bg-green-50 dark:hover:bg-gray-700 transition duration-200"
                  >
                    Download QR Code
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mt-12">
            {/* Quick Stats and View Controls */}
            <div className="mb-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              {/* Stats Cards */}
              <div className="flex gap-4 w-full md:w-auto">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-gray-700 border-l-4 border-green-500 min-w-[120px] text-left shadow-md flex-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total URLs
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {urls.length}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500 min-w-[120px] text-left shadow-md flex-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Clicks
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {totalClicks}
                  </div>
                </div>
              </div>

              {/* View Toggles */}
              <div className="flex gap-3 items-center mt-4 md:mt-0 p-2 rounded-xl bg-gray-100 dark:bg-gray-700 shadow-inner shrink-0">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  View Style:
                </span>
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    !compact
                      ? "bg-white dark:bg-gray-800 text-green-600 shadow-sm"
                      : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setCompact(false)}
                >
                  Grid
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    compact
                      ? "bg-white dark:bg-gray-800 text-green-600 shadow-sm"
                      : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setCompact(true)}
                >
                  Compact
                </button>
                <button
                  className={`ml-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    showQr
                      ? "bg-purple-500 text-white shadow-md shadow-purple-500/40"
                      : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setShowQr((v) => !v)}
                >
                  {showQr ? "Hide QR" : "Show QR"}
                </button>
              </div>
            </div>

            <h2 className="text-3xl font-bold dark:text-white mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              Your Shortened URLs
            </h2>

            {/* URLs List/Grid */}
            {urls.length === 0 ? (
              <EmptyState
                title="No URLs yet"
                subtitle="Shorten your first URL to see it here!"
              />
            ) : (
              <div
                className={`grid gap-6 justify-items-center ${
                  compact
                    ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
                }`}
              >
                {urls.map((u) => (
                  <div className="w-full flex justify-center" key={u._id}>
                    <UrlCard url={u} compact={compact} showQr={showQr} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 pb-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Built with <span className="text-red-500">❤️</span> using React,
          Tailwind CSS & Daily UI Principles.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
