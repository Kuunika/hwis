import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:9000/api/v1",
  baseURL: "http://localhost:3000",
  headers: {},
});
