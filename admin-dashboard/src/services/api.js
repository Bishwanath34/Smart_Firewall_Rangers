import axios from "axios";

const GATEWAY_URL = "http://localhost:4000";

export const getLogs = () => axios.get(`${GATEWAY_URL}/admin/logs`);
export const getTrafficData = () => axios.get(`${GATEWAY_URL}/admin/traffic-data`);
export const getChainStatus = () => axios.get(`${GATEWAY_URL}/verify-chain`);

export const simulateTraffic = ({ path, userId, role }) =>
  axios.get(`${GATEWAY_URL}/fw${path}`, {
    headers: {
      "x-user-id": userId,
      "x-user-role": role
    },
    validateStatus: () => true
  });
