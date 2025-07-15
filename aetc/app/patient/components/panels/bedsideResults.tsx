import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Obs } from "@/interfaces";

interface BedsideResultsProps {
  data: Obs[];
}

export const BedsideResults = ({ data }: BedsideResultsProps) => {
  const [groupedObservations, setGroupedObservations] = useState<Obs[]>([]);

  const UNIT_MAP: Record<string, string> = {
  // Blood Gas Values
  "pH": "",
  "PCO2": "mmHg",
  "PO2": "mmHg",
  "Base Excess": "mmol/L",

  // Oximetry Values
  "ctHb": "g/dL",
  "SO2E": "%",
  "FO2HBE": "%",
  "FHHBE": "%",
  "FmetHb": "%",

  // Electrolyte Values
  "Creatine kinase": "mmol/L",
  "CNA": "mmol/L",
  "CA2": "mmol/L",
  "CCL": "mmol/L",

  // Metabolic Values
  "cGlu": "mmol/L",
  "cLac": "mmol/L",
  "ctBil": "µmol/L",

  // Temperature-Corrected Values
  "pH (T)": "",
  "pCO₂ (T)": "mmHg",
  "pO₂ (T)": "mmHg",
  "P50E": "",

  // Acid Base Status
  "BaseExcess": "mmol/L",
  "HCO3": "mmol/L",
  "Anion Gapc": "mmol/L",
  "MOSMC": "mmol/kg"
};


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

  
  const getUnit = (name: string) => {
    const unit = UNIT_MAP[name] ?? "";
    return `${unit ? ` ${unit}` : ""}`;
};
 
  const renderObservation = (obs: Obs, level: number = 0) => {
  const indent = level * 16;
  return (
    <div key={obs.obs_id} style={{ marginLeft: indent }}>
      <Typography>
        {obs.names?.[0]?.name === 'Description' ? "" : `${obs.names?.[0]?.name} `}
        {obs.value_text ? (
          <>
            <b>{obs.value_text}</b>
            <span>{getUnit(obs.names?.[0]?.name)}</span>
          </>
        ) : (
          <>
            <b>
              {obs.value ?? obs.value_numeric ?? "N/A"}
            </b>
            <span>{getUnit(obs.names?.[0]?.name)}</span>
          </>
        )}
      </Typography>
      {obs.children?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {obs.children.map((childObs) => renderObservation(childObs, level + 1))}
        </div>
      )}
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