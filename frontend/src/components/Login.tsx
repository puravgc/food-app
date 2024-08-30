import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { userContext } from "../context/userContext";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading } from "react-icons/ai";
import ForgotPassModal from "./ForgotPassModal";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
const Login = () => {
  const navigate = useNavigate();
  const { setisLoggedIn } = useContext(userContext);
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showpassword, setshowpassword] = useState<boolean>(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setisLoggedIn(true);
        setloading(false);
        toast.success(data.message);
        navigate("/order");
      } else {
        setloading(false);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self");
  };

  return (
    <div className="">
      <div
        className="flex justify-center items-center h-screen px-5"
        style={{
          backgroundImage: "url('/authbg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="h-fit bg-gray-100 lg:w-1/2 flex flex-col items-center justify-center shadow-2xl rounded-2xl backdrop-blur-lg bg-opacity-50 p-10 mb-10">
          <div className="max-w-md w-full">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Log In
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Join to Our Community with all time access and free{" "}
            </h1>
            <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full mb-2 lg:mb-0">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  <FcGoogle className="text-black h-6 w-6" /> Log In with Google{" "}
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>or with email</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  required
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  type="email"
                  id="email"
                  name="email"
                  className=" bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    required
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    type={showpassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  />
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
              <div onClick={() => setIsModalOpen(true)}>
                <p className="text-sm cursor-pointer">Forgot Password?</p>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-red-600 font-bold text-white p-2 rounded-md hover:bg-red-500  focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  {loading ? (
                    <>
                      <div role="status">
                        <AiOutlineLoading />
                        <span className="sr-only">Loading...</span>
                      </div>
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Don't have an account?{" "}
                <button
                  className="text-black hover:underline"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Signup here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ForgotPassModal open={isModalOpen} handleClose={handleCloseModal} />
    </div>
  );
};

export default Login;
