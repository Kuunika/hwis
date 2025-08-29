"use client";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { FormikInit, WrapperBox, FormFieldContainer, FormFieldContainerLayout, CheckboxesGroup } from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";


// Define the checklist options for each system
const reviewOfSystemsOptions = {
  general: [
    { value: concepts.FEVER, label: "Fever" },
    { value: concepts.LYMPHADENOPATHY, label: "Lymphadenopathy" },
    { value: concepts.NIGHT_SWEATS, label: "Night sweats" },
    { value: concepts.FATIGUE, label: "Fatigue" },
    { value: concepts.WEIGHT_LOSS, label: "Weight loss" },
  ],
  HEENT: [
    { value: concepts.HEADACHE, label: "Headache" },

    { value: concepts.EYE_PAIN, label: "Eye pain" },
    { value: concepts.LOSS_OF_HEARING, label: "Loss Of Hearing" },
    { value: concepts.TINNITUS, label: "Tinnitus" },
    { value: concepts.OTORRHOEA, label: "Otorrhoea" },
    { value: concepts.RHINORRHEA, label: "Rhinorrhea" },
    { value: concepts.EPISTAXIS, label: "Epistaxis" },
    { value: concepts.SINUS_PAIN, label: "Sinus pain" },

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
    { value: concepts.PAROXYSMAL_NOCTURNAL_DYSPNOEA, label: "Paroxysmal nocturnal dyspnoea" },
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
    { value: concepts.SEXUALLY_TRANSMITTED_INFECTION, label: "Sexually Transmitted Infection (STI)" },
    { value: concepts.ABNORMAL_VAGINAL_DISCHARGE, label: "Abnormal Vaginal Discharge" },
    { value: concepts.DYSMENORRHEA, label: "Dysmenorrhea" },
    { value: concepts.PELVIC_PAIN, label: "Pelvic pain" },
  ],
  musculoskeletal: [
    { value: concepts.JOINT_PAIN, label: "Joint Pain" },
    { value: concepts.SWELLING_JOINT, label: "Joint Swelling" },
    { value: concepts.PAIN_BACK, label: "Back Pain" },
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
  ],
  integumentary: [
    { value: concepts.SKIN_RASH, label: "Skin Rash" },
    { value: concepts.ITCHING, label: "Itching" },



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

// Create a validation schema
const validationSchema = Yup.object({});

export const ReviewOfSystems = ({ onSubmit, onSkip }: { onSubmit: (values: any) => void; onSkip: () => void }) => {
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
      const categoryConcept = categoryConceptMap[category as keyof typeof categoryConceptMap];

      // Create group members for the selected symptoms
      const groupMembers = selectedItems.map((symptomConcept: string) => {
        // Find the option object to get the label
        const optionList = reviewOfSystemsOptions[category as keyof typeof reviewOfSystemsOptions];
        const option = optionList.find(opt => opt.value === symptomConcept);

        return {
          concept: symptomConcept,
          value: option?.label || symptomConcept,
          obsDatetime: currentDateTime
        };
      });

      // Add observation for this category if it has group members
      if (groupMembers.length > 0) {
        obs.push({
          concept: categoryConcept,
          value: categoryConcept,
          obsDatetime: currentDateTime,
          groupMembers
        });
      }
    }

    console.log("Final obs structure:", obs);

    // Only submit if we have observations
    if (obs.length === 0) {
      console.warn("No systems selected, moving to next step anyway");
      onSubmit(values);
      return;
    }

    // Create and submit the encounter
    const payload = {
      encounterType: encounters.MEDICAL_IN_PATIENT,
      patient: params.id,
      encounterDatetime: currentDateTime,
      visit: activeVisit.uuid,
      obs,
    };

    try {
      console.log("Submitting payload:", payload);
      await submitEncounter(payload);
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting Review of Systems:", error);
    }
  };

  return (
    <FormikInit
      initialValues={{
        general: [],
        // ent: [],
        endocrine: [],
        cardiovascular: [],
        respiratory: [],
        gastrointestinal: [],
        genitourinary: [],
        musculoskeletal: [],
        neurological: [],
        psychiatric: [],
        integumentary: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <FormFieldContainer direction="column">
        <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
          <FormFieldContainerLayout title="Review of Systems">
            {/* Generate a checkbox list for each category */}
            {Object.entries(reviewOfSystemsOptions).map(([category, options]) => (
              <div key={category} style={{ marginBottom: "2ch" }}>
                <h5 style={{ textTransform: "capitalize" }}>{category.replace(/_/g, " ")}</h5>
                <CheckboxesGroup
                  name={category}
                  allowFilter={false}
                  options={options.map((item) => ({
                    key: item.value,  // Use key instead of value to match PresentingComplaintsForm
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