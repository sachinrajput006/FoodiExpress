import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaMotorcycle, FaClock, FaRoute } from 'react-icons/fa';

const LiveDeliveryAnimation = ({ deliveryStatus }) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const deliveryPerson = {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.8
  };

  // Simulate delivery progress
  useEffect(() => {
    if (deliveryStatus === 'out_for_delivery') {
      const interval = setInterval(() => {
        setCurrentPosition(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 3; // Random progress between 0-3%
        });

        setEstimatedTime(prev => Math.max(0, prev - Math.floor(Math.random() * 2)));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [deliveryStatus]);

  const getStatusMessage = () => {
    if (deliveryStatus === 'preparing') return "Your order is being prepared";
    if (deliveryStatus === 'ready') return "Order ready for pickup";
    if (deliveryStatus === 'out_for_delivery') return "Out for delivery";
    if (deliveryStatus === 'delivered') return "Delivered successfully";
    return "Order placed";
  };

  const getProgressColor = () => {
    if (currentPosition < 30) return 'bg-yellow-500';
    if (currentPosition < 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FaRoute className="text-blue-500" />
          Live Delivery Tracking
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <FaClock />
          {estimatedTime} min remaining
        </div>
      </div>

      {/* Status Message */}
      <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200 font-medium">
          {getStatusMessage()}
        </p>
      </div>

      {/* Delivery Person Info */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <FaMotorcycle className="text-white text-lg" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 dark:text-white">
            {deliveryPerson.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {deliveryPerson.phone}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {deliveryPerson.rating} rating
            </span>
          </div>
        </div>
        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors">
          Call
        </button>
      </div>

      {/* Progress Animation */}
      <div className="relative">
        {/* Route Path */}
        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mb-4">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${getProgressColor()}`}
            style={{ width: `${currentPosition}%` }}
          />
        </div>

        {/* Delivery Points */}
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-2">
          <span>Restaurant</span>
          <span>Your Location</span>
        </div>

        {/* Animated Delivery Icon */}
        <div
          className="absolute top-0 transform -translate-y-1/2 transition-all duration-1000"
          style={{ left: `${currentPosition}%` }}
        >
          <div className="relative">
            <FaMotorcycle className="text-2xl text-green-500 animate-bounce" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
        </div>

        {/* Location Markers */}
        <div className="absolute top-0 left-0 transform -translate-y-1/2">
          <FaMapMarkerAlt className="text-red-500 text-lg" />
        </div>
        <div className="absolute top-0 right-0 transform -translate-y-1/2">
          <FaMapMarkerAlt className="text-blue-500 text-lg" />
        </div>
      </div>

      {/* Progress Text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Delivery Progress: {Math.round(currentPosition)}%
        </p>
      </div>

      {/* Additional Info */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="font-semibold text-gray-800 dark:text-white">Distance</div>
          <div className="text-gray-600 dark:text-gray-300">2.3 km</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="font-semibold text-gray-800 dark:text-white">ETA</div>
          <div className="text-gray-600 dark:text-gray-300">{estimatedTime} min</div>
        </div>
      </div>
    </div>
  );
};

export default LiveDeliveryAnimation;
