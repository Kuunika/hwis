import { useEffect, useState } from "react";
import { concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const useExposureAssessment = (pData: any) => {
  const [exposureMessage, setExposureMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pData) return;
  
    const additionalFieldsEncounter = pData.find(
      (d:any) => d.encounter_type.uuid === encounters.EXPOSURE_ASSESSMENT
    );

    if (!additionalFieldsEncounter?.obs) return;

    const getObservation = (conceptName: string) => {
      return additionalFieldsEncounter.obs.find((ob: Obs) =>
        ob.names.some((n) => n.name === conceptName)
      );
    };

    const observations = {
      temperature: getObservation(concepts.TEMPERATURE),
      rashOnCephalicFrontal: getObservation(concepts.RASH),
      skinAbnormalitiesOnCephalicFrontal: getObservation(concepts.ABNORMALITIES),
      injuryOnCephalicFrontal: getObservation(concepts.INJURY),
      additionalNotes: getObservation(concepts.ADDITIONAL_NOTES),
      description: getObservation(concepts.DESCRIPTION),
      abnormalityDescription: getObservation(concepts.ABNORMALITY_DESCRIPTION),
      injuryDescription: getObservation(concepts.DESCRIPTION_OF_INJURY),
      imagePartName: getObservation(concepts.IMAGE_PART_NAME),
      skinRash: getObservation(concepts.SKIN_RASH),
      abnormalities: getObservation(concepts.ABNORMALITIES),
      injury: getObservation(concepts.INJURY)
    };

    let messages = [];

    if (observations.temperature?.value) {
      messages.push(`Temperature (C): ${observations.temperature.value}.`);
    } else {
      messages.push("Temperature (C): Not reported.");
    }

    if (observations.additionalNotes?.value) {
      messages.push(`Additional Notes: ${observations.additionalNotes.value}.`);
    } else {
      messages.push("Additional Notes: Not reported.");
    }

    if (observations.description?.value) {
      messages.push(`Description: ${observations.description.value}.`);
    } else {
      messages.push("Description: Not reported.");
    }

    if (observations.rashOnCephalicFrontal?.value) {
      messages.push(`Rash on Cephalic: ${observations.rashOnCephalicFrontal.value}.`);
    }

    if (observations.skinAbnormalitiesOnCephalicFrontal?.value) {
      messages.push(`Skin abnormalities on Cephalic: ${observations.skinAbnormalitiesOnCephalicFrontal.value}.`);
    }

    if (observations.injuryOnCephalicFrontal?.value) {
      messages.push(`Injury on Cephalic: ${observations.injuryOnCephalicFrontal.value}.`);
    } else {
      messages.push("Description of Injury: Not reported.");
    }

    if (observations.imagePartName?.value) {
      messages.push(`Image Part Name: ${observations.imagePartName.value}.`);
    } else {
      messages.push("Image Part Name: Not reported.");
    }

    if (observations.skinRash?.value) {
      messages.push(`Skin Rash: ${observations.skinRash.value}.`);
    } else {
      messages.push("Skin Rash: Not reported.");
    }

    if (observations.abnormalities?.value) {
      messages.push(`Abnormalities: ${observations.abnormalities.value}.`);
    } else {
      messages.push("Abnormalities: Not reported.");
    }

    if (observations.injury?.value) {
      messages.push(`Injury: ${observations.injury.value}.`);
    } else {
      messages.push("Injury: Not reported.");
    }

    setExposureMessage(messages.join(" "));
  }, [pData]);

  return exposureMessage;
};