import { District, TraditionalAuthority, Village } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios'


export const getVillages = () => {
    const getall = () => axios.get<Village[]>("/constants/villages.json").then(response => response.data)

    return useQuery({
        queryKey: ["villages"],
        queryFn: getall,
        enabled: true,
        staleTime: Infinity
    });
};

export const getTraditionalAuthorities = () => {
    const getall = () => axios.get<TraditionalAuthority[]>("/constants/traditional_authorities.json").then(response => response.data)
    return useQuery({
        queryKey: ["traditional_authorities"],
        queryFn: getall,
        enabled: true,
        staleTime: Infinity
    });
};

export const getDistricts = () => {
    const getall = () => axios.get<District[]>("/constants/districts.json").then(response => response.data);

    return useQuery({
        queryKey: ["districts"],
        queryFn: getall,
        enabled: true,
        staleTime: Infinity
    });
};

export const getPrinters = () => {
    const getall = () => axios.get<Array<{ name: string, ipAddress: string }>>("/constants/printers.json").then(response => response.data);

    return useQuery({
        queryKey: ["printers"],
        queryFn: getall,
        enabled: true,
        staleTime: Infinity
    });
};
