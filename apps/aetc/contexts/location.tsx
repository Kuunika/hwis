"use client";
import { getVillages, getDistricts, getTraditionalAuthorities } from "@/hooks/loadStatic";
import { District, TraditionalAuthority, Village } from "@/interfaces";
import { useEffect, useState } from "react";

import { createContext, FC, ReactNode } from "react";

export type LocationContextType = {
    villages: Village[],
    districts: District[],
    traditionalAuthorities: TraditionalAuthority[],
    setVillages: (villages: Village[]) => void,
    setDistricts: (districts: District[]) => void,
    setTraditionalAuthorities: (traditionalAuthorities: TraditionalAuthority[]) => void,
};

export const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider: FC<{ children: ReactNode }> = ({ children }) => {


    const { data: _villages, isSuccess: villagesLoaded } = getVillages();
    const { data: _districts, isSuccess: districtsLoaded } = getDistricts();
    const { data: _traditionalAuthorities, isSuccess: traditionalAuthoritiesLoaded } = getTraditionalAuthorities();


    console.log({ _villages, _districts, _traditionalAuthorities })

    const [villages, setVillages] = useState<Village[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [traditionalAuthorities, setTraditionalAuthorities] = useState<TraditionalAuthority[]>([]);


    useEffect(() => {

        if (villagesLoaded) {
            setVillages(_villages);
        }
    }, [villagesLoaded])

    useEffect(() => {

        if (districtsLoaded) {
            setDistricts(_districts);
        }
    }, [districtsLoaded])

    useEffect(() => {

        if (traditionalAuthoritiesLoaded) {
            setTraditionalAuthorities(_traditionalAuthorities);
        }
    }, [traditionalAuthoritiesLoaded])


    return (
        <LocationContext.Provider value={{ traditionalAuthorities, setTraditionalAuthorities, districts, setDistricts, villages, setVillages }}>
            {children}
        </LocationContext.Provider>
    );
};
