import React from "react";

const steps = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "delivered", label: "Delivered" },
];

const OrderStatusTimeline = ({ status }) => {
  // If order is cancelled, stop timeline
  const isCancelled = status === "cancelled";

  const currentIndex = isCancelled
    ? -1
    : steps.findIndex((step) => step.key === status);

  return (
    <div className="mt-6">
      {/* CANCELLED MESSAGE */}
      {isCancelled && (
        <div className="mb-4 text-center text-red-600 font-semibold">
          ❌ Order Cancelled
        </div>
      )}

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex-1 text-center relative">
            <div
              className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300
                ${
                  isCancelled
                    ? "bg-gray-400 dark:bg-gray-600"
                    : index <= currentIndex
                    ? "bg-green-500 shadow-green-200"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
            >
              {index + 1}
            </div>

            <p
              className={`mt-3 text-sm font-medium
                ${
                  isCancelled
                    ? "text-gray-500 dark:text-gray-400"
                    : index <= currentIndex
                    ? "text-green-600 dark:text-green-400 font-semibold"
                    : "text-gray-500 dark:text-gray-400"
                }`}
            >
              {step.label}
            </p>

            {index < steps.length - 1 && (
              <div
                className={`absolute top-6 left-1/2 transform translate-x-1/2 h-1 w-full max-w-[100px] transition-all duration-300
                  ${
                    isCancelled
                      ? "bg-gray-300 dark:bg-gray-600"
                      : index < currentIndex
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                style={{ zIndex: -1 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
