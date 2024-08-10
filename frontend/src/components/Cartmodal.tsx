import { Button, Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";
import { categoryContext } from "../context/categoryContext";
import { toast } from "react-hot-toast";

export default function CartModal({
  cartModal,
  setcartModal,
  name,
  image,
  price,
}) {
  const [quantity, setQuantity] = useState(1);
  const { totalCartItems, settotalCartItems } = useContext(categoryContext);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  const cartHandler = async () => {
    const response = await fetch("http://localhost:5000/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ productName: name, price, quantity, image }),
    });
    const data = await response.json();
    if (data.success === false) {
      toast.error(data.message);
      setcartModal(false);
      return;
    }
    toast.success(data.message);
    setcartModal(false);
    settotalCartItems((prevItems) => prevItems + quantity);
  };

  return (
    <Transition appear show={cartModal} as={Fragment}>
      <Dialog
        open={cartModal}
        as="div"
        className="relative z-10"
        onClose={() => setcartModal(false)}
      >
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-gray-500 bg-opacity-75">
          <Dialog.Panel className="relative w-full max-w-lg p-6 bg-white rounded-xl shadow-xl">
            <div className="w-full flex justify-end mb-2">
            <button
              className=" text-black hover:text-gray-600 focus:outline-none"
              onClick={() => setcartModal(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            </div>
            <img
              src={image}
              alt={name}
              className="w-full h-64 object-cover rounded"
            />
            <Dialog.Title
              as="h3"
              className="mt-4 text-2xl font-medium leading-6 text-gray-900"
            >
              {name}
            </Dialog.Title>
            <div className="mt-2 text-lg text-gray-500">
              <div className="flex items-center mt-4">
                <Button
                  className="px-3 py-1 text-lg font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={decreaseQuantity}
                >
                  -
                </Button>
                <p className="mx-4">{quantity}</p>
                <Button
                  className="px-3 py-1 text-lg font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={increaseQuantity}
                >
                  +
                </Button>
              </div>
              <p>Price: ${price * quantity}</p>
            </div>
            <div className="mt-4">
              <Button
                className="inline-flex items-center px-5 py-2 text-lg font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => {
                  cartHandler();
                }}
              >
                Add to Cart
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
