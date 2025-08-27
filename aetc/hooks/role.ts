import { Role } from "@/interfaces";
import { getAll } from "@/services/httpService";

import { useQuery } from "@tanstack/react-query";

export const getRoles = () => {
    const getall = () =>
        getAll<Role[]>("/roles?paginate=false").then((response) => response.data);

    return useQuery({
        queryKey: ["roles"],
        queryFn: () => getall(),
        enabled: true,
    });
};
