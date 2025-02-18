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

function PastMedicalHistoryPanel() {
    const { params } = useParameters();
    const { data: historicData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);
    const [HIVInfo, setHIVInfo] = useState({
      status: 'Unknown',
      onTreatment: 'Unknown'
    });
    

    const updateHIVStatus = (status: string) => {
      setHIVInfo(prev => ({ ...prev, status }));
    };
    
    const updateOnHIVTreatment = (onTreatment: string) => {
      setHIVInfo(prev => ({ ...prev, onTreatment }));
    };
    

    

    const sampleHistoryEncounters = historicData?.filter((item) => item.encounter_type?.name === 'DIAGNOSIS' || item.encounter_type.name === "SURGICAL HISTORY");
 

  useEffect(() => {
    if (!historyLoading) {
        const observations: ProcessedObservation[] = [];
        const hasAIDS = sampleHistoryEncounters?.filter(encounter =>
          encounter.obs.some(observation => 
              observation.value?.includes("1C62.Z") 
          )
      );

        if(hasAIDS && hasAIDS.length > 0) updateHIVStatus("Positive");
        
        

        const hasAIDSObservations = sampleHistoryEncounters
  ?.flatMap(encounter => 
      encounter.obs.filter(observation => 
          observation.value?.includes("HIV")
      )
  );

const latestObsGroupId = hasAIDSObservations ? Math.max(...hasAIDSObservations.map(obs => obs.obs_group_id).filter(id => id !== null)) : null;

const onTreatmentObservation = sampleHistoryEncounters
  ?.flatMap(encounter => 
      encounter.obs.filter(observation => 
          observation.obs_group_id === latestObsGroupId && 
          observation.names?.[0]?.uuid === concepts.ON_TREATMENT
      )
  )?.[0]; 

const onTreatmentValue = onTreatmentObservation?.value || null;

if(onTreatmentValue) updateOnHIVTreatment(onTreatmentValue);

       
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


        console.log(hasAIDS);
        }

  },[historicData])

return (
    <>
        <Panel title="Past Medical History">
            <WrapperBox sx={{ height: "180px" }}>
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
                                <> { observations.length === 0 ? ( <p>No past medical history available</p>):(<>
            <div>
            <p><b style={{color: "rgba(0, 0, 0, 0.6)"}}>
                HIV Status:
                </b>
            {HIVInfo.status}
            </p>
            <p><b style={{color: "rgba(0, 0, 0, 0.6)"}}>
                On antiretroviral treatment:
                </b>
            {HIVInfo.onTreatment}
            </p>
            <p><b style={{color: "rgba(0, 0, 0, 0.6)"}}>
              HIV Drug(s) used:
                </b>
                ??
            </p>
            <p><b style={{color: "rgba(0, 0, 0, 0.6)"}}>
              Start of HIV Drug usage:
                </b>
                ??
            </p>
            <p><b style={{color: "rgba(0, 0, 0, 0.6)"}}>
             HIV Clinic:
                </b>
??
            </p>
            </div> </>)}
            </>)}
            </WrapperBox>
        </Panel>
    </>
  );



}


export default PastMedicalHistoryPanel;