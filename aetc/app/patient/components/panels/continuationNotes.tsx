import { getHumanReadableDateTime } from "@/helpers/dateTime";
import { Obs } from "@/interfaces";
import ReactMarkdown from "react-markdown";

export const ContinuationNotes = ({ obs }: { obs: Obs[] }) => {
  return obs.map((note) => (
    <div key={note.uuid} style={{ marginBottom: "1ch" }}>
      <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
        <ReactMarkdown>{note.value}</ReactMarkdown>
      </p>
      <div
        style={{
          color: "#7f8c8d",
          fontSize: "14px",
          letterSpacing: "0.2px",
          marginTop: "8px",
          fontStyle: "italic",
        }}
      >
        ~ {note.created_by} -{" "}
        {getHumanReadableDateTime(note.obs_datetime || new Date())}
      </div>
    </div>
  ));
};
