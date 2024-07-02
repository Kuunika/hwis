import { authenticate } from "@/services/loginService";
import { useMutation } from "@tanstack/react-query";

export const Login = () => {
  const addData = (credentials: any) => {
    return authenticate(credentials).then((response) => response);
  };

  return useMutation({
    mutationFn: addData,
  });
};
