"use client";;
import { Panel } from "@/app/patient/components/panels";
import { WrapperBox } from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Obs } from "@/interfaces";

interface Observation {
  obs_id: number | null;
  obs_group_id: number | null;
  value: any;
  names: { name: string }[];
  children?: Obs[]; // To support nested children
}

interface ProcessedObservation {
  obs_id: number | null;
  name: string | undefined;
  value: any;
  children: ProcessedObservation[];
}

function HeadAndNeckPanel() {
    const { params } = useParameters();
    const { data: historicData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<(Obs|null)[]>([]);

 

  useEffect(() => {
    if (!historyLoading) {

        const headAndNeckEncounters = historicData?.filter((item) => item.encounter_type?.name === "HEAD AND NECK ASSESSMENT");
        const headAndNeckObs = headAndNeckEncounters && headAndNeckEncounters.length > 0 ? headAndNeckEncounters[0].obs : null;
        const filteredHeadAndNeckObs = headAndNeckObs?.filter((o) => o.obs_group_id === null);
        if(filteredHeadAndNeckObs){

            const sortedObs = [...filteredHeadAndNeckObs].sort((a, b) => 
                  new Date(b.obs_datetime).getTime() - new Date(a.obs_datetime).getTime()
                );
            
                const seen = new Set();
                const dedupedObs = sortedObs.map(element => {
                      if (seen.has(element.value)) return null;
                      seen.add(element.value);
                
                      const matches = observations.filter(item => item?.value === element.value && item !== element);
                
                      matches.forEach(match => {
                          if (match?.children) {
                              element.children = [...(element.children || []), ...match.children];
                          }
                      });
                
                      return element;
                  })
                  .filter(Boolean);
            console.log(dedupedObs)
            setObservations(dedupedObs);

        }
    }

  },[historicData])

return (
    <>
        <Panel title="Head and Neck">
            <WrapperBox >
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
              {observations.map((item) => (
                <div
                  key={item?.obs_id}
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
                    {item?.value }

                </h4>
                {item?.children?.map((detail) => (
                    <p>{detail.value}</p>
                ))}

                </div>
              ))}
            </div>
    
           
          </>
        )}
            </WrapperBox>
        </Panel>
    </>
  );



}


export default HeadAndNeckPanel;