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
  value: any;
  names: { name: string }[];
  children?: Observation[]; // To support nested children
}

interface ProcessedObservation {
  obs_id: number | null;
  name: string | undefined;
  value: any;
  children: ProcessedObservation[];
}

interface PanelProps {

  showForPrinting: boolean;
  toggleShow: (value: boolean) => void;

}

function ReviewOfSystemsPanel({ showForPrinting , toggleShow}: PanelProps) {
    const { params } = useParameters();
    const { data: encounterData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<(ProcessedObservation|null)[]>([]);
    const displayedObservations = showForPrinting ? observations : observations.slice(0, 4);

  useEffect(() => {
    if (!historyLoading) {

        const rOSEncounters = encounterData?.filter(
            (item) => item.encounter_type?.name === "Review of Systems"
          )


        const observations: ProcessedObservation[] = [];

        rOSEncounters?.forEach((encounter: { obs: Observation[] }) => {
            encounter.obs.forEach((observation) => {
              const value = observation.value;
          
              const obsData: ProcessedObservation = {
                obs_id: observation.obs_id,
                name: observation.names?.[0]?.name,
                value,
                children: [],
              };
          
              if (observation.obs_group_id) {
                const parent = observations.find((o) => o.obs_id === observation.obs_group_id);
                if (parent) {
                  parent.children.push(obsData);
                }
              } else {
                observations.push(obsData);
              }
            });
          });
          
          const seen = new Set();
          const dedupedObs = observations.map(element => {
                if (seen.has(element.name)) return null;
                seen.add(element.name);
          
                const matches = observations.filter(item => item.name === element.name && item !== element);
          
                matches.forEach(match => {
                    if (match.children) {
                        element.children = [...(element.children || []), ...match.children];
                    }
                });
          
                return element;
            })
            .filter(Boolean);
            
  
            setObservations(dedupedObs)

 
        }
  },[encounterData])

return (
  <>
  <Panel title="Review of Systems">
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
                                  {displayedObservations.length === 0 ? ( <p>No Review of Systems information available</p>):(<>
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
    >
        <b>{item.name}</b>
      {item.children && item.children.length > 0 && (
        <>
          {item.children.map((child) => (
            <p key={child.obs_id}>
              {(child.name)?.split("Family History ").pop()}
              {child.value === "true" ? null : `: ${child.value}`}
            </p>
          ))}
        </>
      )}
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


export default ReviewOfSystemsPanel;