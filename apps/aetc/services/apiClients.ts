import axios from "axios";
import { getCookie } from "cookies-next";

export const formBuilderApiClient = axios.create({
  baseURL: "http://localhost:9001/api/v1",
  headers: {},
});
export const emrApiClient = () => {
  const token = localStorage.getItem("accessToken");

  return axios.create({
    // baseURL: "http://192.168.28.3:3000/api/v1",
    baseURL: "http://18.218.225.103:3001/api/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
