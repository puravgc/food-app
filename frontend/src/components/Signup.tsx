import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { userContext, UserContextType } from "../context/userContext";
import { GoEye, GoEyeClosed } from "react-icons/go";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [showpassword, setshowpassword] = useState(false);
  const contextValue = useContext<UserContextType | undefined>(userContext);

  if (!contextValue) {
    throw new Error(
      "Context value is undefined. Make sure the component is wrapped in a UserContext.Provider."
    );
  }

  const { username, setusername, email, setemail, password, setpassword } =
    contextValue;
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long."
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleGoogleSignup = () => {
    window.open(
      "https://food-app-backend-topaz.vercel.app/auth/google/callback",
      "_self"
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword(password)) {
      navigate("/details");
    }
  };

  return (
    <div>
      <div
        className="flex justify-center items-center min-h-screen px-5"
        style={{
          backgroundImage: "url('/authbg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full bg-gray-100 md:w-3/4 lg:w-1/2 flex flex-col items-center justify-center py-10 backdrop-blur-lg bg-opacity-50 rounded-2xl shadow-2xl">
          <div className="w-full">
            <ul className="steps flex justify-between w-full">
              <li className="step step-primary flex-1 text-center py-2">
                Register
              </li>
              <li className="step flex-1 text-center py-2">Details</li>
            </ul>
          </div>
          <div className="w-full max-w-md px-6">
            <h1 className="text-2xl lg:text-3xl font-semibold mb-4 lg:mb-6 text-black text-center">
              Sign Up
            </h1>
            <h1 className="text-xs lg:text-sm font-semibold mb-4 lg:mb-6 text-gray-500 text-center">
              Join Our Community with all-time access and free{" "}
            </h1>
            <div className="mt-4 flex flex-col lg:flex-row items-center justify-between w-full">
              <button
                onClick={handleGoogleSignup}
                type="button"
                className="w-full flex justify-center items-center gap-2 bg-white text-xs lg:text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                <FcGoogle className="text-black h-6 w-6" /> Sign Up with Google
              </button>
            </div>
            <div className="mt-4 text-xs lg:text-sm text-gray-600 text-center">
              <p>or with email</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  required
                  onChange={(e) => setusername(e.target.value)}
                  value={username}
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  required
                  onChange={(e) => setemail(e.target.value)}
                  value={email}
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div className="relative">
                <label className="block text-xs lg:text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => {
                      setpassword(e.target.value);
                      setPasswordError("");
                      console.log(passwordError);
                    }}
                    value={password}
                    type={showpassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="mt-1 p-2 pr-10 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  />
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                  )}
                  <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                    {showpassword ? (
                      <GoEye
                        className="h-6 w-6 text-gray-500"
                        onClick={() => {
                          setshowpassword(!showpassword);
                        }}
                      />
                    ) : (
                      <GoEyeClosed
                        className="h-6 w-6 text-gray-500"
                        onClick={() => {
                          setshowpassword(!showpassword);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-red-600 text-white p-2 rounded-md hover:bg-red-500 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div
              className="mt-4 text-xs lg:text-sm text-gray-600 text-center cursor-pointer"
              onClick={() => navigate("/login")}
            >
              <p>
                Already have an account?{" "}
                <span className="text-black hover:underline">Login here</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
