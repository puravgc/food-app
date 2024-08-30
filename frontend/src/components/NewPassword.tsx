import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import CryptoJS from "crypto-js";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const NewPassword = () => {
  const navigate = useNavigate();
  const { email } = useParams<{ email: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const decodedEmail = decodeURIComponent(email || "");

  const decryptedEmail = CryptoJS.AES.decrypt(
    decodedEmail,
    "testsecret"
  ).toString(CryptoJS.enc.Utf8);
  console.log(decryptedEmail);
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (newPassword != confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/resetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword, email: decryptedEmail }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.success === true) {
        setLoading(false);
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div
        className="flex justify-center items-center h-screen"
        style={{
          backgroundImage: "url('/authbg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="h-2/3 bg-gray-100 lg:w-1/2 flex flex-col items-center justify-center shadow-2xl rounded-2xl backdrop-blur-lg bg-opacity-50 p-10">
          <div className="max-w-md w-full">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Set New Password
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Please enter your new password below
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-red-600 font-bold text-white p-2 rounded-md hover:bg-red-500 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  {loading ? (
                    <>
                      <div role="status">
                        <AiOutlineLoading className="animate-spin" />
                        <span className="sr-only">Loading...</span>
                      </div>
                    </>
                  ) : (
                    "Set Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
