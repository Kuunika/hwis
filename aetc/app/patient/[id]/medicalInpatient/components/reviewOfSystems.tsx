"use client";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  FormikInit,
  WrapperBox,
  FormFieldContainer,
  FormFieldContainerLayout,
  CheckboxesGroup,
  TextInputField,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";
import { useFormikContext } from "formik";

// Define the checklist options for each system
const reviewOfSystemsOptions = {
  general: [
    { value: concepts.FEVER, label: "Fever" },
    { value: concepts.LYMPHADENOPATHY, label: "Lymphadenopathy" },
    { value: concepts.NIGHT_SWEATS, label: "Night sweats" },
    { value: concepts.FATIGUE, label: "Fatigue" },
    { value: concepts.WEIGHT_LOSS, label: "Weight loss" },
    { value: concepts.OTHER, label: "Other" },
  ],
  HEENT: [
    { value: concepts.HEADACHE, label: "Headache" },
    { value: concepts.VISION_CHANGES, label: "Vision changes" },
    { value: concepts.EYE_PAIN, label: "Eye pain" },
    { value: concepts.LOSS_OF_HEARING, label: "Loss Of Hearing" },
    { value: concepts.TINNITUS, label: "Tinnitus" },
    { value: concepts.OTORRHOEA, label: "Otorrhoea" },
    { value: concepts.RHINORRHEA, label: "Rhinorrhea" },
    { value: concepts.EPISTAXIS, label: "Epistaxis" },
    { value: concepts.SINUS_PAIN, label: "Sinus pain" },
    { value: concepts.NASAL_STUFFINESS, label: "Nasal Stuffiness" },
    { value: concepts.ORAL_LESIONS, label: "Oral lesions" },
    { value: concepts.SORE_THROAT, label: "Sore Throat" },
    { value: concepts.DYSPHAGIA, label: "Dysphagia" },
    { value: concepts.ODYNOPHAGIA, label: "Odynophagia" },
  ],
  endocrine: [
    { value: concepts.HEAT_TOLERANCE, label: "Heat tolerance" },
    { value: concepts.ABNORMAL_HAIR_GROWTH, label: "Abnormal hair growth" },
    { value: concepts.COLD_TOLERANCE, label: "Cold tolerance" },
    { value: concepts.POLYURIA, label: "Polyuria" },
    { value: concepts.POLYDIPSIA, label: "Polydipsia" },
  ],
  cardiovascular: [
    { value: concepts.SHORTNESS_OF_BREATH, label: "Shortness Of Breath" },
    { value: concepts.DYSPNOEA_ON_EXERTION, label: "Dyspnoea on exertion" },
    { value: concepts.DYSPNOEA_AT_REST, label: "Dyspnoea at rest" },
    { value: concepts.BLEEDING_TENDENCIES, label: "Bleeding tendencies" },
    { value: concepts.CHEST_PAIN, label: "Chest pain" },
    { value: concepts.HEART_PALPITATIONS, label: "Palpitations" },
    { value: concepts.OEDEMA, label: "Oedema" },
    { value: concepts.CYANOSIS, label: "Cyanosis" },
    { value: concepts.CLAUDICATION, label: "Claudication" },
    { value: concepts.ORTHOPNOEA, label: "Orthopnoea" },
    {
      value: concepts.PAROXYSMAL_NOCTURNAL_DYSPNOEA,
      label: "Paroxysmal nocturnal dyspnoea",
    },
  ],
  respiratory: [
    { value: concepts.SHORTNESS_OF_BREATH, label: "Shortness Of Breath" },
    { value: concepts.COUGH, label: "Cough" },
    { value: concepts.HAEMOPTYSIS, label: "Haemoptysis" },
    { value: concepts.WHEEZING, label: "Wheezing" },
  ],
  gastrointestinal: [
    { value: concepts.NAUSEA, label: "Nausea" },
    { value: concepts.VOMITING, label: "Vomiting" },
    { value: concepts.MELENA, label: "Melena" },
    { value: concepts.HAEMATOCHEZIA, label: "Haematochezia" },
    { value: concepts.CHANGE_IN_APPETITE, label: "Change in appetite" },
    { value: concepts.ABDOMINALPAINS, label: "Abdominal pain" },
    { value: concepts.CHANGE_IN_BOWEL_HABIT, label: "Change in bowel habit" },
    { value: concepts.HEARTBURN, label: "Heartburn" },
  ],
  genitourinary: [
    { value: concepts.DYSURIA, label: "Dysuria" },
    { value: concepts.URGENCY, label: "Urgency" },
    { value: concepts.INCONTINENCE, label: "Incontinence" },
    { value: concepts.HAEMATURIA, label: "Haematuria" },
    { value: concepts.PYURIA, label: "Pyuria" },
    {
      value: concepts.SEXUALLY_TRANSMITTED_INFECTION,
      label: "Sexually Transmitted Infection (STI)",
    },
    {
      value: concepts.ABNORMAL_VAGINAL_DISCHARGE,
      label: "Abnormal Vaginal Discharge",
    },
    { value: concepts.DYSMENORRHEA, label: "Dysmenorrhea" },
    { value: concepts.PELVIC_PAIN, label: "Pelvic pain" },
    {
      value: concepts.INCREASE_URINARY_FREQUENCY,
      label: "Increased Urinary frequency",
    },
    {
      value: concepts.REDUCED_URINARY_FREQUENCY,
      label: "Reduced urinary frequency",
    },
  ],
  musculoskeletal: [
    { value: concepts.JOINT_PAIN, label: "Joint Pain" },
    { value: concepts.SWELLING_JOINT, label: "Joint Swelling" },
    { value: concepts.PAIN_BACK, label: "Back Pain" },
    { value: concepts.STIFFNESS, label: "Stiffness" },
  ],
  neurological: [
    { value: concepts.DIZZINESS, label: "Dizziness" },
    { value: concepts.HEADACHE, label: "Headache" },
    { value: concepts.CHANGE_IN_SMELL, label: "Change in smell" },
    { value: concepts.CHANGE_IN_TASTE, label: "Change in taste" },
    { value: concepts.PARAESTHESIAS, label: "Paraesthesias" },
    { value: concepts.MUSCLE_WEAKNESS, label: "Muscle weakness" },
    { value: concepts.ATAXIA, label: "Ataxia" },
    { value: concepts.CHANGE_IN_SPEECH, label: "Change in speech" },
  ],
  psychiatric: [
    { value: concepts.DEPRESSION, label: "Depression" },
    { value: concepts.ANXIETY, label: "Anxiety" },
    { value: concepts.HALLUCINATIONS, label: "Hallucinations" },
    { value: concepts.MANIA, label: "Mania" },
    { value: concepts.SUICIDAL_THOUGHTS, label: "Suicidal thoughts" },
    { value: concepts.MOOD_CHANGES, label: "Mood Changes" },
  ],
  integumentary: [
    { value: concepts.SKIN_RASH, label: "Skin Rash" },
    { value: concepts.ITCHING, label: "Itching" },
    { value: concepts.CHANGES_IN_MOLES, label: "Changes in moles" },
  ],
};

