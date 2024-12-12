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

function DrugHistoryPanel() {
    const { params } = useParameters();
    const { data: medicationData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);

    const meidicationEncounters = Array.isArray(medicationData)
    ? medicationData.filter((item) => item.encounter_type?.name === 'PRESCRIPTION')
    : [];

  useEffect(() => {
    if (!historyLoading) {
        const observations: ProcessedObservation[] = [];

        meidicationEncounters?.forEach((encounter: { obs: Observation[] }) => {
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
  },[medicationData])

return (
    <>
    
        <Panel title="Drug History">
            <WrapperBox>
            <div>
              {observations.map(item => (
                  <div key={item.obs_id} style={{  marginTop:'20px', color:'rgba(0, 0, 0, 0.6)' }}>
                    <b>{item.name}</b>
                      {item.children && item.children.length > 0 && (
                          <>
                              {item.children.map(child => (
                                  <p key={child.obs_id}>
                                      {child.name}{(child.value === "true")?null:`:${child.value}`}
                                  </p>
                              ))}
                          </>
                      )}
                  </div>
              ))}
            </div>
            </WrapperBox>
        </Panel>
    </>
  );



}


export default DrugHistoryPanel;