import { concepts } from "@/constants";
import { getHumanReadableDate } from "@/helpers/dateTime";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";
import { ListWithLabelValue } from "./components";

export const SurgicalNotes = ({ obs }: { obs: Obs[] }) => {
  const surgicalList = obs.map((ob) => [
    { label: "Procedure Date", value: getHumanReadableDate(ob.value) },
    {
      label: "Complications",
      value: getObservationValue(ob.children, concepts.COMPLICATIONS),
    },
    {
      label: "Indication for surgery",
      value: getObservationValue(ob.children, concepts.INDICATION_FOR_SURGERY),
    },
  ]);

  return (
    <>
      <ListWithLabelValue title="Surgical Notes" list={surgicalList} />
      <br />
    </>
  );
};
