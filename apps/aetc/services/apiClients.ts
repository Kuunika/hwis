
'use client'
import axios from "axios";
import { Bounce, toast } from "react-toastify";

export const formBuilderApiClient = axios.create({
  baseURL: "http://localhost:9001/api/v1",
  headers: {},
});
export const emrApiClient = () => {
  const token = localStorage.getItem("accessToken");
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
      // Refresh token logic here or redirect to login



      if (window) {
        toast.error('Your session has expired, please login in again.', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        })
        setTimeout(() => {
          window.location.replace('/');
          localStorage.clear()
        }, 5000)

      }

      // redirect to login or use refresh token logic
    }
    return Promise.reject(error);
  })

  return api
};