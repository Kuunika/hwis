"use client";;
import { Panel } from "@/app/patient/components/panels";
import { WrapperBox } from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useEffect, useState } from "react";
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

interface PresentingComplaintsPanelProps {

  showForPrinting: boolean;
  toggleShow: (value: boolean) => void;

}



const PresentingComplaintsPanel: React.FC<PresentingComplaintsPanelProps> = ({ showForPrinting, toggleShow }: PresentingComplaintsPanelProps) => {
    const { params } = useParameters();
    const { data: complaintsData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);

    const complaintsEncounters = Array.isArray(complaintsData)
    ? complaintsData.filter((item) => item.encounter_type?.name === 'PRESENTING COMPLAINTS')
    : [];

      const displayedObservations = showForPrinting ? observations : observations.slice(0, 3);

  useEffect(() => {
    if (!historyLoading) {
      const observations: ProcessedObservation[] = [];

        complaintsEncounters?.forEach((encounter: { obs: Observation[] }) => {
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
      });}
    
  },[complaintsData])

return (
    <>
    
        <Panel title="Presenting Complaints">
            <WrapperBox>
                  {historyLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "180px",
                      }}
                    >
                      <CircularProgress size={40} />
                    </div>
                  ) : (
                    <>
                    {displayedObservations.length === 0 ? (<p>No presenting complaints available</p>):(<>
            <div>
              {displayedObservations.map(item => (
                  <div key={item.obs_id} style={{ marginBottom: "20px", color:'rgba(0, 0, 0, 0.6)' }}>
                      {(item.name == 'Presenting complaint') && <p>{item.value}</p>}
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
                {observations.length > 3 && (
                  <button 
                    onClick={() => toggleShow(!showForPrinting)} 
                    style={{ color: 'rgba(0, 0, 0, 0.6)', cursor: "pointer", border: "none", background: "none", padding: 0 }}
                  >
                    {showForPrinting ? "View Less" : "View More..."}
                  </button>
                )}

            </div></>)}
            </>)}
            </WrapperBox>
        </Panel>
    </>
  );



}


export default PresentingComplaintsPanel;