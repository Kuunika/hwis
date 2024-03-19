import { getTestTypes, getSpecimenTypes, getLabReason } from "@/services/labService";
import { useQuery } from "@tanstack/react-query";


export const getLabTestTypes = () => {
    const findAll = async () => {
        return getTestTypes().then(response => response.data)
    };

    return useQuery({
        queryKey: ["testTypes"],
        queryFn: findAll,
        enabled: true,

    });
};

export const getLabSpecimenTypes = () => {
    const findAll = async () => {
        return getSpecimenTypes().then(response => response.data)
    };

    return useQuery({
        queryKey: ["getSpecimenTypes"],
        queryFn: findAll,
        enabled: true,

    });
};

export const getLabTestReason = () => {
    const findAll = async () => {
        return getLabReason().then(response => response.data)
    };
    return useQuery({
        queryKey: ["getLabTestReasons"],
        queryFn: findAll,
        enabled: true,

    });
};
