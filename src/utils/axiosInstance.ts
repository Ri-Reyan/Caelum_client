import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "/api-proxy"
    : "http://localhost:4000";

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default AxiosInstance;
