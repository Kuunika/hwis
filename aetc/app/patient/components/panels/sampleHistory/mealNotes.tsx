import { concepts } from "@/constants";
import { getHumanReadableDate } from "@/helpers/dateTime";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";

export const MealNotes = ({ obs }: { obs: Obs[] }) => {
  return (
    <>
      <h5>Meal Notes</h5>
      <ul>
        {obs.map((ob, index) => {
          if (
            ob.names[0].name.toLowerCase() !=
            concepts.TIME_OF_LAST_MEAL.toLowerCase()
          ) {
            return null;
          }
          return (
            <li key={index}>
              <strong>Time for last meal:</strong>
              {getHumanReadableDate(ob.value)} ~
              <strong>Description of meal:</strong>
              {getObservationValue(
                ob.children,
                concepts.DESCRIPTION_OF_LAST_MEAL
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};
