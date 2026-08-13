import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default AxiosInstance;
