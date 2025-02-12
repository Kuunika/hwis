"use client";;
import { Panel } from "@/app/patient/components/panels";
import { WrapperBox } from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
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
    const [HIVStatus, setHIVStatus] = useState('Unknown');

    const sampleHistoryEncounters = historicData?.filter((item) => item.encounter_type?.name === 'DIAGNOSIS' || item.encounter_type.name === "SURGICAL HISTORY");
 

  useEffect(() => {
    if (!historyLoading) {
        const observations: ProcessedObservation[] = [];
        const hasAIDS = sampleHistoryEncounters?.filter(encounters =>
            encounters.obs.some(observation => 
            observation.value === "1C62.Z, Human immunodeficiency virus disease without mention of associated disease or condition, clinical stage unspecified")
        );

        if(hasAIDS && hasAIDS.length > 0) setHIVStatus('Positive');
        
       
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
            <WrapperBox>
            <div>
            <p><b>
                HIV Status:
                </b>
            {HIVStatus}
            </p>
            </div>
            </WrapperBox>
        </Panel>
    </>
  );



}


export default PastMedicalHistoryPanel;