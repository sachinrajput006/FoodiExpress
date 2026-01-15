import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../api/orderApi";
import { clearCart } from "../redux/cartSlice";
import Nav from "../components/Nav";

const PlaceOrder = () => {
  const cartItems = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Cart is empty");
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
      await createOrder(orderData);
      dispatch(clearCart());
      alert("Order placed successfully 🎉");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Order failed ❌");
    }
  };

  return (
    <>
      <Nav />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Place Order</h1>

        <textarea
          className="w-full border p-2 mb-3 rounded"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-3 rounded"
          placeholder="Special instructions (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          onClick={handlePlaceOrder}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Confirm Order
        </button>
      </div>
    </>
  );
};

export default PlaceOrder;
