import { concepts } from "@/constants";
import { Obs } from "@/interfaces";
import { ListWithLabelValue } from "./components";
// adjust import path

export const PresentingComplaintsNotes = ({ obs }: { obs: Obs[] }) => {
  const presentingComplaints = obs.filter((ob) =>
    ob.names.some(
      (name) =>
        name.name.toLowerCase() ===
        concepts.CURRENT_COMPLAINTS_OR_SYMPTOMS.toLowerCase()
    )
  );

  const formattedList = presentingComplaints.map((ob) => {
    const child = ob.children[0];
    const childName = child?.names[0]?.name;
    const childValue = child?.value;

    const group = [{ label: "Complaint", value: ob.value }];

    if (childName && childValue) {
      group.push({ label: childName, value: childValue });
    }

    return group;
  });

  return (
    <ListWithLabelValue title="Presenting Complaints" list={formattedList} />
  );
};
