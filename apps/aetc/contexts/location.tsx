"use client";
import { District, TraditionalAuthority, Village } from "@/interfaces";
import { useState } from "react";

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
    const [villages, setVillages] = useState<Village[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [traditionalAuthorities, setTraditionalAuthorities] = useState<TraditionalAuthority[]>([]);

    return (
        <LocationContext.Provider value={{ traditionalAuthorities, setTraditionalAuthorities, districts, setDistricts, villages, setVillages }}>
            {children}
        </LocationContext.Provider>
    );
};
