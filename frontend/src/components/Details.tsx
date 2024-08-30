import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { userContext } from "../context/userContext";

interface UserContextType {
  username: string;
  setusername: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setemail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setpassword: React.Dispatch<React.SetStateAction<string>>;
}

const Details: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, setusername, email, setemail, password, setpassword } =
    useContext<UserContextType>(userContext);

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
      const response = await fetch("http://localhost:5000/signup", {
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
      });
      const data = await response.json();
      if (data.success) {
        setLoading(false);
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
        setLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
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
        <div className="h-2/3 bg-gray-100 lg:w-1/2 flex flex-col items-center justify-center shadow-2xl rounded-2xl backdrop-blur-lg bg-opacity-50">
          <div className=" w-full">
            <ul className="steps flex justify-between w-full">
              <li className="step step-primary flex-1 text-center py-2">
                Register
              </li>
              <li className="step step-primary flex-1 text-center py-2">
                Details
              </li>
            </ul>
          </div>

          <div className="max-w-md w-full">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Please enter your details
            </h1>
            <div className="mt-4 flex flex-col lg:flex-row items-center justify-between"></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className=" w-full">
                <div className="flex">
                  <div className="w-1/2 mr-2">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                      required
                    />
                  </div>
                  <div className="w-1/2 ml-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      type="text"
                      id="address"
                      name="address"
                      className="bg-white mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-red-600 font-bold text-white p-2 rounded-md hover:bg-red-500  focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  {loading ? (
                    <>
                      <div role="status">
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
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </>
                  ) : (
                    "Start Ordering"
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

export default Details;
