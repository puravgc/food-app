import React, { useState } from "react";
import Hero from "./components/Hero";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Nopage from "./components/Nopage";
import Order from "./components/Order";
import Details from "./components/Details.tsx";
import { categoryContext } from "./context/categoryContext";
import { userContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./components/Cart";
import Profile from "./components/Profile.tsx";
import MyOrders from "./components/MyOrders.tsx";

const App = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [selectedCategory, setselectedCategory] = useState("beef");
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [totalCartItems, settotalCartItems] = useState(0);
  return (
    <BrowserRouter>
      <div className="h-screen w-screen overflow-hidden">
        <categoryContext.Provider
          value={{
            selectedCategory,
            setselectedCategory,
            totalCartItems,
            settotalCartItems,
          }}
        >
          <userContext.Provider
            value={{
              isLoggedIn,
              setisLoggedIn,
              username,
              setusername,
              email,
              setemail,
              password,
              setpassword,
            }}
          >
            <Navbar />
            <Toaster />
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/details" element={<Details />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/order" element={<Order />} />
              <Route path="/myorders" element={<MyOrders />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<Nopage />} />
            </Routes>
          </userContext.Provider>
        </categoryContext.Provider>
      </div>
    </BrowserRouter>
  );
};

export default App;
