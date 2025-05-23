import { concepts } from "@/constants";
import { getHumanReadableDate } from "@/helpers/dateTime";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";
import { ListWithLabelValue } from "./components";

export const PriorConditionsNotes = ({ obs }: { obs: Obs[] }) => {
  const formattedList = obs.map((ob) => [
    { label: "Diagnosis Date", value: getHumanReadableDate(ob.value) },
    {
      label: "Diagnosis",
      value: getObservationValue(ob.children, concepts.ICD11_DIAGNOSIS),
    },
    {
      label: "On Treatment",
      value: getObservationValue(ob.children, concepts.ON_TREATMENT),
    },
    {
      label: "Additional Details",
      value: getObservationValue(
        ob.children,
        concepts.ADDITIONAL_DIAGNOSIS_DETAILS
      ),
    },
  ]);

  return <ListWithLabelValue title="Prior Conditions" list={formattedList} />;
};
