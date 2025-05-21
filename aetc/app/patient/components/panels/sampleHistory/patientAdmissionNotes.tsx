import { concepts } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";

export const PatientAdmissionNotes = ({ obs }: { obs: Obs[] }) => {
  return (
    <>
      <h5>Patient Admission Notes</h5>
      <ul>
        {obs.map((ob, index) => {
          return (
            <li key={index}>
              <strong>Admission Date:</strong> {ob.value} ~{" "}
              <strong>Hospital:</strong>
              {getObservationValue(
                ob.children,
                concepts.HEALTH_CENTER_HOSPITALS
              )}{" "}
              ~ <strong>Ward:</strong>
              {getObservationValue(
                ob.children,
                concepts.ADMISSION_SECTION
              )} ~ <strong>Diagnosis:</strong>
              {getObservationValue(
                ob.children,
                concepts.ICD11_DIAGNOSIS
              )} ~ <strong>Interventions:</strong>
              {getObservationValue(
                ob.children,
                concepts.SURGICAL_INTERVENTIONS
              )}
              ~<strong>Discharge Instructions:</strong>
              {getObservationValue(
                ob.children,
                concepts.DISCHARGE_INSTRUCTIONS
              )}{" "}
              ~ <strong>Follow up plans:</strong>
              {getObservationValue(ob.children, concepts.FOLLOWUP_PLAN)}~
            </li>
          );
        })}
      </ul>
    </>
  );
};
