import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";

// Small, focused URL card. Use server-provided `shortUrl` when available
const UrlCard = ({ url, compact = false, showQr = false }) => {
  const short = url.shortUrl || `${window.location.origin}/${url.shortId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(short);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // ignore copy failures silently
    }
  };

  return (
    <div
      className={`w-full p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800 flex flex-col items-stretch
        sm:max-w-sm md:max-w-md lg:max-w-lg
        ${compact ? "sm:flex-row sm:items-center" : ""}
      `}
    >
      <div
        className={`flex ${
          compact
            ? "flex-1 min-w-0 flex-col sm:flex-row sm:items-center"
            : "flex-col w-full"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Short Link
          </div>
          <div className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
            {url.clicks} Clicks
          </div>
        </div>

        <a
          href={short}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-semibold text-green-600 dark:text-green-400 wrap-break-word w-full"
        >
          <div className="px-2 py-2 bg-green-50/50 dark:bg-gray-700 rounded-md border border-green-200 dark:border-gray-600 wrap-break-word">
            {short}
          </div>
        </a>

        <div
          className={`mt-3 text-sm text-gray-700 dark:text-gray-300 font-mono wrap-break-word ${
            compact ? "hidden sm:block" : ""
          }`}
          title={url.originalurl}
        >
          {url.originalurl}
        </div>
      </div>

      <div
        className={`flex flex-wrap items-center gap-2 mt-3 ${
          compact ? "justify-end" : "justify-between"
        }`}
      >
        <div className="flex flex-wrap gap-2">
          <a
            href={short}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline btn-success"
          >
            Open
          </a>
          <button
            onClick={handleCopy}
            className={`btn btn-sm ${copied ? "btn-success" : "btn-ghost"}`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <Link to={`/stats/${url.shortId}`} className="btn btn-sm btn-ghost">
            Stats
          </Link>
        </div>

        {showQr && (
          <div className="p-1 bg-white dark:bg-gray-900 rounded-md">
            <QRCode value={short} size={64} level="L" />
          </div>
        )}
      </div>
    </div>
  );
};

UrlCard.propTypes = {
  url: PropTypes.object.isRequired,
  compact: PropTypes.bool,
  showQr: PropTypes.bool,
};

export default UrlCard;
