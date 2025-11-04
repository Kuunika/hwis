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
    encountersDone,
  } = usePatientContext();

  const triaged = Boolean(
    Array.isArray(encountersDone) &&
      encountersDone.find((encounter) => encounter == "Triage Result")
  );

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
    encountersDone,
    triaged,
  };
};
