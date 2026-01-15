import React, { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../api/orderApi";
import { Link } from "react-router-dom";
import { FaEye, FaClock, FaCheckCircle, FaShippingFast, FaUtensils, FaTimesCircle, FaSync } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAdminOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'confirmed': return <FaCheckCircle className="text-blue-500" />;
      case 'preparing': return <FaUtensils className="text-orange-500" />;
      case 'ready': return <FaShippingFast className="text-green-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-600" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Orders</h1>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">{order.user}</p>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold">Total: ₹{order.total_amount}</p>
              <p className="text-sm text-gray-600">Items: {order.items.length}</p>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to={`/admin/orders/${order.id}`}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <FaEye />
                <span>View Details</span>
              </Link>

              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'preparing')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'ready')}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'delivered')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
