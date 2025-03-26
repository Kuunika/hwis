import { useEffect, useState } from "react";
import { concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const useCirculationAssessment = (pData: any) => {
  const [circulationMessage, setCirculationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pData) return;

    const reviewOfSystemsEncounter = pData.find(
      (d:any) => d.encounter_type.uuid === encounters.CIRCULATION_ASSESSMENT
    );

    if (!reviewOfSystemsEncounter?.obs) return;

    const getObservation = (conceptName: string) => {
      return reviewOfSystemsEncounter.obs.find((ob: Obs) =>
        ob.names.some((n) => n.name === conceptName)
      );
    };

    const observations = {
      activelyBledding: getObservation(concepts.IS_PATIENT_ACTIVELY_BLEEDING),
      actionDone: getObservation(concepts.ACTION_DONE),
      pulseRate: getObservation(concepts.PULSE_RATE),
      capillaryRefillTime: getObservation(concepts.CAPILLARY_REFILL_TIME),
      cprDateOfCall: getObservation(concepts.DATE_OF_CPR),
      cprCardiacArrest: getObservation(concepts.CARDIAC_ARREST),
      cprSite: getObservation(concepts.SITE),
      cprSpecify: getObservation(concepts.SPECIFY),
      cprRecord1Time: getObservation(concepts.TIME),
      cprRecord1Rhythm: getObservation(concepts.RHYTHM),
      cprRecord1ShockEnergy: getObservation(concepts.SHOCK_ENERGY),
      cprRecord1MedicationName: getObservation(concepts.MEDICATION),
      cprRecord1DoseName: getObservation(concepts.DOSE_IN_MILLIGRAMS),
      cprRecord1Route: getObservation(concepts.MEDICATION_ROUTE),
      cprRecord1Intervations: getObservation(concepts.INTERVENTION),
      cprRecord1Occurrences: getObservation(concepts.OCCURRENCES),
      cprRecord1ReversibleCauses: getObservation(concepts.REVERSIBLE_CAUSES),
      cprRecord1CardiacArrest: getObservation(concepts.CARDIAC_ARREST),
      cprROSCspo2: getObservation(concepts.SPO2),
      cprOxygen: getObservation(concepts.OXYGEN_GIVEN),
      cprSystolic: getObservation(concepts.SYSTOLIC_BLOOD_PRESSURE),
      cprDystoric: getObservation(concepts.DIASTOLIC_BLOOD_PRESSURE),
      cprRespiratory: getObservation(concepts.RESPIRATORY_RATE),
      cprPulse: getObservation(concepts.PULSE_RATE),
      cprTemperature: getObservation(concepts.TEMPERATURE),
      cprMotorResponse: getObservation(concepts.MOTOR_RESPONSE),
      cprVerbalResponse: getObservation(concepts.VERBAL_RESPONSE),
      cprEyeOpeningResponse: getObservation(concepts.EYE_OPENING_RESPONSE),
      cprTimeStopped: getObservation(concepts.CPR_TIME_STOPPED),
      cprReasonTimeStopped: getObservation(concepts.REASON_CPR_STOPPED),
      cprDisposition: getObservation(concepts.DISPOSITION_AFTER_CPR),
      cprTeamLeader: getObservation(concepts.TEAM_LEADER),
      cprTeamMembers: getObservation(concepts.TEAM_MEMBERS),
      mucuous: getObservation(concepts.MUCOUS_MEMBRANES),
      mucuouAbnormal: getObservation(concepts.MUCOUS_ABNORMAL),
      assessPeripheries: getObservation(concepts.ASSESS_PERIPHERIES),
      bloodPressureMeasured: getObservation(concepts.BLOOD_PRESSURE_MEASURED),
      bloodPressureSystolic: getObservation(concepts.BLOOD_PRESSURE_SYSTOLIC),
      bloodPressureDiastolic: getObservation(concepts.BLOOD_PRESSURE_DIASTOLIC),
      bloodPressureNotDone: getObservation(concepts.NOT_DONE),
      bpUnrecordable: getObservation(concepts.BP_NOT_RECORDABLE),
      patientInjured: getObservation(concepts.PATIENT_INJURED),
      intravenousAccess: getObservation(concepts.INTRAVENOUS),
      sizeOfCatheter: getObservation(concepts.SIZE_OF_CATHETER),
      cannulationSite: getObservation(concepts.CANNULATION_SITE),
      scarpa: getObservation(concepts.FEMORAL),
      abdominalDistention: getObservation(concepts.ABDOMINAL_DISTENSION),
      otherAbnormalities: getObservation(concepts.IS_THERE_OTHER_OBDONORMALITIES)
    };

    let messages = [];

    if (observations.activelyBledding?.value == "Yes") {
      messages.push("The patient is actively bleeding.");
    } else {
      messages.push("The patient is not actively bleeding.");
    }

    if (observations.actionDone?.value) {
      messages.push(`Action taken when the patient was actively bleeding: ${observations.actionDone.value}.`);
    }

    if (observations.pulseRate?.value == "Weak") {
      messages.push("The patient's pulse rate is weak.");
    } else if (observations.pulseRate?.value == "Strong,Regular") {
      messages.push("The patient's pulse rate is strong and regular.");
    } else {
      messages.push("The patient's pulse rate is irregular.");
    }

    if (observations.capillaryRefillTime?.value == "Less than 3 seconds") {
      messages.push("The patient's capillary refill time is less than 3 seconds.");
    } else if (observations.capillaryRefillTime?.value == "3 seconds") {
      messages.push("The patient's capillary refill time is 3 seconds.");
    } else {
      messages.push("The patient's capillary refill time is more than 3 seconds.");
    }

    if (observations.cprDateOfCall?.value) {
      messages.push(`CPR date of call: ${observations.cprDateOfCall.value}.`);
    }

    if (observations.cprCardiacArrest?.value == "Yes") {
      messages.push("There is a witnessed cardiac arrest.");
    } else if (observations.cprCardiacArrest?.value == "No") {
      messages.push("There is no witnessed cardiac arrest.");
    }

    if (observations.cprSite?.value == "Rescitation") {
      messages.push("The site is resuscitation.");
    } else if (observations.cprSite?.value == "SSW") {
      messages.push("The site is SSW.");
    } else if (observations.cprSite?.value == "Priority") {
      messages.push("The site is priority.");
    }

    if (observations.cprSpecify?.value) {
      messages.push(`Witnessed cardiac arrest specification: ${observations.cprSpecify.value}.`);
    }

    if (observations.cprRecord1Time?.value) {
      messages.push(`Record time: ${observations.cprRecord1Time.value}.`);
    }

    if (observations.cprRecord1Rhythm?.value) {
      messages.push(`Rhythm: ${observations.cprRecord1Rhythm.value}.`);
    }

    if (observations.cprRecord1ShockEnergy?.value) {
      messages.push(`Shock energy: ${observations.cprRecord1ShockEnergy.value}.`);
    }

    if (observations.cprRecord1MedicationName?.value) {
      messages.push(`Medication name: ${observations.cprRecord1MedicationName.value}.`);
    }

    if (observations.cprRecord1DoseName?.value) {
      messages.push(`Dose: ${observations.cprRecord1DoseName.value}.`);
    }

    if (observations.cprRecord1Route?.value) {
      messages.push(`Medication route: ${observations.cprRecord1Route.value}.`);
    }

    if (observations.cprRecord1Intervations?.value) {
      messages.push(`Interventions: ${observations.cprRecord1Intervations.value}.`);
    }

    if (observations.cprRecord1Occurrences?.value) {
      messages.push(`Occurrences: ${observations.cprRecord1Occurrences.value}.`);
    }

    if (observations.cprRecord1ReversibleCauses?.value) {
      messages.push(`Reversible causes: ${observations.cprRecord1ReversibleCauses.value}.`);
    }

    if (observations.cprRecord1CardiacArrest?.value) {
      messages.push(`Likely or known cause of cardiac arrest: ${observations.cprRecord1CardiacArrest.value}.`);
    }

    if (observations.cprROSCspo2?.value) {
      messages.push(`SPO2: ${observations.cprROSCspo2.value}.`);
    }

    if (observations.cprOxygen?.value == "Yes") {
      messages.push("Oxygen was administered.");
    } else if (observations.cprOxygen?.value == "No") {
      messages.push("Oxygen was not administered.");
    }

    if (observations.cprSystolic?.value) {
      messages.push(`Systolic blood pressure: ${observations.cprSystolic.value}.`);
    }

    if (observations.cprDystoric?.value) {
      messages.push(`Diastolic blood pressure: ${observations.cprDystoric.value}.`);
    }

    if (observations.cprRespiratory?.value) {
      messages.push(`Respiratory rate: ${observations.cprRespiratory.value}.`);
    }

    if (observations.cprPulse?.value) {
      messages.push(`Pulse rate: ${observations.cprPulse.value}.`);
    }

    if (observations.cprTemperature?.value) {
      messages.push(`Temperature: ${observations.cprTemperature.value}.`);
    }

    if (observations.cprMotorResponse?.value == "Obeying Commands") {
      messages.push("Motor response: obeying commands.");
    } else if (observations.cprMotorResponse?.value == "Localising") {
      messages.push("Motor response: localising.");
    } else if (observations.cprMotorResponse?.value == "Withdraw") {
      messages.push("Motor response: withdraw.");
    } else if (observations.cprMotorResponse?.value == "Normal Flexion") {
      messages.push("Motor response: normal flexion.");
    } else if (observations.cprMotorResponse?.value == "Extension") {
      messages.push("Motor response: extension.");
    } else if (observations.cprMotorResponse?.value == "None") {
      messages.push("No motor response.");
    }

    if (observations.cprVerbalResponse?.value == "Oriented") {
      messages.push("Verbal response: oriented.");
    } else if (observations.cprVerbalResponse?.value == "Confused") {
      messages.push("Verbal response: confused.");
    } else if (observations.cprVerbalResponse?.value == "Inappropriate Words") {
      messages.push("Verbal response: inappropriate words.");
    } else if (observations.cprVerbalResponse?.value == "Incomprehensible sounds") {
      messages.push("Verbal response: incomprehensible sounds.");
    } else if (observations.cprVerbalResponse?.value == "None") {
      messages.push("No verbal response.");
    }

    if (observations.cprEyeOpeningResponse?.value == "Spontaneous") {
      messages.push("Eye opening response: spontaneous.");
    } else if (observations.cprEyeOpeningResponse?.value == "To Speech") {
      messages.push("Eye opening response: to speech.");
    } else if (observations.cprEyeOpeningResponse?.value == "To Pain") {
      messages.push("Eye opening response: to pain.");
    } else if (observations.cprEyeOpeningResponse?.value == "No Response") {
      messages.push("No eye opening response.");
    }

    if (observations.cprTimeStopped?.value) {
      messages.push(`Reason CPR stopped: ${observations.cprTimeStopped.value}.`);
    }

    if (observations.cprReasonTimeStopped?.value) {
      messages.push(`CPR time stopped: ${observations.cprReasonTimeStopped.value}.`);
    }

    if (observations.cprDisposition?.value) {
      messages.push(`Disposition after CPR: ${observations.cprDisposition.value}.`);
    }

    if (observations.cprTeamLeader?.value) {
      messages.push(`Team leader: ${observations.cprTeamLeader.value}.`);
    }

    if (observations.cprTeamMembers?.value) {
      messages.push(`Team members: ${observations.cprTeamMembers.value}.`);
    }

    if (observations.mucuous?.value == "Normal") {
      messages.push("Mucous membranes are normal.");
    } else {
      messages.push("Mucous membranes are abnormal.");
    }

    if (observations.mucuouAbnormal?.value) {
      messages.push(`Mucous abnormality: ${observations.mucuouAbnormal.value}.`);
    }

    if (observations.assessPeripheries?.value == "Cold and clammy") {
      messages.push("Peripheries are cold and clammy.");
    } else {
      messages.push("Peripheries are warm.");
    }

    if (observations.bloodPressureMeasured?.value == "Done") {
      messages.push("Blood pressure was measured.");
    } else if (observations.bloodPressureMeasured?.value == "Not Done") {
      messages.push("Blood pressure was not measured.");
    } else {
      messages.push("Blood pressure is unrecordable.");
    }

    if (observations.bloodPressureSystolic?.value) {
      messages.push(`Systolic blood pressure: ${observations.bloodPressureSystolic.value}.`);
    }

    if (observations.bloodPressureDiastolic?.value) {
      messages.push(`Diastolic blood pressure: ${observations.bloodPressureDiastolic.value}.`);
    }

    if (observations.bpUnrecordable?.value) {
      messages.push(`BP is unrecordable: ${observations.bpUnrecordable.value}.`);
    }

    if (observations.bloodPressureNotDone?.value) {
      messages.push(`BP was not done: ${observations.bloodPressureNotDone.value}.`);
    }

    if (observations.patientInjured?.value == "Yes") {
      messages.push("The patient is injured.");
    } else {
      messages.push("The patient is not injured.");
    }

    if (observations.intravenousAccess?.value == "Yes") {
      messages.push("The patient requires intravenous access.");
    } else {
      messages.push("The patient does not require intravenous access.");
    }

    if (observations.sizeOfCatheter?.value) {
      messages.push(`Size of intravenous catheter: ${observations.sizeOfCatheter.value}.`);
    }

    if (observations.cannulationSite?.value) {
      messages.push(`Cannulation Site: ${observations.cannulationSite.value}.`);
    }

    if (observations.scarpa?.value) {
      messages.push(`Diastolic blood pressure: ${observations.scarpa.value}.`);
    }

    if (observations.abdominalDistention?.value == "Yes") {
      messages.push("There is abdominal distention.");
    } else {
      messages.push("There is no abdominal distention.");
    }

    if (observations.otherAbnormalities?.value == "Yes") {
      messages.push("There are other abnormalities.");
    } else {
      messages.push("There are no other abnormalities.");
    }

    setCirculationMessage(messages.join(" "));
  }, [pData]);

  return circulationMessage;
};