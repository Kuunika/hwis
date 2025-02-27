import { useParameters } from "./navigation";
import { getOnePatient, getPatientVisitTypes } from "./patientReg";

export const getActivePatientDetails = () => {
  const { params } = useParameters();
  const {
    data: patientVisits,
    isLoading,
    isSuccess,
  } = getPatientVisitTypes(params?.id as string);
  const activeVisit = patientVisits?.find((d) => !Boolean(d.date_stopped));
  const { data: patient, isLoading: patientLoading } = getOnePatient(
    params?.id as string
  );

  return {
    activeVisit: activeVisit?.uuid,
    patientId: params?.id,
    activeVisitId: activeVisit?.visit_id,
    isLoading,
    isSuccess,
    gender: patient && patient?.gender,
  };
};
