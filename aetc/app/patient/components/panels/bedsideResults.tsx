import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Obs } from "@/interfaces";

interface BedsideResultsProps {
  data: Obs[];
}

export const BedsideResults = ({ data }: BedsideResultsProps) => {
  const [standaloneObservations, setStandaloneObservations] = useState<Obs[]>([]);
  const [groupedObservations, setGroupedObservations] = useState<Obs[]>([]);

  useEffect(() => {
    if (data.length > 0) {


      const finalObsArray = Object.values(data);
      const grouped = finalObsArray.filter((obs) => obs.children && obs.children.length > 0);
      const standalone = finalObsArray.filter((obs) => !obs.children || obs.children.length === 0);

      setGroupedObservations(grouped);
      setStandaloneObservations(standalone);
    }
  }, [data]);

  const renderObservation = (obs: Obs, level: number = 0) => {
    const indent = level * 16;

    return (
      <div key={obs.obs_id} style={{ marginLeft: indent }}>
        <Typography>
          <b>{obs.names?.[0]?.name}:</b>{" "}
          {obs.value ?? obs.value_text ?? obs.value_numeric ?? "N/A"}
        </Typography>
        {obs.children?.length > 0 &&
          obs.children.map((childObs) => renderObservation(childObs, level + 1))}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.2rem" }}>
      {standaloneObservations.length === 0 && groupedObservations.length === 0 ? (
        <Typography>No results available</Typography>
      ) : (
        <>
          {standaloneObservations.length > 0 && (
            <>
              {standaloneObservations.map((obs) => renderObservation(obs, 1))}
            </>
          )}

          {groupedObservations.length > 0 && (
            <>
              {groupedObservations.map((obs) => renderObservation(obs, 1))}
            </>
          )}
        </>
      )}
    </div>
  );
};