import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";

const UrlCard = ({ url, compact = false, showQr = false }) => {
  const short = url.shortUrl || `${window.location.origin}/${url.shortId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(short);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {}
  };

  return (
    <div
      className={`w-full p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 flex flex-col gap-3
        min-w-0
      `}
    >
      {/* URL Info */}
      <div className={`flex flex-col gap-2 min-w-0`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Short Link
          </span>
          <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
            {url.clicks} Clicks
          </span>
        </div>

        <a
          href={short}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-semibold text-green-600 dark:text-green-400 break-all"
        >
          <div className="px-2 py-2 bg-green-50/50 dark:bg-gray-700 rounded-md border border-green-200 dark:border-gray-600 break-words overflow-x-auto">
            {short}
          </div>
        </a>

        <div
          className={`text-sm text-gray-700 dark:text-gray-300 font-mono break-words ${
            compact ? "hidden sm:block" : ""
          }`}
          title={url.originalurl}
        >
          {url.originalurl}
        </div>
      </div>

      {/* Actions */}
      <div
        className={`flex flex-wrap items-center gap-2 ${
          compact ? "justify-end" : "justify-between"
        }`}
      >
        <div className="flex flex-wrap gap-2 min-w-0">
          <a
            href={short}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline btn-success flex-shrink-0"
          >
            Open
          </a>

          <button
            onClick={handleCopy}
            className={`btn btn-sm flex-shrink-0 ${
              copied ? "btn-success" : "btn-ghost"
            }`}
          >
            {copied ? "Copied" : "Copy"}
          </button>

          <Link
            to={`/stats/${url.shortId}`}
            className="btn btn-sm btn-ghost flex-shrink-0"
          >
            Stats
          </Link>
        </div>

        {showQr && (
          <div className="p-1 bg-white dark:bg-gray-900 rounded-md self-start flex-shrink-0">
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
