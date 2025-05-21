import { concepts } from "@/constants";
import { getHumanReadableDate } from "@/helpers/dateTime";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";

export const SurgicalNotes = ({ obs }: { obs: Obs[] }) => {
  return (
    <>
      <h5>Surgical Notes</h5>
      <ul>
        {obs.map((ob, index) => {
          return (
            <li key={index}>
              <strong>Procedure Date:</strong>
              {getHumanReadableDate(ob.value)} ~ <strong>Procedure:</strong> ~{" "}
              <strong>Complications:</strong>
              {getObservationValue(ob.children, concepts.COMPLICATIONS)}
              ~ <strong>Indication for surgery:</strong> {getObservationValue(ob.children, concepts.INDICATION_FOR_SURGERY)}
            </li>
          );
        })}
      </ul>
    </>
  );
};
