import { useQuery } from "@tanstack/react-query";
import axios from 'axios'


export const getVillages = () => {
    const getall = () => axios.get("/constants/villages.json").then(response => response.data)

    return useQuery({
        queryKey: ["villages"],
        queryFn: getall,
        enabled: true,
    });
};

export const getTraditionalAuthorities = () => {
    const getall = () => axios.get("/constants/traditional_authorities.json").then(response => response.data)
    return useQuery({
        queryKey: ["traditional_authorities"],
        queryFn: getall,
        enabled: true,
    });
};

export const getDistricts = () => {
    const getall = () => axios.get("/constants/districts.json").then(response => response.data)
    return useQuery({
        queryKey: ["districts"],
        queryFn: getall,
        enabled: true,
    });
};
