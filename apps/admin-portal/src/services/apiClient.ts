import axios from "axios";

// console.log(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  headers: {},
});
