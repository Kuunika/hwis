"use client";;
import { Panel } from "@/app/patient/components/panels";
import { WrapperBox } from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Key, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Obs } from "@/interfaces";


function AllergiesPanel() {
    const { params } = useParameters();
    const { data: historicData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<Obs[]>([]);


    const allergiesEncounters = historicData?.filter((item) => item.encounter_type.name === "Allergies");
  

  useEffect(() => {
    
    if (!historyLoading && historicData) {
      if (allergiesEncounters) {
        const obs = allergiesEncounters[0]?.obs;
        const merged: any[] = [];
              
              obs?.forEach(item => {
                  let existing = merged.find(mergedItem => mergedItem.value === item.value);
                  
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
                
              });

        const filteredmerged = merged?.filter((o) => o.children.length !== 0);
        setObservations(filteredmerged??[]);
      }
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
                                    {child.value}
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