import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetail, cancelOrder, updateOrderStatus } from "../api/orderApi";
import Nav from "../components/Nav";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import StarRating from "../components/StarRating";
import LiveDeliveryAnimation from "../components/LiveDeliveryAnimation";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await getOrderDetail(id);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(id);
        setOrder({ ...order, status: 'cancelled' });
        toast.success('Order cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // Here you could call an API to submit the rating
    toast.success('Rating submitted successfully');
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Nav />
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Order Details</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleString()}</p>
                <p className="text-gray-600">Status: <span className="capitalize font-semibold">{order.status}</span></p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">₹{order.total_amount}</p>
                <p className="text-sm text-gray-500">{order.items.length} items</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
              <p className="text-gray-700">{order.delivery_address || 'Not provided'}</p>
            </div>

            {order.special_instructions && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Special Instructions</h3>
                <p className="text-gray-700">{order.special_instructions}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.menu.name}</h4>
                      {item.variation && (
                        <p className="text-sm text-gray-600">{item.variation.name}</p>
                      )}
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.total_price}</p>
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="mb-6">
                <button
                  onClick={handleCancelOrder}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Rate Your Order</h3>
                <StarRating
                  rating={rating}
                  onRatingChange={handleRatingChange}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <OrderStatusTimeline status={order.status} />
          </div>

          {(order.status === 'ready' || order.status === 'delivered') && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <LiveDeliveryAnimation />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
