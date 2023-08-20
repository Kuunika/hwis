"use client"
import AirwayAndBreathing from "@/components/forms/airwayAndBreathing";
import BloodCirculation from "@/components/forms/bloodCirculation";
import Consciousness from "@/components/forms/consciousness";
import PersistentPain from "@/components/forms/persistentPain";
import TriageTable from "@/components/forms/table";
import Vitals from "@/components/forms/vitals";
import {useState} from "react"
import { MainCard,StepperContainer } from 'shared-ui/src';


export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(0)
  const steps =[
    {id: 1, label: "Vitals"},
    {id: 2, label: "Airway/Breathing"},
    {id: 3, label: "Blood Circulation"},
    {id: 4, label: "Consciousness"},
    {id: 5, label: "Persistent Pain/Other Concerns"},
    {id: 6, label: "Table"}
  ];
  return (
    <>
      <MainCard
        elevation={2}
        sx={{
          mx: "2ch",
          my: "2ch",
          alignItems: "center",
        }}
      >
        <h1>Triage</h1>
        <StepperContainer steps={steps} active={activeStep}>
          <Vitals onSubmit={() => setActiveStep(1)} />
          <AirwayAndBreathing onSubmit={() => setActiveStep(2)} />
          <BloodCirculation onSubmit={() => setActiveStep(3)} />
          <Consciousness onSubmit={() => setActiveStep(4)} />
          <PersistentPain onSubmit={() => setActiveStep(5)} />
          <TriageTable/>
        </StepperContainer>
      </MainCard>
    </>
  );
}
