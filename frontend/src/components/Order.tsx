// Order.tsx
import React, { useContext, useEffect, useState } from "react";
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

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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
    <div className="flex h-full bg-gradient-to-br from-gray-50 to-red-50/30">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative">
        <Foods
          selectedCategory={categoryCtx?.selectedCategory || ""}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
};

export default Order;
