import { useEffect, useState } from "react";
import { concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const useDisabilityAssessment = (pData: any) => {
  const [disabilityMessage, setDisabilityMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pData) return;
  
    const reviewOfSystemsEncounter = pData.find(
      (d:any) => d.encounter_type.uuid === encounters.DISABILITY_ASSESSMENT
    );

    if (!reviewOfSystemsEncounter?.obs) return;

    const getObservation = (conceptName: string) => {
      return reviewOfSystemsEncounter.obs.find((ob: Obs) =>
        ob.names.some((n) => n.name === conceptName)
      );
    };

    const observations = {
      levelOfConsciousness: getObservation(concepts.DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS),
      gcs: getObservation(concepts.GCS),
      eyeOpening: getObservation(concepts.EYE_OPENING_RESPONSE),
      verbalResponse: getObservation(concepts.VERBAL_RESPONSE),
      pupilSize: getObservation(concepts.PUPIL_SIZE_AND_REACTION_TO_LIGHT),
      focalNeurology: getObservation(concepts.FOCAL_NEUROLOGY),
      posture: getObservation(concepts.FOCAL_NEUROLOGY)
    };

    let messages = [];

    if (observations.levelOfConsciousness?.value === "No") {
      messages.push("The patient is alert and does not exhibit a low level of consciousness.");
    } else {
      messages.push("The patient exhibits a low level of consciousness and requires further evaluation and monitoring.");
    }

    if (observations.gcs?.value === 15) {
      messages.push("The GCS is 15: patient is fully conscious with normal neurological function.");
    } else if (observations.gcs?.value >= 13 && observations.gcs?.value <= 14) {
      messages.push("GCS is 13–14: Mild brain injury. Close monitoring advised.");
    } else if (observations.gcs?.value >= 9 && observations.gcs?.value <= 12) {
      messages.push("GCS is 9–12: Moderate brain injury. Further assessment required.");
    } else if (observations.gcs?.value >= 3 && observations.gcs?.value <= 8) {
      messages.push("GCS is 3–8: Severe brain injury or coma. Immediate intervention required.");
    } else {
      messages.push("Invalid GCS score.");
    }

    if (observations.eyeOpening?.value == 4) {
      messages.push("Eyes open spontaneously: patient is fully conscious.");
    } else if (observations.eyeOpening?.value == 3) {
      messages.push("Eyes open to speech: mild impairment in consciousness.");
    } else if (observations.eyeOpening?.value == 2) {
      messages.push("Eyes open to pain: more significant impairment in consciousness.");
    } else if (observations.eyeOpening?.value == 1) {
      messages.push("No eye opening response: patient may be in a deep coma.");
    } else {
      messages.push("Invalid eye opening response value.");
    }

    if (observations.verbalResponse?.value == 5) {
      messages.push("Verbal response is 5: patient is oriented and converses normally.");
    } else if (observations.verbalResponse?.value == 4) {
      messages.push("Verbal response is 4: patient is confused but able to speak.");
    } else if (observations.verbalResponse?.value == 3) {
      messages.push("Verbal response is 3: inappropriate words, not making sense.");
    } else if (observations.verbalResponse?.value == 2) {
      messages.push("Verbal response is 2: incomprehensible sounds, moaning or groaning.");
    } else if (observations.verbalResponse?.value == 1) {
      messages.push("Verbal response is 1: no verbal response, patient is unresponsive.");
    } else {
      messages.push("Invalid verbal response value.");
    }

    messages.push(`Pupil Size and Reaction to Light: ${observations.pupilSize?.value || "Not available"}.`);
    messages.push(`Focal Neurology: ${observations.focalNeurology?.value || "Not available"}.`);
    messages.push(`Posture: ${observations.posture?.value || "Not available"}.`);

    setDisabilityMessage(messages.join(" "));
  }, [pData]);

  return disabilityMessage;
};