import { concepts } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";
import { ListWithLabelValue } from "./components";

export const ReviewOfSystemsNotes = ({ obs }: { obs: Obs[] }) => {
  const general = obs.filter(
    (ob) =>
      ob.names[0].name.toLowerCase() ===
      concepts.REVIEW_OF_SYSTEMS_GENERAL.toLowerCase()
  );

  const trauma = obs.filter(
    (ob) =>
      ob.names[0].name.toLowerCase() ===
      concepts.REVIEW_OF_SYSTEMS_TRAUMA.toLowerCase()
  );

  // Format general symptoms list
  const generalList = general.map((ob) => {
    const symptomName = generalSymptomConceptName(ob.children) || "";
    const durationObs = partialMatch(ob.children, "Duration");
    const durationLabel = durationObs?.names[0].name || "";
    const durationValue = durationObs?.value || "";
    const locationValue = getObservationValue(
      ob.children,
      concepts.ANATOMIC_LOCATIONS
    );

    return [
      { label: symptomName, value: "" },
      { label: durationLabel, value: durationValue },
      { label: "Location", value: locationValue },
    ];
  });

  // Format other systems (non-general) list
  const otherSystemsList = obs
    .filter(
      (ob) =>
        ob.names[0].name.toLowerCase() !==
        concepts.REVIEW_OF_SYSTEMS_GENERAL.toLowerCase()
    )
    .map((ob) => {
      return [
        {
          label: ob.names[0].name,
          value: ob.children.map((child) => child.names[0].name).join(", "),
        },
      ];
    });

  // Trauma details list
  const traumaDetails = [
    {
      label: "Date Time of Injury",
      value:
        getObservationValue(trauma[0]?.children, concepts.TIME_OF_INJURY) || "",
    },
    {
      label: "Did the patient lose consciousness on the scene",
      value:
        getObservationValue(
          trauma[0]?.children,
          concepts.LOSS_OF_CONSCIOUSNESS
        ) || "",
    },
    {
      label: "Was this injury work-related",
      value:
        getObservationValue(
          trauma[0]?.children,
          concepts.OCCUPATIONAL_INJURY
        ) || "",
    },
  ];

  // Mechanism of Injury list as label-value pairs
  const mechanismOfInjuryList =
    trauma[0]?.children
      .filter(
        (ob) =>
          ![
            concepts.TIME_OF_INJURY.toLowerCase(),
            concepts.LOSS_OF_CONSCIOUSNESS.toLowerCase(),
            concepts.OCCUPATIONAL_INJURY.toLowerCase(),
          ].includes(ob.names[0].name.toLowerCase())
      )
      .map((ob) => [
        { label: "Mechanism of injury", value: ob.names[0].name },
        { label: "Comment", value: ob.value },
      ]) || [];

  return (
    <>
      <ListWithLabelValue
        title="General Review of Systems"
        list={generalList}
      />
      <ListWithLabelValue title="Other Systems" list={otherSystemsList} />
      <ListWithLabelValue title="Trauma Details" list={[traumaDetails]} />
      <ListWithLabelValue
        title="Mechanism of Injury"
        list={mechanismOfInjuryList}
      />
    </>
  );
};

const partialMatch = (obs: Obs[], conceptName: string) =>
  obs.find((ob) =>
    ob.names.some((name) =>
      name.name.toLowerCase().includes(conceptName.toLowerCase())
    )
  );

const generalSymptomConceptName = (obs: Obs[]) => {
  return obs.find((ob) => ob.value)?.names[0].name;
};
