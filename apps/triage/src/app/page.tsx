"use client"
import AirwayAndBreathing from "@/components/forms/airwayAndBreathing";
import BloodCirculation from "@/components/forms/bloodCirculation";
import Consciousness from "@/components/forms/consciousness";
import PersistentPain from "@/components/forms/persistentPain";
import {useState} from "react"
import { MainCard,StepperContainer } from 'shared-ui/src';


export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(0)
  const steps =[
    {id: 1, label: "Airway and Breathing"},
    {id: 2, label: "Blood Circulation"},
    {id: 3, label: "Consciousness"},
    {id: 4, label: "Persistent Pain/Other Concerns"}
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
          <AirwayAndBreathing onSubmit={() => setActiveStep(1)} />
          <BloodCirculation onSubmit={() => setActiveStep(2)} />
          <Consciousness onSubmit={()=> setActiveStep(3)}/>
          <PersistentPain onSubmit={()=> setActiveStep(4)}/>
        </StepperContainer>
      </MainCard>
    </>
  );
}
