import axios from "axios";

export const formBuilderApiClient = axios.create({
  // baseURL: "http://localhost:9000/api/v1",
  baseURL: "http://localhost:3000",
  headers: {},
});
