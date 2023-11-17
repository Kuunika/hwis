import axios from "axios";

export const formBuilderApiClient = axios.create({
  // baseURL: "http://localhost:9000/api/v1",
  baseURL: "http://localhost:9001/api/v1",
  headers: {},
});
export const emrApiClient = axios.create({
  // baseURL: "http://localhost:9000/api/v1",
  baseURL: "http://localhost:4005",
  headers: {},
});