// Map category names to their corresponding concept IDs
const categoryConceptMap = {
  general: concepts.REVIEW_OF_SYSTEMS_GENERAL,
  HEENT: concepts.REVIEW_OF_SYSTEMS_ENT,
  endocrine: concepts.REVIEW_OF_SYSTEMS__ENDOCRINE,
  cardiovascular: concepts.REVIEW_OF_SYSTEMS_CARDIAC,
  respiratory: concepts.SEVERE_RESPIRATORY,
  gastrointestinal: concepts.REVIEW_OF_SYSTEMS_GASTROINTESTINAL,
  genitourinary: concepts.REVIEW_OF_SYSTEMS_GENITOURINARY,
  musculoskeletal: concepts.REVIEW_OF_SYSTEMS_MUSCULOSKELETAL,
  neurological: concepts.REVIEW_OF_SYSTEMS_NEUROLOGIC,
  psychiatric: concepts.REVIEW_OF_SYSTEMS_PSYCHIATRIC,
  integumentary: concepts.SKIN_INFECTION,
};

// Component to handle the "Other" text field visibility
const GeneralSystemSection = () => {
  const { values } = useFormikContext<any>();

  // Check if "Other" is selected in the general category
  const generalValues = values.general || [];
  const isOtherSelected = generalValues.some(
    (item: any) => item.key === concepts.OTHER && item.value === true
  );

  return (
    <div style={{ marginBottom: "2ch" }}>
      <h5 style={{ textTransform: "capitalize" }}>General (Constitutional)</h5>
      <CheckboxesGroup
        name="general"
        allowFilter={false}
        options={reviewOfSystemsOptions.general.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.label,
        }))}
      />

      {/* Show text field when "Other" is selected */}
      {isOtherSelected && (
        <div style={{ marginTop: "1ch", marginLeft: "2ch" }}>
          <TextInputField
            id=""
            name="generalOtherText"
            label="Please specify other symptom"
            placeholder="Enter other symptom..."
            size="small"
          />
        </div>
      )}
    </div>
  );
};

