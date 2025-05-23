import { concepts } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";
import { ListWithLabelValue } from "./components";

export const MedicationNotes = ({ obs }: { obs: Obs[] }) => {
  const formattedList = obs.map((ob) => {
    const items = [
      { label: "Medication Name", value: ob.value },
      {
        label: "Formulation",
        value: getObservationValue(
          ob.children,
          concepts.MEDICATION_FORMULATION
        ),
      },
    ];

    const additionalItems = [
      "dose",
      "frequency",
      "duration",
      "Last Taken",
      "Last Prescription",
    ]
      .map((concept) => {
        const match = ob.children.find((child) =>
          child.names.some((name) =>
            name.name.toLowerCase().includes(concept.toLowerCase())
          )
        );

        return match
          ? {
              label: match.names[0].name,
              value: match.value,
            }
          : null;
      })
      .filter(Boolean) as { label: string; value: string }[];

    return [...items, ...additionalItems];
  });

  return <ListWithLabelValue title="Medication" list={formattedList} />;
};
