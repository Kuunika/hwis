import { getTestTypes, getSpecimenTypes, getLabReason, createLabOrder, getPatientLabTests } from "@/services/labService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const getLabTestTypes = (name?: string) => {
    const findAll = async () => {
        return getTestTypes(name).then(response => response.data)
    };

    return useQuery({
        queryKey: ["testTypes", name],
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

export const getPatientLabOrder = (patientId: string) => {
    const findAll = async () => {
        return getPatientLabTests(patientId).then(response => response.data)
    };
    return useQuery({
        queryKey: ["patientsOrder", patientId],
        queryFn: findAll,
        enabled: true,
    });
};

export const createOrder = (id?: string) => {
    const queryClient = useQueryClient()

    const addData = (patientData: any) => {
        return createLabOrder(patientData).then((response) => {
            return response.data;
        });
    };
    return useMutation({
        mutationFn: addData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patientsOrder"] })
        }
    });
};