// Create a validation schema
const validationSchema = Yup.object({
  generalOtherText: Yup.string().when("general", {
    is: (general: any[]) =>
      general?.some(
        (item: any) => item.key === concepts.OTHER && item.value === true
      ),
    then: (schema) =>
      schema.required("Please specify the other general symptom"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const ReviewOfSystems = ({
  onSubmit,
  onSkip,
}: {
  onSubmit: (values: any) => void;
  onSkip: () => void;
}) => {
  const { params } = useParameters();
  const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
  const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
  const { data: patientVisits } = getPatientVisitTypes(params.id as string);
  const { init, ServerTime } = useServerTime();

  useEffect(() => {
    // Finds the active visit for the patient from their visit history
    if (patientVisits) {
      const active = patientVisits.find((visit) => !visit.date_stopped);
      if (active) {
        setActiveVisit(active as unknown as Visit);
      }
    }
  }, [patientVisits]);

  const handleSubmit = async (values: Record<string, any>) => {
    const currentDateTime = ServerTime.getServerTimeString();

    if (!params.id || !activeVisit) {
      console.error("Missing patient ID or active visit");
      return;
    }

    console.log("Form values:", values);

    // Create an array to hold all observations
    const obs = [];

    // Process each category
    for (const category in reviewOfSystemsOptions) {
      const categoryValues = values[category] || [];

      // Skip if no selections for this category
      if (!categoryValues.length) continue;

      // Filter to get only selected items
      const selectedItems = categoryValues
        .filter((item: any) => item.value === true)
        .map((item: any) => item.key);

      // Skip if nothing selected after filtering
      if (!selectedItems.length) continue;

      // Get the concept for this category
      const categoryConcept =
        categoryConceptMap[category as keyof typeof categoryConceptMap];

      // Create group members for the selected symptoms
      const groupMembers = selectedItems.map((symptomConcept: string) => {
        // Find the option object to get the label
        const optionList =
          reviewOfSystemsOptions[
            category as keyof typeof reviewOfSystemsOptions
          ];
        const option = optionList.find((opt) => opt.value === symptomConcept);

        // If this is "Other" in general category, use the custom text
        let labelValue = option?.label || symptomConcept;
        if (
          symptomConcept === concepts.OTHER &&
          category === "general" &&
          values.generalOtherText
        ) {
          // labelValue = values.generalOtherText;
          return {
            concept: symptomConcept,
            value: values.generalOtherText,
            obsDatetime: currentDateTime,
          };
        }

        return {
          concept: symptomConcept,
          value: labelValue,
          obsDatetime: currentDateTime,
        };
      });

      // Add observation for this category if it has group members
      if (groupMembers.length > 0) {
        obs.push({
          concept: categoryConcept,
          value: categoryConcept,
          obsDatetime: currentDateTime,
          groupMembers,
        });
      }
    }

    console.log("Final obs structure:", obs);
    onSubmit(obs);
  };

  return (
    <FormikInit
      initialValues={{
        general: [],
        HEENT: [],
        endocrine: [],
        cardiovascular: [],
        respiratory: [],
        gastrointestinal: [],
        genitourinary: [],
        musculoskeletal: [],
        neurological: [],
        psychiatric: [],
        integumentary: [],
        generalOtherText: "", // Add initial value for the other text field
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <FormFieldContainer direction="column">
        <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
          <FormFieldContainerLayout title="Review of Systems">
            {/* Special handling for General section with "Other" text field */}
            <GeneralSystemSection />

            {/* Generate a checkbox list for other categories */}
            {Object.entries(reviewOfSystemsOptions)
              .filter(([category]) => category !== "general") // Exclude general as it's handled above
              .map(([category, options]) => (
                <div key={category} style={{ marginBottom: "2ch" }}>
                  <h5 style={{ textTransform: "capitalize" }}>
                    {category.replace(/_/g, " ")}
                  </h5>
                  <CheckboxesGroup
                    name={category}
                    allowFilter={false}
                    options={options.map((item) => ({
                      key: item.value,
                      value: item.value,
                      label: item.label,
                    }))}
                  />
                </div>
              ))}
          </FormFieldContainerLayout>
        </WrapperBox>
      </FormFieldContainer>
    </FormikInit>
  );
};
