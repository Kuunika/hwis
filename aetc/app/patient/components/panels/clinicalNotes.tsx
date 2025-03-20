import { MainButton, MainTypography, WrapperBox } from "@/components";
import { Panel } from ".";
import { FaExpandAlt, FaRegChartBar } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect, use } from "react";
import MarkdownEditor from "@/components/markdownEditor";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid } from "@mui/material";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { concepts, encounters } from "@/constants";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { Obs } from "@/interfaces";
import { VisitTable } from "../visits/visitTable";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";



export const ClinicalNotes = () => {

  //-------------------------------------------

  const [clinicalNotes, setClinicalNotes] = useState<
    Array<{ note: string | null; creator: string; time: any }>
  >([]);
  
  const { mutate, isSuccess, isPending, isError, data } = addEncounter();
  const { params } = useParameters();
  const { data:pData } = getPatientsEncounters(params.id as string);
  const { data: patient } = getOnePatient(params.id as string);

  const {
    data: patientEncounters,
    isLoading,
    isSuccess: encountersFetched,
  } = getPatientsEncounters(params.id as string);

  //---------------------------------------
  const [traumaMessage, setDisabilityMessage] = useState<string | null>(null);
  const [circulationMessage, setCirculationMessage] = useState<string | null>(null);

  useEffect(()=>{
    if (!pData) return;
    const reviewOfSystemsEncounter = pData.find(
      (d) => d.encounter_type.uuid === encounters.CIRCULATION_ASSESSMENT
    );

    const activelyBleddingObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.IS_PATIENT_ACTIVELY_BLEEDING)
    );
    const actionDoneObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.ACTION_DONE)
    );
    // const pulseObs = reviewOfSystemsEncounter?.obs.find(
    //   (ob) => ob.names.some((n) => n.name === concepts.pulse)
    // );
    const pulseRateObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.PULSE_RATE)
    );
    const capillaryRefillTimeObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.CAPILLARY_REFILL_TIME)
    );
    const cprDateOfCallObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.DATE_OF_CPR)
    );
    // const cprTimeOFCallObs = reviewOfSystemsEncounter?.obs.find(
    //   (ob) => ob.names.some((n) => n.name === concepts.TIME OF CALL)
    // );
    const cprCardiacArrestObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.CARDIAC_ARREST)
    );
    const cprSiteObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.SITE)
    );
    const cprSpecifyObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.SPECIFY)
    );
    const cprRecord1TimeObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.TIME)
    );
    const cprRecord1RhythmObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.RHYTHM)
    );
    const cprRecord1ShockEnergyObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.SHOCK_ENERGY)
    );
    const cprRecord1MedicationNameObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.MEDICATION)
    );
    const cprRecord1DoseNameObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.DOSE_IN_MILLIGRAMS)
    );
    const cprRecord1RouteObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.MEDICATION_ROUTE)
    );
    const cprRecord1IntervationsObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.INTERVENTION)
    );
    const cprRecord1OccurrencesObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.OCCURRENCES)
    );
    const cprRecord1OReversibleCausesObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.REVERSIBLE_CAUSES)
    );
    const cprRecord1CardicaArrestObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.CARDIAC_ARREST)
    );
    const cprROSCspo2Obs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.SPO2)
    );
    const cprOxygenObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.OXYGEN_GIVEN)
    );
    const cprSystolicObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.SYSTOLIC_BLOOD_PRESSURE)
    );
    const cprDystoricObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.DIASTOLIC_BLOOD_PRESSURE)
    );
    const cprRespirotyObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.RESPIRATORY_RATE)
    );
    const cprPulseObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.PULSE_RATE)
    );
    const cprTemperatureObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.TEMPERATURE)
    );
    const cprMotorResponseObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.MOTOR_RESPONSE)
    );
    const cprVerbalResponseObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.VERBAL_RESPONSE)
    );
    const cprEyeOpeningResponseObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.EYE_OPENING_RESPONSE)
    );
    const cprTimeStoppedObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.CPR_TIME_STOPPED)
    );
    const cprREASONTimeStoppedObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.REASON_CPR_STOPPED)
    );
    const cprDispositionObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.DISPOSITION_AFTER_CPR)
    );
    const cprTeamReaderObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.TEAM_LEADER)
    );
    const cprTeamMemberrObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.TEAM_MEMBERS)
    );




    // const patientPulseObs = reviewOfSystemsEncounter?.obs.find(
    //   (ob) => ob.names.some((n) => n.name === concepts.)
    // );
    // //Does the patient have a pulse 
    const mucuousObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.MUCOUS_MEMBRANES)
    );
    const mucuouAbnormalObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.MUCOUS_ABNORMAL)
    );
    const assessPeripheriesObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.ASSESS_PERIPHERIES)
    );
    const bloodPressureMeasuredObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.BLOOD_PRESSURE_MEASURED)
    );
    const bloodPressurSystolicObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.BLOOD_PRESSURE_SYSTOLIC)
    );
    const bloodPressurDystolicObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.BLOOD_PRESSURE_DIASTOLIC)
    );
    const bloodPressurNotDoneObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.NOT_DONE)
    );
    const BPUnrecordableObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.BP_NOT_RECORDABLE)
    );

    const patientInjuredObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.PATIENT_INJURED)
    );
    const intravenousAccessObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.INTRAVENOUS)
    );
    const abdominalDistentionObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.ABDOMINAL_DISTENSION)
    );
    const otherAbnormalitiesObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.IS_THERE_OTHER_OBDONORMALITIES)
    );

    let messages = [];

    if(activelyBleddingObs?.value == "Yes"){
      messages.push("• The patient is actively bleeding")
    }else{
      messages.push("• The patient is not actively bleeding")
    }
    if (actionDoneObs?.value) {
      messages.push(`• Action Done when the patient is actively bleeding: ${actionDoneObs.value}`);
    } 
  
    if(pulseRateObs?.value == "Weak"){
      messages.push("• The  patient's Purse Rate is weak")
    }else if(pulseRateObs?.value == "Strong,Regular"){
      messages.push("• The  patient's Purse Rate is Strong,Regular ")
    }else{
      messages.push("• The  patient's Purse Rate is Irregular")
    }
    
    if(capillaryRefillTimeObs?.value == "Less than 3 seconds"){
      messages.push("• The  patient's Capillary refill time is Less than 3 seconds")
    }else if(pulseRateObs?.value == "3 seconds"){
      messages.push("• The  patient's Capillary refill time is 3 seconds")
    }else{
      messages.push("• The  patient's Capillary refill time is More than 3 seconds")
    }

    // if (additionalNotesObs?.value) {
    //   messages.push(`• Additional Notes: ${additionalNotesObs.value}`);
    // } else {
    //   messages.push("• Additional Notes: Not reported.");
    // }

    if(cprDateOfCallObs?.value ){
      messages.push(`• Additional Notes: ${cprDateOfCallObs.value}`);
    }

    //messages.push(`• CPR Date of Call: ${cprDateOfCallObs?.value || ""}`);

    if(cprCardiacArrestObs?.value == "Yes"){
      messages.push("• There is Witnessed Cardiac Arrest")
    }else if(cprCardiacArrestObs?.value == "No"){
      messages.push("• There is No Witnessed Cardiac Arrest")
    }

    if(cprSiteObs?.value == "Rescitation"){
      messages.push("• The Site is Rescitation")
    }else if(cprCardiacArrestObs?.value == "SSW"){
      messages.push("• The Site is SSW")
    }else if(cprCardiacArrestObs?.value == "Priority"){
      messages.push("• The Site is Priority")
    }

    // messages.push(`• Witnessed Cardiac Arrest specification: ${cprSpecifyObs?.value || ""}`);
    // messages.push(`• Record Time: ${cprRecord1TimeObs?.value || ""}`);
    // messages.push(`• Rhythm: ${cprRecord1RhythmObs?.value || ""}`);
    // messages.push(`• Shock Energy: ${cprRecord1ShockEnergyObs?.value || ""}`);
    // messages.push(`• Medication Name: ${cprRecord1MedicationNameObs?.value || ""}`);
    // messages.push(`• Dose Name: ${cprRecord1DoseNameObs?.value || ""}`);
    // messages.push(`• Medication Route: ${cprRecord1RouteObs?.value || ""}`);
    // messages.push(`• Interventions: ${cprRecord1IntervationsObs?.value || ""}`);
    // messages.push(`• Occurrences: ${cprRecord1OccurrencesObs?.value || ""}`);
    // messages.push(`• Reversible Causes: ${cprRecord1OReversibleCausesObs?.value || ""}`);
    // messages.push(`• Likely or known cause of cardiac arrest: ${cprRecord1CardicaArrestObs?.value || ""}`);
    // messages.push(`• SPO2: ${cprROSCspo2Obs?.value || ""}`);

    if (cprSpecifyObs?.value) {
      messages.push(`• Witnessed Cardiac Arrest specification: ${cprSpecifyObs.value}`);
    }
    
    if (cprRecord1TimeObs?.value) {
      messages.push(`• Record Time: ${cprRecord1TimeObs.value}`);
    }
    
    if (cprRecord1RhythmObs?.value) {
      messages.push(`• Rhythm: ${cprRecord1RhythmObs.value}`);
    }
    
    if (cprRecord1ShockEnergyObs?.value) {
      messages.push(`• Shock Energy: ${cprRecord1ShockEnergyObs.value}`);
    }
    
    if (cprRecord1MedicationNameObs?.value) {
      messages.push(`• Medication Name: ${cprRecord1MedicationNameObs.value}`);
    }
    
    if (cprRecord1DoseNameObs?.value) {
      messages.push(`• Dose Name: ${cprRecord1DoseNameObs.value}`);
    }
    
    if (cprRecord1RouteObs?.value) {
      messages.push(`• Medication Route: ${cprRecord1RouteObs.value}`);
    }
    
    if (cprRecord1IntervationsObs?.value) {
      messages.push(`• Interventions: ${cprRecord1IntervationsObs.value}`);
    }
    
    if (cprRecord1OccurrencesObs?.value) {
      messages.push(`• Occurrences: ${cprRecord1OccurrencesObs.value}`);
    }
    
    if (cprRecord1OReversibleCausesObs?.value) {
      messages.push(`• Reversible Causes: ${cprRecord1OReversibleCausesObs.value}`);
    }
    
    if (cprRecord1CardicaArrestObs?.value) {
      messages.push(`• Likely or known cause of cardiac arrest: ${cprRecord1CardicaArrestObs.value}`);
    }
    
    if (cprROSCspo2Obs?.value) {
      messages.push(`• SPO2: ${cprROSCspo2Obs.value}`);
    }

    if(cprOxygenObs?.value == "Yes"){
      messages.push("• There is Oxygen")
    }else if(cprOxygenObs?.value == "No"){
      messages.push("• There is no Oxygen")
    }

    // messages.push(`• Systolic: ${cprSystolicObs?.value || ""}`);
    // messages.push(`• Diastolic: ${cprDystoricObs?.value || ""}`);
    // messages.push(`• Respiratory Rate: ${cprRespirotyObs?.value || ""}`);
    // messages.push(`• Pulse Rate: ${cprPulseObs?.value || ""}`);
    // messages.push(`• Temperature: ${cprTemperatureObs?.value || ""}`);

    if (cprSystolicObs?.value) {
      messages.push(`• Systolic: ${cprSystolicObs.value}`);
    }
    
    if (cprDystoricObs?.value) {
      messages.push(`• Diastolic: ${cprDystoricObs.value}`);
    }
    
    if (cprRespirotyObs?.value) {
      messages.push(`• Respiratory Rate: ${cprRespirotyObs.value}`);
    }
    
    if (cprPulseObs?.value) {
      messages.push(`• Pulse Rate: ${cprPulseObs.value}`);
    }
    
    if (cprTemperatureObs?.value) {
      messages.push(`• Temperature: ${cprTemperatureObs.value}`);
    }


    if(cprMotorResponseObs?.value == "Obeying Commands"){
      messages.push("• Motor Response is Obeying Commands")
    }else if(cprMotorResponseObs?.value == "Localising"){
      messages.push("• Motor Response is Localising")
    }else if(cprMotorResponseObs?.value == "Withdraw"){
      messages.push("• Motor Response is Withdraw")
    }else if(cprMotorResponseObs?.value == "Normal Flexion"){
      messages.push("• Motor Response is Normal Flexion")
    }else if(cprMotorResponseObs?.value == "Extension"){
      messages.push("• Motor Response is Extension")
    }else if(cprMotorResponseObs?.value == "None"){
      messages.push("• No Motor Response ")
    }

    if(cprVerbalResponseObs?.value == "Oriented"){
      messages.push("• Verbal Response is Oriented")
    }else if(cprVerbalResponseObs?.value == "Confused"){
      messages.push("• Verbal Response is Confused")
    }else if(cprVerbalResponseObs?.value == "Inappropriate Words"){
      messages.push("• Verbal Response is Inappropriate Words")
    }else if(cprVerbalResponseObs?.value == "Incomprehensible sounds"){
      messages.push("• Verbal Response is Incomprehensible sounds")
    }else if(cprVerbalResponseObs?.value == "None"){
      messages.push("• There is no Verbal Response")
    }

    if(cprEyeOpeningResponseObs?.value == "Spontaneous"){
      messages.push("• Eye Opening Response is Spontaneous")
    }else if(cprEyeOpeningResponseObs?.value == "To Speech"){
      messages.push("• Eye Opening Response is To Speech")
    }else if(cprEyeOpeningResponseObs?.value == "To Pain"){
      messages.push("• Eye Opening Response is To Pain")
    }else if(cprEyeOpeningResponseObs?.value == "No Response"){
      messages.push("• There is no Eye Opening Response")
    }

    // messages.push(`• Reason CPR Stopped: ${cprTimeStoppedObs?.value || ""}`);
    // messages.push(`• CPR Time Stopped: ${cprREASONTimeStoppedObs?.value || ""}`);
    // messages.push(`• Disposition After CPR: ${cprDispositionObs?.value || ""}`);
    // messages.push(`• Team Leader: ${cprTeamReaderObs?.value || ""}`);
    // messages.push(`• Team Members: ${cprTeamMemberrObs?.value || ""}`);

    if (cprTimeStoppedObs?.value) {
      messages.push(`• Reason CPR Stopped: ${cprTimeStoppedObs.value}`);
    }
    
    if (cprREASONTimeStoppedObs?.value) {
      messages.push(`• CPR Time Stopped: ${cprREASONTimeStoppedObs.value}`);
    }
    
    if (cprDispositionObs?.value) {
      messages.push(`• Disposition After CPR: ${cprDispositionObs.value}`);
    }
    
    if (cprTeamReaderObs?.value) {
      messages.push(`• Team Leader: ${cprTeamReaderObs.value}`);
    }
    
    if (cprTeamMemberrObs?.value) {
      messages.push(`• Team Members: ${cprTeamMemberrObs.value}`);
    }



    // if(activelyBleddingObs?.value == "Yes"){
    //   messages.push("• The patient patient have a pulse")
    // }else{
    //   messages.push("• The patient does not have a pulse")
    // }

    if(mucuousObs?.value == "Normal"){
      messages.push("• Mucous membranes is Normal")
    }else{
      messages.push("• Mucous membranes is Abnormal")
    }

    messages.push(`• Mucus Abnormal: ${mucuouAbnormalObs?.value || ""}`);

    if(assessPeripheriesObs?.value == "Cold and clammy"){
      messages.push("• Assess Peripheries is Cold and clammy")
    }else{
      messages.push("• Assess Peripheries is Warm")
    }

    if(bloodPressureMeasuredObs?.value == "Done"){
      messages.push("• Blood Pressure is Measured ")
    }else if(bloodPressureMeasuredObs?.value == "Not Done"){
      messages.push("• Blood Pressure is not Measured")
    }else{
      messages.push("• BP is Unrecordable")
    }
    
    // messages.push(`• Blood Pressure Systolic: ${bloodPressurSystolicObs?.value || ""}`);
    // messages.push(`• Blood Pressure Distolic: ${bloodPressurDystolicObs?.value || ""}`);
    // messages.push(`• BP Unrecodable: ${BPUnrecordableObs?.value || ""}`);
    // messages.push(`• BP Not done: ${bloodPressurNotDoneObs?.value || ""}`);

    if (bloodPressurSystolicObs?.value) {
      messages.push(`• Blood Pressure Systolic: ${bloodPressurSystolicObs.value}`);
    }
    
    if (bloodPressurDystolicObs?.value) {
      messages.push(`• Blood Pressure Diastolic: ${bloodPressurDystolicObs.value}`);
    }
    
    if (BPUnrecordableObs?.value) {
      messages.push(`• BP Unrecordable: ${BPUnrecordableObs.value}`);
    }
    
    if (bloodPressurNotDoneObs?.value) {
      messages.push(`• BP Not done: ${bloodPressurNotDoneObs.value}`);
    }

    if(patientInjuredObs?.value == "Yes"){
      messages.push("•  The patient is injured")
    }else{
      messages.push("• The patient is not injured")
    }

    if(intravenousAccessObs?.value == "Yes"){
      messages.push("• The patient needs intravenous access")
    }else{
      messages.push("• The patient does not need intravenous access")
    }

    if(abdominalDistentionObs?.value == "Yes"){
      messages.push("• There is abdominal distention")
    }else{
      messages.push("• There is no abdominal distention")
    }

    if(otherAbnormalitiesObs?.value == "Yes"){
      messages.push("• There are other abnormalities")
    }else{
      messages.push("• There are no other abnormalities")
    }

    setCirculationMessage(messages.join("<br />"));

  }, [pData])

  useEffect(() => {
    if (!pData) return;
  
    const reviewOfSystemsEncounter = pData.find(
      (d) => d.encounter_type.uuid === encounters.DISABILITY_ASSESSMENT
    );
  
    const levelOfConsciousnessObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS)
    );
  
    const GCSObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.GCS)
    );
  
    const eyeOpeingObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name.toLowerCase() === concepts.EYE_OPENING_RESPONSE.toLowerCase())
    );
  
    const verbalResponseObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.VERBAL_RESPONSE)
    );
  
    const pupilSizeObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name.toLowerCase() === concepts.PUPIL_SIZE_AND_REACTION_TO_LIGHT.toLowerCase())
    );
  
    const focalNeurologyObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.FOCAL_NEUROLOGY)
    );
  
    const postureObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name.toLowerCase() === concepts.FOCAL_NEUROLOGY.toLowerCase())
    );
  
    let messages = [];
  
    if (levelOfConsciousnessObs?.value === "No") {
      messages.push("• The patient is alert and does not exhibit a low level of consciousness.");
    } else {
      messages.push("• The patient exhibits a low level of consciousness and requires further evaluation and monitoring.");
    }
  
    if (GCSObs?.value === 15) {
      messages.push("• The GCS is 15: patient is fully conscious with normal neurological function.");
    } else if (GCSObs?.value >= 13 && GCSObs?.value <= 14) {
      messages.push("• GCS is 13–14: Mild brain injury. Close monitoring advised.");
    } else if (GCSObs?.value >= 9 && GCSObs?.value <= 12) {
      messages.push("• GCS is 9–12: Moderate brain injury. Further assessment required.");
    } else if (GCSObs?.value >= 3 && GCSObs?.value <= 8) {
      messages.push("• GCS is 3–8: Severe brain injury or coma. Immediate intervention required.");
    } else {
      messages.push("• Invalid GCS score.");
    }
  
    if (eyeOpeingObs?.value == 4) {
      messages.push("• Eyes open spontaneously: patient is fully conscious.");
    } else if (eyeOpeingObs?.value == 3) {
      messages.push("• Eyes open to speech: mild impairment in consciousness.");
    } else if (eyeOpeingObs?.value == 2) {
      messages.push("• Eyes open to pain: more significant impairment in consciousness.");
    } else if (eyeOpeingObs?.value == 1) {
      messages.push("• No eye opening response: patient may be in a deep coma.");
    } else {
      messages.push("• Invalid eye opening response value.");
    }
  
    if (verbalResponseObs?.value == 5) {
      messages.push("• Verbal response is 5: patient is oriented and converses normally.");
    } else if (verbalResponseObs?.value == 4) {
      messages.push("• Verbal response is 4: patient is confused but able to speak.");
    } else if (verbalResponseObs?.value == 3) {
      messages.push("• Verbal response is 3: inappropriate words, not making sense.");
    } else if (verbalResponseObs?.value == 2) {
      messages.push("• Verbal response is 2: incomprehensible sounds, moaning or groaning.");
    } else if (verbalResponseObs?.value == 1) {
      messages.push("• Verbal response is 1: no verbal response, patient is unresponsive.");
    } else {
      messages.push("• Invalid verbal response value.");
    }
  
    messages.push(`• Pupil Size and Reaction to Light: ${pupilSizeObs?.value || "Not available"}`);
    messages.push(`• Focal Neurology: ${focalNeurologyObs?.value || "Not available"}`);
    messages.push(`• Posture: ${postureObs?.value || "Not available"}`);
  
 
    setDisabilityMessage(messages.join("<br />"));
  
  }, [pData]); 


