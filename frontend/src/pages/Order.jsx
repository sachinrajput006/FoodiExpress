import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.jsx";
import { dataContext } from "../context/context";
import Nav from "../components/Nav.jsx";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(dataContext);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders/");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading orders...</div>;
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-300">Track and manage your food orders</p>
        </div>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border p-4 rounded-lg shadow bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">
                    Order #{order.id}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600">
                  Total: ${order.total_amount}
                </p>
                <p className="text-gray-600">
                  Date: {new Date(order.created_at).toLocaleDateString()}
                </p>
                {order.delivery_address && (
                  <p className="text-gray-600">
                    Address: {order.delivery_address}
                  </p>
                )}

                <div className="mt-2">
                  <h3 className="font-semibold">Items:</h3>
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity} × {item.menu.name} – ${item.price} each{" "}
                        {item.variation && `(${item.variation.name})`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Order;
