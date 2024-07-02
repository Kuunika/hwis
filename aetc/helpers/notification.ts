import { toast } from "react-toastify";

export const notify = (type: "success" | "info" | "error", message: string) => {
  const notify = () =>
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  notify();
};
