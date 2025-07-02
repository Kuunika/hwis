"use client";;
import { Panel } from "@/app/patient/components/panels";
import { WrapperBox } from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
interface Observation {
  obs_id: number | null;
  obs_group_id: number | null;
  value?: any;
  value_text?: any;
  names: { name: string }[];
  children?: Observation[]; 
}

interface ProcessedObservation {
  obs_id: number | null;
  name: string | undefined;
  value?: any;
  value_text?: any;
  children: ProcessedObservation[];
}

interface familyHistoryPanelProps {

  showForPrinting: boolean;
  toggleShow: (value: boolean) => void;

}

function FamilyHistoryPanel({ showForPrinting , toggleShow}: familyHistoryPanelProps) {
    const { params } = useParameters();
    const { data: historicData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);
    const displayedObservations = showForPrinting ? observations : observations.slice(0, 4);

   useEffect(() => {
  if (!historyLoading && historicData) {
    const familyHistoryEncounters = historicData.filter(
      (item) => item.encounter_type?.name === "FAMILY MEDICAL HISTORY"
    );

    const processed: ProcessedObservation[] = [];

    familyHistoryEncounters.forEach((encounter: { obs: Observation[] }) => {
      encounter.obs.forEach((observation) => {
        const value = observation.value;

        const obsData: ProcessedObservation = {
          obs_id: observation.obs_id,
          name: observation.names?.[0]?.name,
          value,
          children: observation.children
            ? observation.children.map((child) => ({
                obs_id: child.obs_id,
                name: child.names?.[0]?.name,
                value: child.value,
                children: [],
              }))
            : [],
        };
        processed.push(obsData);
      });
    });

    const filtered = processed.filter(
      (item) => item.children && item.children.length > 0
    );

    setObservations(filtered);
  }
}, [historicData, historyLoading]);

return (
  <>
  <Panel title="">

  <h3
  style={{
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "1rem",
    borderBottom: "2px solid #ccc",
    paddingBottom: "0.5rem",
  }}
>
  Family History
</h3>
    <WrapperBox>
              {historyLoading ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: "150px",
                                    }}
                                  >
                                    <CircularProgress size={40} />
                                  </div>
                                ) : (
                                  <>
                                  {displayedObservations.length === 0 ? ( <p>No family history available</p>):(<>
    <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "flex-start", 
  }}
>
  {displayedObservations.map((item) => (
    <div
      key={item.obs_id}
      style={{
        width: "300px",
        color: "rgba(0, 0, 0, 0.6)",
      }}
    ><b>{item.name?.split("Family History ").pop()}</b>
{item.name === "Family History Other Condition"?<p><b>{item.value}</b></p>:null}
          {item.children.map((child) => (
            <p key={child.obs_id}>{child.value}</p>
          ))}
    </div>
  ))}
</div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end", 
          marginTop: "10px",
        }}
      >
        {!showForPrinting && observations.length > 4 && (
          <button
            onClick={() => toggleShow(true)}
            style={{
              color: "rgba(0, 0, 0, 0.6)",
              cursor: "pointer",
              border: "none",
              background: "none",
              padding: 0,
            }}
          >
            View More ...
          </button>
        )}
        {showForPrinting && (
          <button
            onClick={() => toggleShow(false)}
            style={{
              color: "rgba(0, 0, 0, 0.6)",
              cursor: "pointer",
              border: "none",
              background: "none",
              padding: 0,
            }}
          >
            View Less
          </button>
        )}
      </div>    </>)}</>  )}
    </WrapperBox>

  </Panel>
</>
  );



}


export default FamilyHistoryPanel;