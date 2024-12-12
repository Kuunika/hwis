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

    const sampleHistoryEncounters = Array.isArray(historicData)
    ? historicData.filter((item) => item.encounter_type?.name === 'DIAGNOSIS' || item.encounter_type.name === "SURGICAL HISTORY")
    : [];

  useEffect(() => {
    if (!historyLoading) {
        const observations: ProcessedObservation[] = [];
        console.log(sampleHistoryEncounters)

        //Check HIV status
        const hasAIDS = sampleHistoryEncounters.some(encounters =>
                encounters.obs.some(observation => 
                    observation.names.some(name => name.name === "Acquired immunodeficiency syndrome")
        ));

        if(hasAIDS) setHIVStatus('Positive'); 
                
        sampleHistoryEncounters?.forEach((encounter: { obs: Observation[] }) => {
        encounter.obs.forEach((observation) => {
          const value = observation.value;
      
          // Format the observation data
          const obsData: ProcessedObservation = {
            obs_id: observation.obs_id,
            name: observation.names?.[0]?.name,
            value,
            children: [],
          };
      
          if (observation.obs_group_id) {
            // Find the parent observation and group it
            const parent = observations.find((o) => o.obs_id === observation.obs_group_id);
            if (parent) {
              parent.children.push(obsData);
            }
          } else {
            // Add it to the top-level observations
            observations.push(obsData);
          }
        })
            setObservations(observations)
        });
        }
  },[historicData])

return (
    <>
    
        <Panel title="Past Medical History">
            <WrapperBox>
            <div>
            <p>
            <b>
                HIV Status:
            </b>
            {HIVStatus}</p>
            </div>
            </WrapperBox>
        </Panel>
    </>
  );



}


export default PastMedicalHistoryPanel;