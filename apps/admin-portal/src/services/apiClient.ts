import axios from "axios";

console.log(process.env.BACKEND_BASE_URL);
export default axios.create({
  baseURL: "http://localhost:3000",
  headers: {},
});
