"use client";;
import { Panel } from "@/app/patient/components/panels";
import { WrapperBox } from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Key, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
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

function AllergiesPanel() {
    const { params } = useParameters();
    const { data: historicData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);
    const [showAll, setShowAll] = useState(false);
    const displayedObservations = showAll ? observations : observations.slice(0, 4);


    const sampleHistoryEncounters = historicData?.filter((item) => item.encounter_type.name === "SURGICAL HISTORY");
 

  useEffect(() => {
    if (!historyLoading) {
        const observations: ProcessedObservation[] = [];
        
       
        sampleHistoryEncounters?.forEach((encounter: { obs: Observation[] }) => {
          console.log('Patient history:',encounter);
          
        
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
        })
            setObservations(observations)
        });

        }

  },[historicData])

return (
    <>
<Panel title="Past Surgical History">
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "flex-start",
          }}
        >
          {displayedObservations.map((item) => (
            <div
              key={item.obs_id}
              style={{
                flex: "1 1 300px",
                minWidth: "250px",
                maxWidth: "350px",
                color: "rgba(0, 0, 0, 0.6)",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h4>{new Date(item.value).toLocaleDateString()}</h4>
              {item.children && item.children.length > 0 && (
                <ul style={{ paddingLeft: "15px" }}>
                  {item.children.map((child) => (
                    <li key={child.obs_id}>
                      {(() => {
                        let parsedValue = child.value;
                        if (typeof child.value === "string" && (child.value === "true" || child.value === "false")) {
                          parsedValue = (child.value === "true").toString();
                        }
                        return typeof parsedValue === "boolean"
                          ? String(child.name)
                          : `${String(child.name)}: ${String(parsedValue)}`;
                      })()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* View More / View Less Button */}
        {observations.length > 4 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                color: "rgba(0, 0, 0, 0.6)",
                cursor: "pointer",
                border: "none",
                background: "none",
                padding: 0,
              }}
            >
              {showAll ? "View Less" : "View More ..."}
            </button>
          </div>
        )}
      </>
    )}
  </WrapperBox>
</Panel>
</>
  );



}


export default AllergiesPanel;