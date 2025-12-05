import React from "react";

const Help = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
          Need Help?
        </h2>
        <p className="text-gray-400">Here's how to get started:</p>
        <ol className="list-decimal list-inside text-gray-300 mt-3 space-y-2">
          <li>Create an account or log in.</li>
          <li>Use the dashboard to shorten URLs and manage them.</li>
          <li>
            Click the stats button on each short URL to view clicks and history.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Help;
