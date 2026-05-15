import { createOrder, verifyPayment } from "../api/paymentApi";

const RazorpayButton = ({ amount }) => {
  const handlePayment = async () => {
    const { data } = await createOrder(amount);

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      order_id: data.order_id,
      name: "Food Delivery",
      handler: async function (response) {
        await verifyPayment({
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
        alert("Payment Successful 🎉");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay ₹{amount / 100}</button>;
};

export default RazorpayButton;