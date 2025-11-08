import React, { useEffect, useState, useContext, useRef } from "react";
import { categoryContext } from "../context/categoryContext";
import { FaTimes } from "react-icons/fa";

interface Category {
  strCategory: string;
}
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  setIsOpen,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const context = useContext(categoryContext);

  if (!context) {
    throw new Error("Sidebar must be used within a CategoryContextProvider");
  }

  const { selectedCategory, setselectedCategory } = context;
  const sidebarRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error: any) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleCategoryClick = (category: Category) => {
    setselectedCategory(category.strCategory.toLowerCase());
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden  ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl transform transition-transform duration-300 z-50 lg:z-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:w-64 lg:h-full lg:shadow-none`}
        role="navigation"
        aria-label="Sidebar Navigation"
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:hidden bg-gradient-to-r from-red-600 to-red-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Categories</h2>
          </div>
          <button
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white text-nowrap">
              Menu Categories
            </h2>
          </div>
        </div>

        {/* Categories List */}
        <div className="overflow-y-auto h-[calc(100%-theme(spacing.20))] lg:h-[calc(100%-theme(spacing.28))]">
          <ul className="p-4 space-y-2">
            {categories.map((category, index) => (
              <li key={index}>
                <button
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-medium transition-all duration-300 group ${
                    selectedCategory === category.strCategory.toLowerCase()
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600 hover:scale-105"
                  }`}
                  onClick={() => handleCategoryClick(category)}
                  aria-selected={
                    selectedCategory === category.strCategory.toLowerCase()
                  }
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        selectedCategory === category.strCategory.toLowerCase()
                          ? "bg-white"
                          : "bg-red-600 group-hover:bg-red-600"
                      }`}
                    ></span>
                    <span className="font-semibold">
                      {category.strCategory}
                    </span>
                  </span>
                  {selectedCategory === category.strCategory.toLowerCase() && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
