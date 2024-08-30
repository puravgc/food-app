import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-slate-400 shadow-md border py-2 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex justify-between w-full">
            <div className="shrink-0 flex items-center">
              <img src="/logo.png" className="h-20" alt="Logo" />
            </div>
            <div className="flex justify-center items-center">
              <h1 className="font-bold text-2xl text-red-500">ADMIN ACCESS</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 justify-center items-center">
              <div className=""></div>
            </div>
          </div>

          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="bg-red-600 p-2 ml-5 rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-red-600"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-gray-900 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Orders
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-900 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Dashboard
            </Link>

            <button className="text-white bg-red-600 hover:bg-red-700 block w-full text-center px-3 py-2 rounded-md text-base font-medium">
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
