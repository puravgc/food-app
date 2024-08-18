import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { userContext } from "../context/userContext";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const navigate = useNavigate();
  const { username, setusername, email, setemail, password, setpassword } =
    useContext(userContext);

  const handleGoogleSignup = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self");
  };

  return (
    <div>
      <div
        className="flex justify-center items-center h-screen"
        style={{
          backgroundImage: "url('/authbg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full bg-gray-100 lg:w-1/2 flex flex-col items-center justify-center py-10 backdrop-blur-lg bg-opacity-50 rounded-2xl shadow-2xl">
          <div className=" w-full">
            <ul className="steps flex justify-between w-full">
              <li className="step step-primary flex-1 text-center py-2">
                Register
              </li>
              <li className="step flex-1 text-center py-2">Details</li>
            </ul>
          </div>
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Sign Up
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Join to Our Community with all time access and free{" "}
            </h1>
            <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full mb-2 lg:mb-0">
                <button
                  onClick={handleGoogleSignup}
                  type="button"
                  className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  <FcGoogle className="text-black h-6 w-6" /> Sign Up with
                  Google{" "}
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>or with email</p>
            </div>
            <form
              onSubmit={() => {
                navigate("/details");
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  onChange={(e) => {
                    setusername(e.target.value);
                  }}
                  value={username}
                  type="text"
                  id="username"
                  name="username"
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                  value={email}
                  type="text"
                  id="email"
                  name="email"
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  onChange={(e) => {
                    setpassword(e.target.value);
                  }}
                  value={password}
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-red-600 text-white p-2 rounded-md hover:bg-red-500  focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div
              className="mt-4 text-sm text-gray-600 text-center"
              onClick={() => {
                navigate("/login");
              }}
            >
              <p>
                Already have an account?{" "}
                <a href="#" className="text-black hover:underline">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
