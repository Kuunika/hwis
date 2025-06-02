import { Obs } from "@/interfaces";

export const MedicalAllegyNotes = ({ obs }: { obs: Obs[] }) => {
  return (
    <>
      <h4>Medication Allergy</h4>
      <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
        {obs.map((ob, index) =>
          ob.children.map((childOb, childIndex) => (
            <li key={`${index}-${childIndex}`}>{childOb.value}</li>
          ))
        )}
      </ul>
      <br />
    </>
  );
};
