import { usePatientContext } from "@/contexts/activePatientContext";

export const getActivePatientDetails = () => {
  const {
    activeVisit,
    patientId,
    activeVisitId,
    isLoading,
    isSuccess,
    patient,
    hasActiveVisit,
    recentVisitCloseDateTime,
    closedVisitId,
    openClosedVisit,
  } = usePatientContext();

  return {
    activeVisit,
    patientId,
    activeVisitId,
    isLoading,
    isSuccess,
    gender: patient && patient?.gender,
    patient,
    hasActiveVisit,
    recentVisitCloseDateTime,
    closedVisitId,
    openClosedVisit,
  };
};
