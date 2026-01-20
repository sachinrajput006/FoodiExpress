import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.jsx";
import { dataContext } from "../context/context";
import Nav from "../components/Nav.jsx";

/* ---------- Order Timeline ---------- */
const STEPS = [
  "placed",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

const Timeline = ({ status }) => {
  const active = STEPS.indexOf(status);

  return (
    <div className="flex justify-between mt-4">
      {STEPS.map((step, i) => (
        <div key={step} className="flex-1 text-center">
          <div
            className={`h-2 mx-1 rounded-full ${
              i <= active ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <p className="text-xs mt-1 capitalize text-gray-600">
            {step.replaceAll("_", " ")}
          </p>
        </div>
      ))}
    </div>
  );
};

/* ---------- Main Page ---------- */
const Order = () => {
  const { user } = useContext(dataContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingData, setRatingData] = useState({});

  /* Redirect if not logged in */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  /* Fetch Orders */
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* Auto refresh every 15 sec */
  useEffect(() => {
    if (!user) return;
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [user]);

  /* Cancel Order */
  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await axios.patch(`/orders/${id}/cancel/`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || "Cancel failed");
    }
  };

  /* Reorder */
  const reorder = (order) => {
    localStorage.setItem("reorder_items", JSON.stringify(order.items));
    navigate("/cart");
  };

  /* Submit Rating */
  const submitRating = async (orderId) => {
    const data = ratingData[orderId];
    if (!data?.rating) return alert("Please select rating");

    try {
      await axios.post(`/orders/${orderId}/rate/`, data);
      alert("Thanks for your feedback ⭐");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || "Rating failed");
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="p-6">Loading orders...</div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center">
            No orders yet 🍕
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const canCancel = ["placed", "confirmed"].includes(order.status);

              const itemsTotal = order.items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              );

              const deliveryFee = order.delivery_fee ?? 40;
              const gst = order.gst ?? Math.round(itemsTotal * 0.05);
              const platformFee = order.platform_fee ?? 5;

              const grandTotal =
                itemsTotal + deliveryFee + gst + platformFee;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow border p-5"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-lg">
                        Order #{order.id}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>

                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 capitalize">
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  {/* Timeline */}
                  <Timeline status={order.status} />

                  {/* Address */}
                  {order.delivery_address && (
                    <p className="text-sm text-gray-600 mt-3">
                      📍 {order.delivery_address}
                    </p>
                  )}

                  {/* Items */}
                  <div className="mt-4 border-t pt-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm mb-1"
                      >
                        <span>
                          {item.quantity} × {item.menu.name}
                        </span>
                        <span>₹{item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bill */}
                  <div className="mt-4 border-t pt-3 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Items total</span>
                      <span>₹{itemsTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery charges</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST</span>
                      <span>₹{gst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee</span>
                      <span>₹{platformFee}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Grand Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => reorder(order)}
                      className="text-blue-600 text-sm"
                    >
                      Re-order
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="text-red-600 text-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {/* Rating */}
                  {order.status === "delivered" && !order.rating && (
                    <div className="mt-4 border-t pt-3">
                      <h3 className="font-medium mb-2">
                        Rate your order
                      </h3>

                      <select
                        className="border p-2 mr-2 rounded"
                        onChange={(e) =>
                          setRatingData({
                            ...ratingData,
                            [order.id]: {
                              ...ratingData[order.id],
                              rating: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">⭐ Rating</option>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>
                            {r} ⭐
                          </option>
                        ))}
                      </select>

                      <input
                        className="border p-2 mr-2 rounded"
                        placeholder="Write review (optional)"
                        onChange={(e) =>
                          setRatingData({
                            ...ratingData,
                            [order.id]: {
                              ...ratingData[order.id],
                              review: e.target.value,
                            },
                          })
                        }
                      />

                      <button
                        onClick={() => submitRating(order.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Order;
