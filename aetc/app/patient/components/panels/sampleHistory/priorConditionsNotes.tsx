import { concepts } from "@/constants";
import { getHumanReadableDate } from "@/helpers/dateTime";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";

export const PriorConditionsNotes = ({ obs }: { obs: Obs[] }) => {
  return (
    <>
      <h5>Prior Conditions</h5>
      <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
        {obs.map((ob, index) => {
            return (
            <li key={index}>
              <strong>Diagnosis Date:</strong> { getHumanReadableDate(ob.value)} ~ <strong>Diagnosis:</strong>{" "}
              {getObservationValue(ob.children, concepts.ICD11_DIAGNOSIS)} ~ <strong>On Treatment:</strong>{" "}
              {getObservationValue(ob.children, concepts.ON_TREATMENT)} ~ <strong>Additional Details:</strong>{" "}
              {getObservationValue(
              ob.children,
              concepts.ADDITIONAL_DIAGNOSIS_DETAILS
              )}
            </li>
            );
        })}
      </ul>
    </>
  );
};
