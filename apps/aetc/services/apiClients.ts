import axios from "axios";
import { getCookie } from "cookies-next";

export const formBuilderApiClient = axios.create({
  baseURL: "http://localhost:9001/api/v1",
  headers: {},
});
export const emrApiClient = () => {
  const token = localStorage.getItem("accessToken");
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};