"use client";
import { Person } from "@/interfaces";
import { useState } from "react";

import { createContext, FC, ReactNode } from "react";


type RegistrationType = 'local' | 'remote' | '';
type SearchedPatient = { firstName: string, lastName: string, gender: string, patient_id?: number };
export type SearchRegistrationContextType = {
  patient: Person; // patient selected for registration
  setPatient: (patient: Person) => void;

  searchedPatient: SearchedPatient,
  setSearchedPatient: (patient: SearchedPatient) => void

  initialRegisteredPatient: Person;
  setInitialRegisteredPatient: (person: Person) => void

  registrationType: RegistrationType,
  setRegistrationType: (regi: RegistrationType) => void
};

export const SearchRegistrationContext =
  createContext<SearchRegistrationContextType | null>(null);

export const SearchRegistrationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [patient, setPatient] = useState<Person>({} as Person);
  const [searchedPatient, setSearchedPatient] = useState<SearchedPatient>({} as SearchedPatient);
  const [initialRegisteredPatient, setInitialRegisteredPatient] = useState<Person>({} as Person);
  const [registrationType, setRegistrationType] = useState<RegistrationType>('');


  return (
    <SearchRegistrationContext.Provider value={{ searchedPatient, setSearchedPatient, patient, setPatient, registrationType, setRegistrationType, setInitialRegisteredPatient, initialRegisteredPatient }}>
      {children}
    </SearchRegistrationContext.Provider>
  );
};
