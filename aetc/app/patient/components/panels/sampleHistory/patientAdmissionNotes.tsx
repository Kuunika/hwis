import { concepts } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";
import { ListWithLabelValue } from "./components";

export const PatientAdmissionNotes = ({ obs }: { obs: Obs[] }) => {
  const formattedList = obs.map((ob) => [
    { label: "Admission Date", value: ob.value },
    {
      label: "Hospital",
      value: getObservationValue(ob.children, concepts.HEALTH_CENTER_HOSPITALS),
    },
    {
      label: "Ward",
      value: getObservationValue(ob.children, concepts.ADMISSION_SECTION),
    },
    {
      label: "Diagnosis",
      value: getObservationValue(ob.children, concepts.ICD11_DIAGNOSIS),
    },
    {
      label: "Interventions",
      value: getObservationValue(ob.children, concepts.SURGICAL_INTERVENTIONS),
    },
    {
      label: "Discharge Instructions",
      value: getObservationValue(ob.children, concepts.DISCHARGE_INSTRUCTIONS),
    },
    {
      label: "Follow up plans",
      value: getObservationValue(ob.children, concepts.FOLLOWUP_PLAN),
    },
  ]);

  return (
    <ListWithLabelValue title="Patient Admission Notes" list={formattedList} />
  );
};
