import api from "./axios";

// User
export const createOrder = (orderData) =>
  api.post("/orders/create/", orderData);

export const getMyOrders = () =>
  api.get("/orders/");

export const getOrderDetail = (id) =>
  api.get(`/orders/${id}/`);

export const cancelOrder = (id) =>
  api.patch(`/orders/${id}/cancel/`);

// Admin
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status/`, { status });

export const reorderOrder = (id) =>
  api.post(`/orders/${id}/reorder/`);

export const rateOrder = (id, ratingData) =>
  api.post(`/orders/${id}/rate/`, ratingData);

export const getOrderRating = (id) =>
  api.get(`/orders/${id}/rating/`);

export const downloadInvoice = (id) =>
  api.get(`/orders/${id}/invoice/`, { responseType: 'blob' });

export const getAdminOrders = () =>
  api.get("/orders/admin/");
