import { concepts } from "@/constants";
import { Obs } from "@/interfaces";

export const PresentingComplaintsNotes = ({ obs }: { obs: Obs[] }) => {
  const presentingComplaints = obs.filter((ob) =>
    ob.names.find(
      (name) =>
        name.name.toLowerCase() ===
        concepts.CURRENT_COMPLAINTS_OR_SYMPTOMS.toLowerCase()
    )
  );

  return (
    <div>
      <h5>Presenting Complaints</h5>
      <ul style={{ paddingLeft: "1.2rem", listStyleType: "disc" }}>
        {presentingComplaints.map((ob, index) => {
          const child = ob.children[0];
          const childName = child?.names[0]?.name;
          const childValue = child?.value;

          return (
            <li key={index} style={{ marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <span>
                  <strong>Complaint:</strong> {ob.value}
                </span>
                {childName && childValue && (
                  <span>
                    <strong>{childName}:</strong> {childValue}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
