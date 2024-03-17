"use client";
import { Person } from "@/interfaces";
import { useState } from "react";

import { createContext, FC, ReactNode } from "react";


type RegistrationType = 'local' | 'remote' | ''
export type SearchRegistrationContextType = {
  patient: Person;
  setPatient: (patient: Person) => void;
  registrationType: RegistrationType,
  setRegistrationType: (regi: RegistrationType) => void
};

export const SearchRegistrationContext =
  createContext<SearchRegistrationContextType | null>(null);

export const SearchRegistrationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [patient, setPatient] = useState<Person>({} as Person);
  const [registrationType, setRegistrationType] = useState<RegistrationType>('');



  return (
    <SearchRegistrationContext.Provider value={{ patient, setPatient, registrationType, setRegistrationType }}>
      {children}
    </SearchRegistrationContext.Provider>
  );
};
