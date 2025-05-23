import { concepts } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";
import { ListWithLabelValue } from "./components";

export const FamilyMedicalHistoryNotes = ({ obs }: { obs: Obs[] }) => {
  const formattedList = obs.map((ob) => [
    {
      label: "Condition",
      value: ob.names[0]?.name ?? "Unknown",
    },
    {
      label: "Relationship to family member",
      value: getObservationValue(ob.children, concepts.RELATIONSHIP_TO_PATIENT),
    },
  ]);

  return (
    <ListWithLabelValue title="Family Medical History" list={formattedList} />
  );
};
