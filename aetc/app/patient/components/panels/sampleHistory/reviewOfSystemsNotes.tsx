import { concepts } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";
import { get } from "http";

export const ReviewOfSystemsNotes = ({ obs }: { obs: Obs[] }) => {
  const general = obs.filter((ob) => {
    return (
      ob.names[0].name.toLowerCase() ==
      concepts.REVIEW_OF_SYSTEMS_GENERAL.toLowerCase()
    );
  });
  const trauma = obs.filter((ob) => {
    return (
      ob.names[0].name.toLowerCase() ==
      concepts.REVIEW_OF_SYSTEMS_TRAUMA.toLowerCase()
    );
  });

  const mechanismOfInjury = trauma[0]?.children.map((ob) => {
    if (
      ob.names[0].name.toLowerCase() == concepts.TIME_OF_INJURY.toLowerCase() ||
      ob.names[0].name.toLowerCase() ==
        concepts.LOSS_OF_CONSCIOUSNESS.toLowerCase() ||
      ob.names[0].name.toLowerCase() ==
        concepts.OCCUPATIONAL_INJURY.toLowerCase()
    ) {
      return null;
    }
    return (
      <li key={ob.names[0].name}>
        <strong>Mechanism of injury:</strong>
        {ob.names[0].name} ~ <strong>Comment:</strong> {ob.value}
      </li>
    );
  });

  return (
    <>
      <h5>Review of systems</h5>
      <ul>
        {general.map((ob, index) => {
          return (
            <li key={index}>
              <strong>{generalSymptomConceptName(ob.children)}</strong>~
              {partialMatch(ob.children, "Duration")?.names[0].name}:
              {partialMatch(ob.children, "Duration")?.value} ~ location:
              {getObservationValue(ob.children, concepts.ANATOMIC_LOCATIONS)}
            </li>
          );
        })}
      </ul>
      <ul>
        {obs.map((ob, index) => {
          if (
            ob.names[0].name.toLowerCase() ==
            concepts.REVIEW_OF_SYSTEMS_GENERAL.toLowerCase()
          ) {
            return null;
          }
          return (
            <li key={index}>
              <strong>{ob.names[0].name}:</strong>
              {ob.children.map((child) => child.names[0].name).join(", ")}
            </li>
          );
        })}
      </ul>
      <br />
      <p>Date Time of Injury</p>:{" "}
      {getObservationValue(trauma[0]?.children, concepts.TIME_OF_INJURY)} <br />
      <p>Did the patient lose consciousness on the scene</p>:{" "}
      {getObservationValue(trauma[0]?.children, concepts.LOSS_OF_CONSCIOUSNESS)}{" "}
      <br />
      <p>Was this injury work-related</p>:{" "}
      {getObservationValue(trauma[0]?.children, concepts.OCCUPATIONAL_INJURY)}{" "}
      <br />
      <ul>{mechanismOfInjury}</ul>
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
