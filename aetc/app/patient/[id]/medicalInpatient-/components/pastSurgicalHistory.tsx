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
  value?: any;
  value_text?: any;
  names: { name: string }[];
  children?: Observation[]; // To support nested children
}

interface ProcessedObservation {
  obs_id: number | null;
  name: string | undefined;
  value?: any;
  value_text?: any;
  children: ProcessedObservation[];
}
interface PastSurgicalHistoryPanelProps {

    showForPrinting: boolean | null;
    toggleShow: (value: boolean) => void;
  }
  
  
  
  const PastSurgicalHistoryPanel: React.FC<PastSurgicalHistoryPanelProps> = ({ showForPrinting , toggleShow}: PastSurgicalHistoryPanelProps) => {

    const { params } = useParameters();
    const { data: historicData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);

    const displayedObservations = showForPrinting ? observations : observations.slice(0, 4);


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
            children: observation.children
              ? observation.children.map((child) => ({
                  obs_id: child.obs_id,
                  name: child.names?.[0]?.name,
                  value_text: child.value_text,
                  children: [],
                }))
              : [],
          };
          observations.push(obsData);

        })
        console.log(observations)
            setObservations(observations)
        });

        }

  },[historicData])

return (
    <>
<Panel title="Surgeries">
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
      {displayedObservations.length === 0 ? ( <p>No surgical history available</p>):(<>
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
                        let parsedValue = child.value_text;
                        if (typeof child.value_text === "string" && (child.value_text === "true" || child.value_text === "false")) {
                          parsedValue = Boolean(parsedValue);
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
              onClick={() => toggleShow(!showForPrinting)}
              style={{
                color: "rgba(0, 0, 0, 0.6)",
                cursor: "pointer",
                border: "none",
                background: "none",
                padding: 0,
              }}
            >
              {showForPrinting ? "View Less" : "View More ..."}
            </button>
          </div>
        )}
        </>        
        )}
      </>
    )}
  </WrapperBox>
</Panel>
</>
  );



}


export default PastSurgicalHistoryPanel;