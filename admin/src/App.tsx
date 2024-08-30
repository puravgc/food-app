import Navbar from "./components/Navbar";
import Orders from "./components/Orders";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
