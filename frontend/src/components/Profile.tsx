import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "react-modal";

const Profile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:5000/edituser", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        firstName: user.firstName,
        lastName: user.lastName,
      }),
    });
    const data = await response.json();
    if (data.success) {
      toast.success(data.message);
      fetchUserData();
    } else {
      toast.error(data.message);
    }
    setLoading(false);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const response = await fetch("http://localhost:5000/changepassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });
    const data = await response.json();
    if (data.success) {
      toast.success(data.message);
      setNewPassword("");
      setConfirmPassword("");
      setIsModalOpen(false);
    } else {
      toast.error(data.message);
    }
    setLoading(false);
  };

  const fetchUserData = async () => {
    const response = await fetch("http://localhost:5000/getuser", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      console.log(data)
    } else {
      console.error("Failed to fetch user data:", response.statusText);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
    fetchUserData();
  }, []);

  return (
    <div
      className="h-screen w-screen flex justify-center items-start pt-16 px-4"
      style={{
        backgroundImage: "url('/profilebg.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="p-6 max-w-md w-full bg-transparent backdrop-blur-2xl shadow-gray-600 shadow-md rounded-md border">
        <h1 className="text-2xl font-bold mb-8 text-center">Profile</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full px-3 py-2 border ${
                isEditing ? "border-gray-300" : "border-transparent"
              } rounded-md shadow-sm focus:outline-none ${
                isEditing ? "focus:ring-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full px-3 py-2 border ${
                isEditing ? "border-gray-300" : "border-transparent"
              } rounded-md shadow-sm focus:outline-none ${
                isEditing ? "focus:ring-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full px-3 py-2 border ${
                isEditing ? "border-gray-300" : "border-transparent"
              } rounded-md shadow-sm focus:outline-none ${
                isEditing ? "focus:ring-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full px-3 py-2 border ${
                isEditing ? "border-gray-300" : "border-transparent"
              } rounded-md shadow-sm focus:outline-none ${
                isEditing ? "focus:ring-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 mt-4 w-full"
        >
          Change Password
        </button>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full px-3 py-2 border ${
                isEditing ? "border-gray-300" : "border-transparent"
              } rounded-md shadow-sm focus:outline-none ${
                isEditing ? "focus:ring-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default Address
            </label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 block w-full px-3 py-2 border ${
                isEditing ? "border-gray-300" : "border-transparent"
              } rounded-md shadow-sm focus:outline-none ${
                isEditing ? "focus:ring-red-500 focus:border-red-500" : ""
              }`}
            />
          </div>
        </div>
        {isEditing ? (
          loading ? (
            <button
              role="status"
              className="mt-6 w-full bg-red-500 text-white flex items-center justify-center px-4 py-2 rounded-md shadow-sm hover:bg-red-600"
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5537C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8435 15.1192 80.8826 10.7231 75.2124 7.4698C69.5422 4.21648 63.2754 2.20821 56.7089 1.55337C51.7665 1.0248 46.7829 1.129 41.8889 1.85966C39.4173 2.24864 37.8652 4.73926 38.5023 7.16466C39.1394 9.59006 41.6191 11.0721 44.1216 10.7003C47.8207 10.1545 51.5999 10.0948 55.3308 10.5092C60.6482 11.1257 65.7864 12.912 70.3924 15.7916C74.9985 18.6713 78.9732 22.5902 82.0817 27.2727C84.443 30.7049 86.2414 34.5551 87.3916 38.6393C88.1278 41.0003 91.5422 42.1626 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600"
            >
              Save
            </button>
          )
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 w-full"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Change Password"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setcurrentPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          />
          <div className="mt-6 flex justify-between flex-wrap">
            <button
              onClick={handleChangePassword}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 mr-2"
            >
              Change
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
