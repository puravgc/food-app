import React, { useState, useEffect, useContext } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { GoPerson } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { userContext } from "../context/userContext";
import Cookies from "js-cookie";
import { categoryContext } from "../context/categoryContext";
import logo from "/logo.png";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, setisLoggedIn } = useContext(userContext);
  const { totalCartItems, settotalCartItems } = useContext(categoryContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/getcart", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success === true) {
        data.cartItems.forEach((item) => {
          settotalCartItems((prevState) => prevState + item.quantity);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setisLoggedIn(true);
    } else {
      setisLoggedIn(false);
    }
  }, [isLoggedIn]);

  return (
    <div className="w-full">
      <header>
        <nav
          className="flex items-center justify-between pt-1 pb-1 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <button
              className="-m-1.5 p-1.5"
              onClick={() => {
                navigate("/");
              }}
            >
              <div className="items-center flex flex-col">
                <p className="text-[20px] font-bold ">
                  <img src={logo} alt="" className="h-20" />
                </p>
              </div>
            </button>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {isLoggedIn ? (
              <div className="flex justify-center items-center gap-20">
                <div
                  className="relative cursor-pointer"
                  onClick={() => {
                    navigate("/cart");
                  }}
                >
                  <IoCartOutline className="h-8 w-8 text-black-600" />
                  <div className="absolute -top-4 -right-2 bg-red-500 min-h-5 min-w-5 flex justify-center items-center rounded-full">
                    <p className="text-white text-sm">{totalCartItems}</p>
                  </div>
                </div>

                <div
                  className="relative cursor-pointer"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  <GoPerson className="h-8 w-8 text-black-600" />
                </div>
                <div
                  onClick={() => {
                    navigate("/myorders");
                  }}
                  className="cursor-pointer"
                >
                  <p className="text-black font-bold text-sm">My Orders</p>
                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setisLoggedIn(false);
                    navigate("/");
                  }}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Logout <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </nav>
        <Dialog
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <div className="items-center flex flex-col">
                  <p className="text-[20px] font-bold ">
                    <img src={logo} alt="" className="h-20" />
                  </p>
                </div>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="">
                <div className="space-y-2 py-6">
                  {isLoggedIn ? (
                    <>
                      <div
                        className="flex gap-4 items-center"
                        onClick={() => {
                          navigate("/cart");
                        }}
                      >
                        <button className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          My Cart
                        </button>
                        <div className="bg-red-500 flex justify-center items-center rounded-full h-5 w-5">
                          <p className="text-white text-sm">{totalCartItems}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/profile");
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate("/myorders");
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          setisLoggedIn(false);
                          navigate("/");
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Logout <span aria-hidden="true">&rarr;</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/login");
                      }}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Log in <span aria-hidden="true">&rarr;</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
};

export default Navbar;
