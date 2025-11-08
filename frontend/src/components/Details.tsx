import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { userContext } from "../context/userContext";
import Loader from "./Loader";

const Details: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(userContext);

  if (!context) {
    throw new Error(
      "Details component must be used within a UserContextProvider"
    );
  }

  const { username, setusername, email, setemail, password, setpassword } =
    context;

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has("username")) {
      setusername(queryParams.get("username") || "");
    }
    if (queryParams.has("email")) {
      setemail(queryParams.get("email") || "");
    }
    if (queryParams.has("firstName")) {
      setFirstName(queryParams.get("firstName") || "");
    }
    if (queryParams.has("lastName")) {
      setLastName(queryParams.get("lastName") || "");
    }
  }, [location.search, setusername, setemail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
        setusername("");
        setemail("");
        setpassword("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setAddress("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <div
        className="flex justify-center items-center min-h-screen px-4"
        style={{
          backgroundImage: "url('/authbg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full max-w-lg lg:w-1/2 bg-gray-100 flex flex-col items-center justify-center shadow-2xl rounded-2xl backdrop-blur-lg bg-opacity-50 p-6 sm:p-8">
          {/* Steps */}
          <div className="w-full mb-4">
            <ul className="steps flex justify-between w-full">
              <li className="step step-primary flex-1 text-center py-2">
                Register
              </li>
              <li className="step step-primary flex-1 text-center py-2">
                Details
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-black text-center">
              Please enter your details
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    required
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
                    +977
                  </span>

                  <input
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) setPhoneNumber(value);
                    }}
                    type="tel"
                    className="bg-white p-2 w-full border rounded-md pl-14 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                    required
                  />
                </div>
                <span className="text-xs text-gray-500">
                  Phone number should be 10 digits long.
                </span>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                disabled={
                  loading ||
                  !firstName ||
                  !lastName ||
                  !phoneNumber ||
                  !address ||
                  phoneNumber.length < 10
                }
                type="submit"
                className="w-full flex justify-center items-center bg-red-600 font-bold text-white p-2 rounded-md hover:bg-red-500 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                {loading ? (
                  <div role="status" className="items-center">
                    <Loader />
                  </div>
                ) : (
                  "Start Ordering"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