const [additionalFieldsMessage, setAdditionalFieldsMessage] = useState<string | null>(null);
const [exposureMessage, setExposureMessage] = useState<string | null>(null);


useEffect(() => {
  if (!pData) return;

  const additionalFieldsEncounter = pData.find(
    (d) => d.encounter_type.uuid === encounters.EXPOSURE_ASSESSMENT 
  );

 
  const temperatureObs = additionalFieldsEncounter?.obs.find(
    (ob) => ob.names.some((n) => n.name === concepts.TEMPERATURE)
  );

  const additionalNotesObs = additionalFieldsEncounter?.obs.find(
    (ob) => ob.names.some((n) => n.name === concepts.ADDITIONAL_NOTES)
  );

  const descriptionObs = additionalFieldsEncounter?.obs.find(
    (ob) => ob.names.some((n) => n.name === concepts.DESCRIPTION)
  );

  const abnormalityDescriptionObs = additionalFieldsEncounter?.obs.find(
    (ob) => ob.names.some((n) => n.name === concepts.ABNORMALITY_DESCRIPTION)
  );

  const injuryDescriptionObs = additionalFieldsEncounter?.obs.find(
    (ob) => ob.names.some((n) => n.name === concepts.DESCRIPTION_OF_INJURY)
  );

  const imagePartNameObs = additionalFieldsEncounter?.obs.find(
    (ob) => ob.names.some((n) => n.name === concepts.IMAGE_PART_NAME)
  );

  const skinRashObs = additionalFieldsEncounter?.obs.find(
    (ob) => ob.names.some((n) => n.name === concepts.SKIN_RASH)
  );

  const abnormalitiesObs = additionalFieldsEncounter?.obs.find(
    (ob) => ob.names.some((n) => n.name === concepts.ABNORMALITIES)
  );

  const injuryObs = additionalFieldsEncounter?.obs.find(
    (ob) => ob.names.some((n) => n.name === concepts.INJURY)
  );


  let messages = [];

 
  if (temperatureObs?.value) {
    messages.push(`• Temperature (C): ${temperatureObs.value}`);
  } else {
    messages.push("• Temperature (C): Not reported.");
  }


  if (additionalNotesObs?.value) {
    messages.push(`• Additional Notes: ${additionalNotesObs.value}`);
  } else {
    messages.push("• Additional Notes: Not reported.");
  }


  if (descriptionObs?.value) {
    messages.push(`• Description: ${descriptionObs.value}`);
  } else {
    messages.push("• Description: Not reported.");
  }


  if (abnormalityDescriptionObs?.value) {
    messages.push(`• Abnormality Description: ${abnormalityDescriptionObs.value}`);
  } else {
    messages.push("• Abnormality Description: Not reported.");
  }

  
  if (injuryDescriptionObs?.value) {
    messages.push(`• Description of Injury: ${injuryDescriptionObs.value}`);
  } else {
    messages.push("• Description of Injury: Not reported.");
  }


  if (imagePartNameObs?.value) {
    messages.push(`• Image Part Name: ${imagePartNameObs.value}`);
  } else {
    messages.push("• Image Part Name: Not reported.");
  }


  if (skinRashObs?.value) {
    messages.push(`• Skin Rash: ${skinRashObs.value}`);
  } else {
    messages.push("• Skin Rash: Not reported.");
  }


  if (abnormalitiesObs?.value) {
    messages.push(`• Abnormalities: ${abnormalitiesObs.value}`);
  } else {
    messages.push("• Abnormalities: Not reported.");
  }

  if (injuryObs?.value) {
    messages.push(`• Injury: ${injuryObs.value}`);
  } else {
    messages.push("• Injury: Not reported.");
  }


  setAdditionalFieldsMessage(messages.join("<br />"));

}, [pData]);

  
  //-------------------------------------------

  useEffect(() => {
    if (encountersFetched) {
      const noteEncounter = patientEncounters.find(
        (encounter) =>
          encounter?.encounter_type?.uuid == encounters.CLINICAL_NOTES
          
      );

      if (noteEncounter) formatNotes(noteEncounter.obs);
    }
    
  }, [patientEncounters]);

  useEffect(() => {
    if (isSuccess) {
      formatNotes(data.obs);
    }
  }, [data]);

  const formatNotes = (obs: Obs[]) => {
    const notes = obs.map((ob) => ({
      note: ob.value_text,
      creator: ob.created_by,
      time: getHumanReadableDateTime(ob.obs_datetime),
    }));

    setClinicalNotes(notes);
  };

  const addClinicalNote = (note: any) => {
    const dateTime = getDateTime();
    mutate({
      encounterType: encounters.CLINICAL_NOTES,
      visit: patient?.visit_uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: [
        {
          concept: concepts.ADDITIONAL_NOTES,
          value: note,
          obsDatetime: dateTime,
        },
      ],
    });
  };

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }

  const expandIcon = (
    <WrapperBox
      sx={{
        padding: "0.5ch",
        ml: "5px",
        backgroundColor: "#DDEEDD",
        borderRadius: "0.5ch",
        color: (theme) => theme.palette.primary.main,
      }}
    >
      <FaExpandAlt />
    </WrapperBox>
  );
  return (
    <>
      <Panel title="Clinical Notes" icon={expandIcon}>
        <br />
        <WrapperBox display={"flex"} justifyContent={"space-between"}>
          <AddClinicalNotes onAddNote={addClinicalNote} />
          <FaRegChartBar />
        </WrapperBox>
        <WrapperBox
          sx={{ mt: "1ch", overflow: "scroll", maxHeight: "15ch", pl: "2ch" }}
        >
          {clinicalNotes.length == 0 ? (
            <Typography>No Notes added</Typography>
          ) : (
            clinicalNotes.map((note: any) => {
              return (
                <Box
                  key={note.note}
                  sx={{ my: "1ch", py: "1ch", borderBottom: "1px solid #E0E0E0" }}
                >
                  <ReactMarkdown>{note.note}</ReactMarkdown>
                  <br />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>~ {note.creator}</Typography>
                    <Typography variant="caption">{note.time}</Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </WrapperBox>
      </Panel>
      <Panel title="Circulation Assessment" icon={expandIcon}>
      <br />
      {circulationMessage ? (
        <Typography
          sx={{}}
          dangerouslySetInnerHTML={{ __html: circulationMessage }}
        />
      ) : (
        <Typography>No Information Available</Typography>
      )}
    </Panel>
  
      <Panel title="Disability Assessment" icon={expandIcon}>
        <br />
        {traumaMessage ? (
          <Typography
            sx={{}}
            dangerouslySetInnerHTML={{ __html: traumaMessage }}
          />
        ) : (
          <Typography>No Information Available</Typography>
        )}
      </Panel>
  
  
      <Panel title="Exposure Assessment" icon={expandIcon}>
        <br />
        {additionalFieldsMessage ? (
          <Typography
            sx={{}}
            dangerouslySetInnerHTML={{ __html: additionalFieldsMessage }}
          />
        ) : (
          <Typography>No Information Available</Typography>
        )}
      </Panel>
    </>
  );

};

const AddClinicalNotes = ({
  onAddNote,
}: {
  onAddNote: (value: any) => any;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (values: any) => {
    setAnchorEl(null);
    onAddNote(values);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <MainButton
        aria-describedby={id}
        title={"Add Notes"}
        variant="secondary"
        onClick={handleClick}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MarkdownEditor onSubmit={onSubmit} />
      </Popover>
    </div>
  );
};

const VitalsPill = ({
  textColor,
  backgroundColor,
  iconBackgroundColor,
  text,
}: {
  textColor: string;
  backgroundColor: string;
  iconBackgroundColor: string;
  text: string;
}) => {
  return (
    <WrapperBox
      display={"flex"}
      alignItems={"center"}
      sx={{
        backgroundColor,
        px: "2ch",
        py: "1ch",
        width: "49%",
        borderRadius: "1ch",
        color: textColor,
      }}
    >
      <WrapperBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: iconBackgroundColor,
          p: "0.7ch",
          borderRadius: "0.7ch",
        }}
      >
        <FaRegSquare />
      </WrapperBox>
      <WrapperBox
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MainTypography>{text}</MainTypography>
      </WrapperBox>
    </WrapperBox>
  );
};
