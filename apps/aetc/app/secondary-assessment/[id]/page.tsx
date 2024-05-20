"use client";;
import { useState } from "react";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { getPatientsEncounters } from "@/hooks/encounter";
import { NewStepperContainer } from "shared-ui/src";
import { useNavigation, useParameters } from "@/hooks";
import { GeneralForm } from "../components/generalForm";
import { HeadAndNeckForm } from "../components/headAndNeckForm";
import { PatientInfoTab } from "@/components";
import { ChestForm } from "../components/chestForm";



const secondaryAssessment = () => {

  const { navigateTo, navigateBack } = useNavigation();
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});

  const steps = [
    { id: 0, label: "General" },
    { id: 1, label: "Head and Neck" },
    { id: 2, label: "Chest" },
    { id: 3, label: "Abdomen" },
    { id: 4, label: "Extremities" },
  ];
  
  const handleGeneralSubmit = (values: any)=>{
    console.log(values);
    formData["general"] = values;
    setActiveStep(1);
  };

  const handleHeadAndNeckSubmit = (values: any)=>{
    console.log(values);
    formData["headAndNeck"] = values;
    setActiveStep(2);
  };

  const handleChestSubmit = (values: any)=>{
    console.log(values);
    formData["chest"] = values;
    setActiveStep(3);
  };

  return (
    <>
<PatientInfoTab />
<NewStepperContainer
  setActive={(value)=>{setActiveStep(value);}}
  title="Secondary assessment"
  steps={steps}
  active={activeStep}
  onBack={() => navigateBack()}
>
<GeneralForm
onSubmit={handleGeneralSubmit}
/>
<HeadAndNeckForm
onSubmit={handleHeadAndNeckSubmit}
/>
<ChestForm onSubmit={handleChestSubmit}/>
</NewStepperContainer>


    </>
  );
}
export default AuthGuard(secondaryAssessment, [roles.CLINICIAN, roles.NURSE, roles.ADMIN]);
