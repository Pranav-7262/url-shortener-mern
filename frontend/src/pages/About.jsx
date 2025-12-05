import React from "react";

const About = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
          About Shorty
        </h2>
        <p className="text-gray-400">
          A small lightweight URL shortener built with React and Express.
        </p>
        <p className="text-gray-400 mt-2">
          Open-source and built for developers. Improve it and contribute!
        </p>
      </div>
    </div>
  );
};

export default About;
