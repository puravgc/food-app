import React, {  useState } from "react";
import Navbar from "./components/Navbar";
import Orders from "./components/Orders";
import Dashboard from "./components/Dashboard";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const App = () => {

  const [selected, setselected] = useState("orders");
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
