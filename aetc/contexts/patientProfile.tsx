"use client";
import { useState } from "react";

import { createContext, FC, ReactNode } from "react";

export type PatientProfileContextType = {
    activeVisit: number;
    setActiveVisit: (value: any) => void;
    visits: string[];
    setVisits: (visits: Array<string>) => void;
    openVisit: boolean;
    setOpenVisit:(value:any)=>void
};

export const PatientProfileContext = createContext<PatientProfileContextType | null>(null);

export const PatientProfileProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [activeVisit, setActiveVisit] = useState<number>(0);
    const [visits, setVisits] = useState<string[]>([]);
    const [openVisit, setOpenVisit] = useState<boolean>(false);

    return (
        <PatientProfileContext.Provider value={{ activeVisit, setActiveVisit, visits, setVisits, openVisit, setOpenVisit }}>
            {children}
        </PatientProfileContext.Provider>
    );
};
