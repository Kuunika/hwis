import { concepts } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";

export const MedicationNotes = ({ obs }: { obs: Obs[] }) => {
  return (
    <>
      <h3>Medication</h3>
      <ul>
        {obs.map((ob, index) => (
          <li key={index}>
            <strong>Medication Name</strong>: {ob.value} ~{" "}
            <strong>Formulation</strong>:{" "}
            {getObservationValue(ob.children, concepts.MEDICATION_FORMULATION)}{" "}
            ~ <GetObsByPartialMatch obs={ob.children} conceptName="dose" /> ~{" "}
            <GetObsByPartialMatch obs={ob.children} conceptName="frequency" /> ~{" "}
            <GetObsByPartialMatch obs={ob.children} conceptName="duration" /> ~{" "}
            <GetObsByPartialMatch obs={ob.children} conceptName="Last Taken" />{" "}
            ~{" "}
            <GetObsByPartialMatch
              obs={ob.children}
              conceptName="Last Prescription"
            />
          </li>
        ))}
      </ul>
    </>
  );
};

const GetObsByPartialMatch = ({
  obs,
  conceptName,
}: {
  obs: Obs[];
  conceptName: string;
}) => {
  const found = obs.find((ob) =>
    ob.names.some((name) =>
      name.name.toLowerCase().includes(conceptName.toLowerCase())
    )
  );

  if (found) {
    return (
      <>
        <strong>{found.names[0].name}</strong>: {found.value}
      </>
    );
  }

  return null;
};
