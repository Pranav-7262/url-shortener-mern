import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UrlDetails = () => {
  const { shortId } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/stats/${shortId}`);
        setStats(res.data);
      } catch (e) {
        console.error("Failed to load stats:", e);
      }
    };
    fetchStats();
  }, [shortId]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          URL Stats
        </h2>
        {!stats ? (
          <div className="text-gray-400">Loading stats...</div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Original</div>
              <div className="break-all text-blue-500 font-mono">
                {stats.originalurl}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Short ID</div>
              <div className="font-mono text-gray-200">{stats.shortId}</div>
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-sm text-gray-500">Clicks</div>
                <div className="text-lg font-semibold">{stats.clicks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Created</div>
                <div className="text-sm text-gray-200">
                  {new Date(stats.createdAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Click</div>
                <div className="text-sm text-gray-200">
                  {stats.lastClick
                    ? new Date(stats.lastClick).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlDetails;
