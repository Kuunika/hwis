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

interface PastSurgicalHistoryPanelProps {

    showForPrinting: boolean | null;
    toggleShow: (value: boolean) => void;
  }
  
  
  
  const SocialHistoryPanel: React.FC<PastSurgicalHistoryPanelProps> = ({ showForPrinting , toggleShow}: PastSurgicalHistoryPanelProps) => {

    const { params } = useParameters();
    const { data: historicData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<Observation[]>([]);

    const displayedObservations = showForPrinting ? observations : observations.slice(0, 4);


    const sampleHistoryEncounters = historicData?.filter((item) => item.encounter_type.name === "SOCIAL HISTORY");
  console.log("sampleHistoryEncounters", sampleHistoryEncounters)
    useEffect(() => {
    if (!historyLoading && sampleHistoryEncounters && sampleHistoryEncounters.length > 0) {
        const socialObs = sampleHistoryEncounters[0]?.obs;
        const socialObsArray = Object.values(socialObs);

        const mostRecentObs: Record<string, any> = {};

        socialObsArray.forEach((obs) => {
                const obsName = obs.names?.[0]?.name;
                if (!obsName || obsName === 'Other') return; 

                if (!mostRecentObs[obsName] || new Date(obs.obs_datetime) > new Date(mostRecentObs[obsName].obs_datetime)) {
                    mostRecentObs[obsName] = obs;
                }
            });


    const mostRecentObsArray = Object.values(mostRecentObs);

    setObservations(mostRecentObsArray);


    }
  },[historicData])

return (
    <>
<Panel title="Social History">
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
                  <h4>
                    {item.names[0].name === "Contact marital status"
                        ? "Marital Status"
                        : item.names[0].name === "Main activity"
                        ? "Occupation"
                        : item.names[0].name}
                </h4>
                    <p>{item.value}</p>
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
  </WrapperBox>
</Panel>
</>
  );



}


export default SocialHistoryPanel;