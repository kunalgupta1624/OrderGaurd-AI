import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000
});

// Dashboard API
export const getDashboardSummary = async () => {
    const response = await api.get("/api/dashboard/summary");
    return response.data;
};

// Order evaluation API
export const evaluateOrder = async (orderData) => {
    const response = await api.post("/api/orders/evaluate", orderData);
    return response.data;
};

// Order history API
export const getOrderHistory = async () => {
    const response = await api.get("/api/orders/");
    return response.data;
};

export const getThresholds = async () => {
  const response = await api.get("/api/settings/thresholds");
  return response.data;
};

export const updateThresholds = async (settings) => {
  const response = await api.put("/api/settings/thresholds", settings);
  return response.data;
};
export default api;