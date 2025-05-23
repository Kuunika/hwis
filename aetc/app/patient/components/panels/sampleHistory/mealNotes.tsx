import { concepts } from "@/constants";
import { getHumanReadableDate } from "@/helpers/dateTime";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";
import { ListWithLabelValue } from "./components";

export const MealNotes = ({ obs }: { obs: Obs[] }) => {
  const filteredObs = obs.filter(
    (ob) =>
      ob.names[0].name.toLowerCase() ===
      concepts.TIME_OF_LAST_MEAL.toLowerCase()
  );

  const mealList = filteredObs.map((ob) => [
    { label: "Time for last meal", value: getHumanReadableDate(ob.value) },
    {
      label: "Description of meal",
      value: getObservationValue(
        ob.children,
        concepts.DESCRIPTION_OF_LAST_MEAL
      ),
    },
  ]);

  return (
    <>
      <ListWithLabelValue title="Meal Notes" list={mealList} />
      <br />
    </>
  );
};
