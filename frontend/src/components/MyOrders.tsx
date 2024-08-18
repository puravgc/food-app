import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

interface CartItem {
  _id: string;
  image: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  cartItems: CartItem[];
  status: string;
  paymentStatus: string;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/getorder", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOrders(data.reverse());
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-5 bg-gray-100">
      <h1 className="text-2xl font-bold mb-5">My Orders</h1>
      <div className="overflow-y-auto h-[80vh]">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order ID: {order._id}
                  </h2>
                  <p className="text-gray-500">
                    Created At: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {order.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border-b border-gray-300"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-grow">
                      <h3 className="text-lg font-semibold">
                        {item.productName}
                      </h3>
                      <p className="text-gray-700">${item.price} each</p>
                      <p className="text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex items-center sm:ml-auto">
                      <p className="font-bold text-lg text-gray-800">
                        Total: ${item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-gray-600">Order Status: {order.status}</p>
                <p className="text-gray-600">
                  Payment Status: {order.paymentStatus}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
