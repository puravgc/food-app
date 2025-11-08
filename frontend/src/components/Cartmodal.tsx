import { Button, Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { categoryContext } from "../context/categoryContext";
import { toast } from "react-hot-toast";
import Loader from "./Loader";

interface CartModalProps {
  cartModal: boolean;
  setcartModal: (open: boolean) => void;
  name: string;
  image: string;
  price: number;
  id: string;
}

interface MealDetails {
  strCategory?: string;
  strArea?: string;
  strTags?: string;
  strYoutube?: string;
}

const CartModal: React.FC<CartModalProps> = ({
  cartModal,
  setcartModal,
  name,
  image,
  price,
  id,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setloading] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [mealDetails, setMealDetails] = useState<MealDetails | null>(null);
  const context = useContext(categoryContext);

  const fetchDetails = async () => {
    setDetailsLoading(true);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      if (data.meals && data.meals[0]) {
        setMealDetails({
          strCategory: data.meals[0].strCategory,
          strArea: data.meals[0].strArea,
          strTags: data.meals[0].strTags,
          strYoutube: data.meals[0].strYoutube,
        });
      }
    } catch (error) {
      console.error("Failed to fetch meal details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (cartModal === true) {
      fetchDetails();
    }
  }, [cartModal]);

  if (!context) {
    throw new Error("CartModal must be used within a CategoryContextProvider");
  }

  const { settotalCartItems } = context;

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const cartHandler = async () => {
    setloading(true);
    try {
      const response = await fetch(
        "https://food-app-backend-topaz.vercel.app/addtocart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ productName: name, price, quantity, image }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        setcartModal(false);
        setloading(false);
        return;
      }
      toast.success(data.message);
      setcartModal(false);
      settotalCartItems((prevItems: number) => prevItems + quantity);
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.");
      console.error("Failed to add item to cart:", error);
      setloading(false);
    }
  };

  const tags = mealDetails?.strTags?.split(",") || [];

  return (
    <Transition appear show={cartModal} as={Fragment}>
      <Dialog
        open={cartModal}
        as="div"
        className="relative z-10"
        onClose={() => setcartModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-2xl bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-20 text-white bg-red-600 hover:bg-red-700 rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => setcartModal(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image Section */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Price Badge */}
                <div className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-xl shadow-lg">
                  ${price}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  {name}
                </Dialog.Title>

                {/* Meal Details */}
                {detailsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div
                      role="status"
                      className="flex flex-col items-center gap-2"
                    >
                      <Loader />
                      <span className="text-sm text-gray-500">
                        Loading meal details...
                      </span>
                    </div>
                  </div>
                ) : mealDetails ? (
                  <div className="mb-6 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {mealDetails.strCategory && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path
                              fillRule="evenodd"
                              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {mealDetails.strCategory}
                        </span>
                      )}
                      {mealDetails.strArea && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {mealDetails.strArea}
                        </span>
                      )}
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Divider */}
                <div className="border-t border-red-200 my-6" />

                {/* Quantity Selector */}
                <div className="mb-6 w-4/12">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <Button
                      className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={decreaseQuantity}
                    >
                      −
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {quantity}
                      </span>
                    </div>
                    <Button
                      className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={increaseQuantity}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">
                      Total Price:
                    </span>
                    <span className="text-3xl font-bold text-red-600">
                      ${(price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={cartHandler}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader />
                      <span className="ml-2">Adding to Cart...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CartModal;
