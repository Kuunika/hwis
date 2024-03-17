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
type RegistrationType = 'local' | 'remote' | ''
export type SearchRegistrationContextType = {
  patient: Patient;
  setPatient: (patient: Patient) => void;
  registrationType: RegistrationType,
  setRegistrationType: (regi: RegistrationType) => void
};

export const SearchRegistrationContext =
  createContext<SearchRegistrationContextType | null>(null);

export const SearchRegistrationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [patient, setPatient] = useState<Patient>({} as Patient);
  const [registrationType, setRegistrationType] = useState<RegistrationType>('');



  return (
    <SearchRegistrationContext.Provider value={{ patient, setPatient, registrationType, setRegistrationType }}>
      {children}
    </SearchRegistrationContext.Provider>
  );
};
