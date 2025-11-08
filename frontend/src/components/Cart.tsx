import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-hot-toast";
import { categoryContext } from "../context/categoryContext";
import { GrSubtract, GrAdd } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import PaymentOptions from "./PaymentOptions";
import CheckoutModal from "./CheckoutModal";
import { AiOutlineLoading } from "react-icons/ai";
import { FiShoppingCart, FiMapPin } from "react-icons/fi";
import { MdLocalOffer } from "react-icons/md";

interface CartItems {
  _id: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const socket = io("http://localhost:5000/");
  const navigate = useNavigate();
  const [loading, setloading] = useState<boolean>(false);
  const [cartItems, setcartItems] = useState<CartItems[]>([]);
  const [totalPrice, settotalPrice] = useState<number>(0);
  const [promo, setpromo] = useState<string>("");
  const [paymentOption, setpaymentOption] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [location, setlocation] = useState<string>("");
  const { totalCartItems, settotalCartItems } =
    useContext(categoryContext) || {};

  const fetchCartItems = async () => {
    setloading(true);
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
        setloading(false);
      } else {
        toast.error(data.message);
        navigate("/login");
        setloading(false);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
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
      removeAllCartItems();
      const data = await postOrder();
      esewaIntegration(data);
      if (settotalCartItems) {
        settotalCartItems(0);
      }
      return;
    }
    removeAllCartItems();
    postOrder();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <FiShoppingCart className="w-8 h-8 text-red-600" />
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Shopping Cart
                  </h2>
                </div>
                <div className="bg-red-50 px-4 py-2 rounded-full">
                  <span className="text-red-600 font-semibold">
                    {totalCartItems} Items
                  </span>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <AiOutlineLoading className="animate-spin h-12 w-12 text-red-500 mb-4" />
                    <p className="text-gray-500">Loading your cart...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <FiShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
                    <p className="text-xl text-gray-500 mb-2">
                      Your cart is empty
                    </p>
                    <p className="text-gray-400">
                      Add some delicious items to get started!
                    </p>
                  </div>
                ) : (
                  cartItems.map((cartItem) => (
                    <div
                      key={cartItem._id}
                      className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                    >
                      <button
                        onClick={() => deleteCart(cartItem._id)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200 z-10"
                      >
                        <IoIosClose className="h-6 w-6" />
                      </button>

                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={cartItem.image}
                            alt={cartItem.productName}
                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-sm"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {cartItem.productName}
                            </h3>
                            <p className="text-xl font-bold text-red-600">
                              ${cartItem.price}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
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
                                className="px-3 py-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                              >
                                <GrSubtract className="text-gray-700" />
                              </button>
                              <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                                {cartItem.quantity}
                              </span>
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
                                className="px-3 py-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                              >
                                <GrAdd className="text-gray-700" />
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="min-w-[80px] text-right">
                              <p className="text-xl font-bold text-gray-900">
                                $
                                {(cartItem.quantity * cartItem.price).toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
                Order Summary
              </h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MdLocalOffer className="text-red-600" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => setpromo(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter code..."
                  />
                  <button
                    onClick={handlePromo}
                    className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <FiMapPin className="text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </p>
                    <p className="text-gray-900 font-medium">
                      {location || "No address set"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-sm text-red-600 hover:text-red-700 font-medium underline"
                >
                  Change address in profile
                </button>
              </div>

              {/* Payment Options */}
              <div className="mb-6">
                <PaymentOptions
                  paymentOption={paymentOption}
                  setpaymentOption={setpaymentOption}
                />
              </div>

              {/* Order Total */}
              <div className="space-y-3 mb-6 pt-4 border-t-2 border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalCartItems} items)</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-red-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCheckout}
        totalPrice={totalPrice}
        itemCount={totalCartItems || 0}
        paymentOption={paymentOption}
      />
    </div>
  );
};

export default Cart;
