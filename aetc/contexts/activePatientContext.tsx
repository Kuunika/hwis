"use client";
import { useParameters } from "@/hooks";
import {
  getOnePatient,
  getPatientVisitTypes,
  patientEncountersDone,
} from "@/hooks/patientReg";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface PatientContextProps {
  activeVisit?: string;
  patientId?: string;
  activeVisitId?: string;
  isLoading: boolean;
  isSuccess: boolean;
  gender?: string;
  patient?: any;
  hasActiveVisit: boolean | null;
  recentVisitCloseDateTime?: string;
  closedVisitId?: string;
  openClosedVisit: () => void;
  encountersDone: any;
}

const PatientContext = createContext<PatientContextProps | undefined>(
  undefined
);

export const ActivePatientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [hasActiveVisit, setHasActiveVisit] = useState<boolean | null>(null);
  const { params } = useParameters();
  const {
    data: patientVisits,
    isLoading,
    isSuccess,
  } = getPatientVisitTypes(params?.id as string);
  const { data: patient } = getOnePatient(params?.id as string);
  const activeVisit = patient?.active_visit;
  const { data: encountersDone } = patientEncountersDone(
    activeVisit?.uuid as string
  );

  const recentClosedVisit =
    patientVisits && patientVisits.length > 0
      ? patientVisits[patientVisits.length - 1]
      : null;

  useEffect(() => {
    if (isSuccess) setHasActiveVisit(Boolean(activeVisit));
  }, [activeVisit, isSuccess]);

  const value: PatientContextProps = {
    activeVisit: activeVisit?.uuid,
    patientId: params?.id as string,
    activeVisitId: activeVisit?.visit_id as unknown as string,
    isLoading,
    isSuccess,
    gender: patient?.gender,
    patient,
    hasActiveVisit,
    recentVisitCloseDateTime:
      recentClosedVisit?.date_stopped as unknown as string,
    closedVisitId: recentClosedVisit?.uuid,
    openClosedVisit: () => setHasActiveVisit(true),
    encountersDone,
  };

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};

export const usePatientContext = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatientContext must be used within a PatientProvider");
  }
  return context;
};
