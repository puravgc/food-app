import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button, CircularProgress } from "@mui/material";

interface OrderItem {
  _id: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  user: {
    address: string;
    username: string;
    phoneNumber: string;
  };
  cartItems: OrderItem[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

const OrderStatus = {
  PENDING: "pending",
  PREPARING: "preparing",
  OUT_FOR_DELIVERY: "out-for-delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const Orders: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const socketConnection = io("http://localhost:5000");
    setSocket(socketConnection);

    socketConnection.on("cartdetails", () => {
      toast.success("NEW ORDER!!");
      getOrders();
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const previousStatus = status[orderId];
    setStatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));

    try {
      const response = await fetch(
        `http://localhost:5000/orderstatus/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Order status updated!");
      } else {
        toast.error("Failed to update order status");
        setStatus((prev) => ({
          ...prev,
          [orderId]: previousStatus,
        }));
      }
    } catch (error) {
      toast.error("Error updating status");
      setStatus((prev) => ({
        ...prev,
        [orderId]: previousStatus,
      }));
      console.error("Error updating status:", error.message);
    }
  };

  const getOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/getadminorder");
      const data: Order[] = await response.json();
      setOrders(data || []);
      const statusMap = data.reduce((acc: Record<string, string>, order) => {
        acc[order._id] = order.status;
        return acc;
      }, {});
      setStatus(statusMap);
      console.log(data)
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Failed to fetch orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/deleteorder/${orderId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Order deleted successfully");
        getOrders();
      } else {
        toast.error("Failed to delete order");
        console.error("Failed to delete order:", result.message);
      }
    } catch (error) {
      toast.error("Failed to delete order");
      console.error("Failed to delete order:", error.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="p-6 mt-20">
      <h2 className="text-2xl font-semibold mb-4">Orders List</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 p-4 bg-white  h-[550px] overflow-y-auto"
              >
                <div className="w-full flex justify-between">
                  <h3 className="text-xl font-semibold mb-2">
                    Order ID: {order._id}
                  </h3>
                  <RxCross2
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => handleDeleteOrder(order._id)}
                  />
                </div>
                <p className="mb-2">Address: {order.user.address}</p>
                <p className="mb-2">Username: {order.user.username}</p>
                <p className="mb-2">Phone Number: {order.user.phoneNumber}</p>
                <div className="space-y-2">
                  {order.cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-200 rounded-md p-2 bg-gray-50"
                    >
                      <p className="font-semibold">{item.productName}</p>
                      <p>Price: ${item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 object-cover mt-2"
                      />
                    </div>
                  ))}
                  <div>
                    <h1>TOTAL : ${order.totalPrice}</h1>
                  </div>
                </div>
                <div className="flex justify-start items-center gap-5">
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id={`status-select-label-${order._id}`}>
                      Order Status
                    </InputLabel>
                    <Select
                      labelId={`status-select-label-${order._id}`}
                      id={`status-select-${order._id}`}
                      value={status[order._id] || ""}
                      onChange={(e: SelectChangeEvent<string>) => {
                        const newStatus = e.target.value;
                        handleStatusChange(order._id, newStatus);
                      }}
                      label="Order Status"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
                      <MenuItem value={OrderStatus.PREPARING}>
                        Preparing
                      </MenuItem>
                      <MenuItem value={OrderStatus.OUT_FOR_DELIVERY}>
                        Out for Delivery
                      </MenuItem>
                      <MenuItem value={OrderStatus.DELIVERED}>
                        Delivered
                      </MenuItem>
                      <MenuItem value={OrderStatus.CANCELLED}>
                        Cancelled
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <p>Payment Status: {order.paymentStatus}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No orders available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
