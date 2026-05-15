import axios from "axios";

export const createOrder = (amount) =>
  axios.post("http://127.0.0.1:8000/api/payments/create-order/", {
    amount,
  });

export const verifyPayment = (data) =>
  axios.post("http://127.0.0.1:8000/api/payments/verify/", data);