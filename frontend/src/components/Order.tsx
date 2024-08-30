import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Foods from "./Foods";
import { categoryContext } from "../context/categoryContext";
import { userContext } from "../context/userContext";
import { toast } from "react-hot-toast";

const Order: React.FC = () => {
  const categoryCtx = useContext(categoryContext);
  const userCtx = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      userCtx?.setisLoggedIn(true);
      toast.success("Logged in successfully!");
      navigate("/order");
    } else {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        navigate("/login");
      }
    }
  }, [userCtx, navigate]);

  return (
    <div className="flex">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="w-full h-screen overflow-y-auto pb-24">
        <Foods selectedCategory={categoryCtx?.selectedCategory || ""} />
      </div>
    </div>
  );
};

export default Order;
