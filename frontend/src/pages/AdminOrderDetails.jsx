import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetail, updateOrderStatus } from "../api/orderApi";

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderDetail(id).then((res) => setOrder(res.data));
  }, [id]);

  const handleChange = async (e) => {
    await updateOrderStatus(id, e.target.value);
    setOrder({ ...order, status: e.target.value });
  };

  if (!order) return null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Order #{order.id}</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Update Order Status
        </label>
        <select
          value={order.status}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
