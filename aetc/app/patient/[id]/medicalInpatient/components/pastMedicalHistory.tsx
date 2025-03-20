import { FormikInit } from "@/components";
import { concepts } from "@/constants";
import * as Yup from "yup";

const form = {
  hivStatus: {
    name: concepts.HIV,
    label: "HIV status",
  },
  arvStatus: {
    name: concepts.ARV,
    label: "On ARV",
  },
  drugList: {
    name: concepts.DRUG_GIVEN,
    label: "ARVs given",
  },
  otherArvMedication: {
    name: concepts.OTHER_MEDICATION,
    label: "Other",
  },
  sinceWhen: {
    name: concepts.DATE,
    label: "Since When",
  },
  clinic: {
    name: concepts.HEALTH_CENTER,
    label: "Clinic",
  },
  other: {
    name: concepts.OTHER,
    label: "Other",
  },
  surgicalHistory: {
    name: concepts.SURGICAL_HISTORY,
    label: "Surgical History",
  },
  allergy: {
    name: concepts.ALLERGY,
    label: "Allergy",
  },
  allergyDetails: {
    name: concepts.ALLERGY_DETAILS,
    label: "Other",
  },
  intoxication: {
    name: concepts.INTOXICATION,
    label: "Intoxication",
  },
  intoxicationDescription: {
    name: concepts.INTOXICATION_DESCRIPTION,
    label: "Intoxication description",
  },
  socialHistory: {
    name: concepts.SOCIAL_HISTORY,
    label: "Social History",
  },
  familyHistory: {
    name: concepts.FAMILY_HISTORY,
    label: "Family History",
  },
};

export const PastMedicalHistory = () => {
  return <FormikInit></FormikInit>;
};
