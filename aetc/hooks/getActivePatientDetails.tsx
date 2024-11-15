import { useParameters } from "./navigation";
import { getPatientVisitTypes } from "./patientReg";

export const getActivePatientDetails = () => {
  const { params } = useParameters();
  const {
    data: patientVisits,
    isLoading,
    isSuccess,
  } = getPatientVisitTypes(params?.id as string);
  const activeVisit = patientVisits?.find((d) => !Boolean(d.date_stopped));

  return {
    activeVisit: activeVisit?.uuid,
    patientId: params?.id,
    isLoading,
    isSuccess,
  };
};
