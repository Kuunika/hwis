import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Obs } from "@/interfaces";

interface BedsideResultsProps {
  data: Obs[];
}

export const BedsideResults = ({ data }: BedsideResultsProps) => {
  const [groupedObservations, setGroupedObservations] = useState<Obs[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      const finalObsArray = Object.values(data);

      const filterObservations = (observations: Obs[]): Obs[] => {
        return observations
          .filter((obs) => {
            const isDescription = obs.names?.[0]?.name === "Description";
            const val = obs.value ?? obs.value_text ?? obs.value_numeric;
            const isNumeric = !isNaN(Number(val)) && val !== null && val !== undefined && val !== "";
            return !(isDescription && isNumeric);
          })
          .map((obs) => ({
            ...obs,
            children: obs.children ? filterObservations(obs.children) : [],
          }));
      };

      const grouped = finalObsArray
        .filter((obs) => obs.children && obs.children.length > 0)
        .map((obs) => ({
          ...obs,
          children: obs.children ? filterObservations(obs.children) : [],
        }));

      setGroupedObservations(grouped);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.2rem",
      }}
    >
      {groupedObservations.length === 0 ? (
        <Typography>No results available</Typography>
      ) : (
        groupedObservations.map((obs) => renderObservation(obs, 1))
      )}
    </div>
  );
};