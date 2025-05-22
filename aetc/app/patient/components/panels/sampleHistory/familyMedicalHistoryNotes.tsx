import { concepts } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";

export const FamilyMedicalHistoryNotes = ({ obs }: { obs: Obs[] }) => {
  return (
    <>
      <h5>Family Medical History</h5>
      <ul>
        {obs.map((ob, index) => {
          return (
            <li key={index}>
              <strong>Condition:</strong>
              {ob.names[0].name}~
              <strong>Relationship to family member: </strong>{" "}
              {getObservationValue(
                ob.children,
                concepts.RELATIONSHIP_TO_PATIENT
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};
