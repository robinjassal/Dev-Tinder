import axios from "axios";

// One axios instance for the whole app.
// withCredentials: true is required because the backend logs users in
// with an httpOnly cookie (res.cookie("token", ...)) instead of a bearer token.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

export default axiosInstance;
