import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
          Your Profile
        </h2>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Name</div>
          <div className="text-lg font-medium">{user?.name}</div>

          <div className="text-sm text-gray-500 mt-4">Email</div>
          <div className="text-lg font-medium">{user?.email}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
