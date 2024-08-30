import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-hot-toast";
import { categoryContext } from "../context/categoryContext";
import { GrSubtract, GrAdd } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import PaymentOptions from "./PaymentOptions";
import CheckoutModal from "./CheckoutModal";

interface CartItems {
  _id: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const socket = io("https://food-app-backend-topaz.vercel.app");
  const navigate = useNavigate();
  const [cartItems, setcartItems] = useState<CartItems[]>([]);
  const [totalPrice, settotalPrice] = useState<number>(0);
  const [promo, setpromo] = useState<string>("");
  const [paymentOption, setpaymentOption] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [location, setlocation] = useState<string>("");
  const { totalCartItems, settotalCartItems } =
    useContext(categoryContext) || {};
  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/getcart",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setcartItems(data.cartItems);
        calculateTotal(data.cartItems);
      } else {
        toast.error(data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = (items: CartItems[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    settotalPrice(total);
  };

  const deleteCart = async (id: string) => {
    try {
      const response = await fetch(
        `https://food-app-backend-topaz.vercel.app/removefromcart/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (settotalCartItems) {
        settotalCartItems((prev) => prev - (data.quantity || 0));
      }
      fetchCartItems();
      calculateTotal(cartItems);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      await fetch(
        `https://food-app-backend-topaz.vercel.app/updatecart/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      fetchCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/getuser",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setlocation(data.address);
      return data.promoCode;
    } catch (error) {
      console.log(error);
    }
  };

  const postOrder = async () => {
    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/postorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ cartItems, totalPrice }),
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Order placed successfully!");
        setcartItems([]);
        settotalPrice(0);
        setpromo("");
        setpaymentOption("");
        socket.emit("checkoutcart", { cartItems, paymentOption });
        return data.newOrder._id;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkoutHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Please add at least one item to the cart");
      return;
    }

    if (paymentOption === "") {
      toast.error("Please select a payment option");
      return;
    }

    setIsModalOpen(true);
  };

  const esewaIntegration = async (orderId: string) => {
    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/createesewaorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ totalPrice, orderId: orderId }),
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.formData);
        esewaCall(responseData.formData);
      } else {
        console.error("Failed to fetch:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  const esewaCall = (formData: any) => {
    var path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for (var key in formData) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", formData[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };

  const handleConfirmCheckout = async () => {
    setIsModalOpen(false);
    if (paymentOption === "eSewa Payment") {
      const data = await postOrder();
      esewaIntegration(data);
      removeAllCartItems();
      if (settotalCartItems) {
        settotalCartItems(0);
      }
      return;
    }
    postOrder();
    removeAllCartItems();
    if (settotalCartItems) {
      settotalCartItems(0);
    }
    navigate("/myorders");
  };

  const removeAllCartItems = async () => {
    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/removeallcart",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const usedPromoCode = await getUserData();
    if (usedPromoCode) {
      toast.error("You have already used a promo code");
      return;
    } else {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/addoffer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            code: promo,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setpromo("");
        settotalPrice(
          (prev) => prev - (data.existingPromo.discount / 100) * prev
        );
      } else {
        toast.error(data.message);
      }
    }
  };

  useEffect(() => {
    fetchCartItems();
    getUserData();
  }, []);

  return (
    <div className="h-screen w-screen overflow-y-auto">
      <section className="relative z-10 after:contents-[''] after:absolute after:z-0 after:h-full xl:after:w-1/3 after:top-0 after:right-0 after:bg-gray-50">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto relative z-10">
          <div className="grid grid-cols-12">
            <div className="col-span-12 xl:col-span-8 lg:pr-8 pt-14 pb-8 lg:py-24 w-full max-xl:max-w-3xl max-xl:mx-auto">
              <div className="flex items-center justify-between pb-8 border-b border-gray-300">
                <h2 className="font-manrope font-bold text-3xl leading-10 text-black">
                  Shopping Cart
                </h2>
                <h2 className="font-manrope font-bold text-xl leading-8 text-gray-600">
                  {totalCartItems} Items
                </h2>
              </div>
              <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
                <div className="col-span-12 md:col-span-7">
                  <p className="font-normal text-lg leading-8 text-gray-400">
                    Product Details
                  </p>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <div className="grid grid-cols-5">
                    <div className="col-span-3">
                      <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                        Quantity
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                        Total
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto p-5">
                {cartItems.map((cartItem) => (
                  <div
                    key={cartItem._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-5 py-6 border-b border-gray-200 group relative"
                  >
                    <div
                      className="absolute right-0 top-0 cursor-pointer"
                      onClick={() => deleteCart(cartItem._id)}
                    >
                      <IoIosClose className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                    <div className="w-full sm:w-[126px]">
                      <img
                        src={cartItem.image}
                        alt="food image"
                        className="mx-auto rounded-2xl w-24 h-24 sm:w-[126px] sm:h-[126px] object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 w-full">
                      <div className="sm:col-span-2">
                        <div className="flex flex-col items-center sm:items-start gap-3">
                          <h6 className="font-semibold text-sm sm:text-base leading-6 sm:leading-7 text-black">
                            {cartItem.productName}
                          </h6>
                          <h6 className="font-medium text-sm sm:text-base leading-6 sm:leading-7 text-gray-600 transition-all duration-300 group-hover:text-red-600">
                            ${cartItem.price}
                          </h6>
                        </div>
                      </div>
                      <div className="flex items-center justify-center sm:justify-center sm:justify-between h-full mt-3 sm:mt-0">
                        <div className="flex items-center h-full">
                          <button
                            onClick={() => {
                              updateQuantity(
                                cartItem._id,
                                cartItem.quantity - 1
                              );
                              if (cartItem.quantity <= 1) {
                                deleteCart(cartItem._id);
                              }
                              if (settotalCartItems) {
                                settotalCartItems((prev) => prev - 1);
                              }
                            }}
                            className="group rounded-l-xl px-4 py-2 sm:px-5 sm:py-[18px] border border-gray-200 flex items-center justify-center shadow-sm transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus:outline-none"
                          >
                            <GrSubtract className="text-sm sm:text-lg" />
                          </button>
                          <input
                            type="text"
                            className="border-y border-gray-200 outline-none text-sm sm:text-lg text-gray-900 font-semibold w-16 sm:w-full placeholder:text-gray-900 py-2 sm:py-[15px] text-center bg-transparent"
                            placeholder={`${cartItem.quantity}`}
                          />
                          <button
                            onClick={() => {
                              updateQuantity(
                                cartItem._id,
                                cartItem.quantity + 1
                              );

                              if (settotalCartItems) {
                                settotalCartItems((prev) => prev + 1);
                              }
                            }}
                            className="group rounded-r-xl px-4 py-2 sm:px-5 sm:py-[18px] border border-gray-200 flex items-center justify-center shadow-sm transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus:outline-none"
                          >
                            <GrAdd className="text-sm sm:text-lg" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-center sm:justify-end h-full mt-3 sm:mt-0">
                        <p className="font-bold text-sm sm:text-lg leading-6 sm:leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-red-600">
                          ${cartItem.quantity * cartItem.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto lg:pl-8 py-24">
              <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300">
                Order Summary
              </h2>
              <div className="mt-8">
                <div className="flex items-center justify-between pb-6">
                  <p className="font-normal text-lg leading-8 text-black">
                    {totalCartItems} Items
                  </p>
                  <p className="font-medium text-lg leading-8 text-black">
                    ${totalPrice}
                  </p>
                </div>
                <form>
                  <label className="flex  items-center mb-1.5 text-gray-600 text-lg font-medium">
                    Pick Your Location
                  </label>
                  <div className=""></div>
                  <label className="flex items-center mb-1.5 text-gray-400 text-sm font-medium">
                    Promo Code
                  </label>
                  <div className="flex pb-4 w-full">
                    <div className="relative w-full ">
                      <div className="absolute left-0 top-0 py-2.5 px-4 text-gray-300"></div>
                      <input
                        onChange={(e) => {
                          setpromo(e.target.value);
                        }}
                        type="text"
                        className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                        placeholder="Enter your code here . . ."
                      />
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-200">
                    <button
                      onClick={handlePromo}
                      className="rounded-lg w-full bg-black py-2.5 px-4 text-white text-sm font-semibold text-center transition-all duration-500 hover:bg-black/80"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="mt-2 text-gray-500">
                    <p>Delivery Address : {location}</p>
                    <p className="text-sm">
                      <span className="text-red-500">Not your address ?</span>{" "}
                      Change the address in your{" "}
                      <span
                        className="font-bold hover:underline cursor-pointer"
                        onClick={() => {
                          navigate("/profile");
                        }}
                      >
                        profile
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between py-8">
                    <p className="font-medium text-xl leading-8 text-black">
                      {totalCartItems} Items
                    </p>
                    <p className="font-semibold text-xl leading-8">
                      ${totalPrice}
                    </p>
                  </div>
                  <PaymentOptions
                    paymentOption={paymentOption}
                    setpaymentOption={setpaymentOption}
                  />
                  <button
                    onClick={checkoutHandler}
                    className="w-full text-center bg-red-600 rounded-xl py-3 px-6 font-semibold text-lg text-white transition-all duration-500 hover:bg-red-700"
                  >
                    Checkout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCheckout}
      />
    </div>
  );
};

export default Cart;
