import { getUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query";

export const getAllUsers = () => {
    const getall = () =>
        getUsers().then((response) => response.data);

    return useQuery({
        queryKey: ["users"],
        queryFn: () => getall(),
        enabled: true,
    });
};
