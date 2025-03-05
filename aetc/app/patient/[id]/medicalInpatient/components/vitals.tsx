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

function VitalsPanel() {
    const { params } = useParameters();
    const { data: historicData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);
    const [bP, setBP] = useState<string>("No BP data available");
    const [heartRate, setHeartRate] = useState<string>("No heart rate data available");
    const [respiratoryRate, setRespiratoryRate] = useState<string>("No respiratory rate data available");
    const [temperature, setTemperature] = useState<string>("No temperature data available");
 

  useEffect(() => {
    if (!historyLoading) {

        const vitalsEncounters = historicData?.filter((item) => item.encounter_type?.name === 'VITALS');
        const vitalsObs = vitalsEncounters && vitalsEncounters.length > 0 ? vitalsEncounters[0].obs : null;
        if(vitalsObs){

              const sortedVitals = [...vitalsObs].sort((a, b) => 
                  new Date(b.obs_datetime).getTime() - new Date(a.obs_datetime).getTime()
                );
                const systolicObs = sortedVitals?.filter((item)=> item.names[0].name === 'Blood Pressure Systolic' || item.names[0].name === 'Systolic blood pressure');
                const systolic = (systolicObs[0]?.value);
                
                
                const diastolicObs = sortedVitals?.filter((item)=> item.names[0].name === 'Blood Pressure Diastolic' || item.names[0].name === 'Diastolic blood pressure');
                const diastolic = (diastolicObs[0]?.value);
                if(systolic && diastolic) setBP(`${systolic}/${diastolic} mmHg`);

                const heartRateObs = sortedVitals?.filter((item)=> item.names[0].name === 'Pulse');
                const heartRate = (heartRateObs[0]?.value);
                if(heartRate > 0) setHeartRate(`${heartRate} bpm`);

                const respiratoryRateObs = sortedVitals?.filter((item)=> item.names[0].name === 'Respiratory rate');
                const respiratoryRate = (respiratoryRateObs[0]?.value);
                if(respiratoryRate) setRespiratoryRate(`${respiratoryRate} bs/m`);

                const temperatureObs = sortedVitals?.filter((item)=> item.names[0].name === 'Temperature (c)');
                const temperature = (temperatureObs[0]?.value);
                if(temperature) setTemperature(`${temperature} °C`);

        }
    }

  },[historicData])

return (
    <>
        <Panel title="Vital signs">
            <WrapperBox >
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
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <p><b style={{color: "rgba(0, 0, 0, 0.6)"}}>BP:</b> {bP}</p>
            <p><b style={{color: "rgba(0, 0, 0, 0.6)"}}>Pulse Rate:</b> {heartRate}</p>
            <p><b style={{color: "rgba(0, 0, 0, 0.6)"}}>Respiratory Rate:</b> {respiratoryRate}</p>
            <p><b style={{color: "rgba(0, 0, 0, 0.6)"}}>Temperature:</b> {temperature}</p>
            </div> 
            </>)}
            </WrapperBox>
        </Panel>
    </>
  );



}


export default VitalsPanel;