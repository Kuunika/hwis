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
  children?: Observation[]; 
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


    const allergiesEncounters = historicData?.filter((item) => item.encounter_type.name === "Allergies");
 

  useEffect(() => {
    if (!historyLoading) {

            const observations: ProcessedObservation[] = [];
      
            allergiesEncounters?.forEach((encounter: { obs: Observation[] }) => {
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
      
            const mergeObservations = (data: any[] | undefined) => {
              const merged: any[] = [];
              
              data?.forEach(item => {
                  if(item.name !=='Allergy comment'){
                  let existing = merged.find(mergedItem => mergedItem.name === item.name);
                  
                  if (!existing) {
                      merged.push({ ...item, children: [...item.children] });
                  } else {
                      const childMap = new Map();
                      [...existing.children, ...item.children].forEach(child => {
                          const key = `${child.name}_${child.value}`;
                          childMap.set(key, child);
                      });
                      existing.children = Array.from(childMap.values());
                  }
                }
              });
          
              return merged;
          };
          
          const mergedData = mergeObservations(observations);
          setObservations(mergedData);

        }

  },[historicData])

return (
    <>
<Panel title="Allergies">
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
      {observations.length === 0 ? ( <p>No allergy history available</p>):(<>
          <div           style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "flex-start",
          }}>
            {observations.map(item => (
                <div key={item.obs_id} style={{ marginBottom: "20px", marginLeft:"10px", color:'rgba(0, 0, 0, 0.6)' }}>
                    <h4>{item.value}</h4>
                    {item.children && item.children.length > 0 && (
                        <ul style={{ paddingLeft: "15px" }}>
                            {item.children.map(child => (
                                <li key={child.obs_id}>
                                    {child.name}: {child.value}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div></>)}
        </>
    )}
  </WrapperBox>
</Panel>
</>
  );



}


export default AllergiesPanel;