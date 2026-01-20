import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../api/orderApi";
import { clearCart } from "../redux/cartSlice";
import Nav from "../components/Nav";

const PlaceOrder = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const deliveryFee = 40;
  const gst = Math.round(itemsTotal * 0.05);
  const platformFee = 5;
  const grandTotal = itemsTotal + deliveryFee + gst + platformFee;

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }

    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    const orderData = {
      delivery_address: address,
      special_instructions: note,
      items: cartItems.map((item) => ({
        id: item.id,
        qty: item.qty,
        variation_id: item.variationId || null,
      })),
    };

    try {
      setLoading(true);
      await createOrder(orderData);
      dispatch(clearCart());
      alert("Order placed successfully 🎉");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Order failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />

      <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="md:col-span-2 space-y-4">
          {/* Address */}
          <div className="border rounded-xl p-4">
            <h2 className="font-semibold mb-2">Delivery Address</h2>
            <textarea
              className="w-full border p-2 rounded"
              rows="3"
              placeholder="House no, street, area, city"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Instructions */}
          <div className="border rounded-xl p-4">
            <h2 className="font-semibold mb-2">Special Instructions</h2>
            <textarea
              className="w-full border p-2 rounded"
              rows="2"
              placeholder="Less spicy, no onion, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Cart Items */}
          <div className="border rounded-xl p-4">
            <h2 className="font-semibold mb-3">Your Items</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b py-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.qty}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{item.price * item.qty}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SECTION – BILL */}
        <div className="border rounded-xl p-4 h-fit">
          <h2 className="font-semibold mb-3">Bill Details</h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Items total</span>
            <span>₹{itemsTotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Delivery fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>GST</span>
            <span>₹{gst}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Platform fee</span>
            <span>₹{platformFee}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
