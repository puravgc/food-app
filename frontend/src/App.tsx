import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Nopage from "./components/Nopage";
import Order from "./components/Order";
import Details from "./components/Details";
import {
  categoryContext,
  CategoryContextType,
} from "./context/categoryContext";
import { userContext, UserContextType } from "./context/userContext";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import MyOrders from "./components/MyOrders";
import NewPassword from "./components/NewPassword";

const categoryContextValue: CategoryContextType = {
  selectedCategory: "beef",
  setselectedCategory: () => {},
  totalCartItems: 0,
  settotalCartItems: () => {},
};

const userContextValue: UserContextType = {
  isLoggedIn: false,
  setisLoggedIn: () => {},
  username: "",
  setusername: () => {},
  email: "",
  setemail: () => {},
  password: "",
  setpassword: () => {},
};

const App: React.FC = () => {
  const [username, setusername] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [selectedCategory, setselectedCategory] = useState<string>("beef");
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [totalCartItems, settotalCartItems] = useState<number>(0);

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
              <Route path="/newpassword/:email" element={<NewPassword />} />
              <Route path="*" element={<Nopage />} />
            </Routes>
          </userContext.Provider>
        </categoryContext.Provider>
      </div>
    </BrowserRouter>
  );
};

export default App;
