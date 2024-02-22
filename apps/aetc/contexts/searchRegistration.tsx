"use client";
import { useState } from "react";

import { createContext, FC, ReactNode } from "react";

type Patient = {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: Date;
  homeDistrict: string;
  homeTraditionalAuthority: string;
};

export type SearchRegistrationContextType = {
  patient: Patient;
  setPatient: (patient: Patient) => void;
};

export const SearchRegistrationContext =
  createContext<SearchRegistrationContextType | null>(null);

export const SearchRegistrationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [patient, setPatient] = useState<Patient>({} as Patient);

  return (
    <SearchRegistrationContext.Provider value={{ patient, setPatient }}>
      {children}
    </SearchRegistrationContext.Provider>
  );
};
