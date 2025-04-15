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

// Define the checklist options for each system
const reviewOfSystemsOptions = {
    general: [
        { value: concepts.FEVER, label: "Fever" },
        { value: concepts.LYMPHADENOPATHY, label: "Lymphadenopathy" },
        { value: concepts.NIGHT_SWEATS, label: "Night sweats" },
        { value: concepts.FATIGUE, label: "Fatigue" },
        { value: concepts.WEIGHT_LOSS, label: "Weight loss" },
    ],
    ent: [
        { value: concepts.EYE_PAIN, label: "Eye pain" },
        { value: concepts.RHINORRHEA, label: "Rhinorrhea" },
        { value: concepts.TINNITUS, label: "Tinnitus" },
        { value: concepts.EPISTAXIS, label: "Epistaxis" },
        { value: concepts.SINUS_PAIN, label: "Sinus pain" },
        { value: concepts.ORAL_LESIONS, label: "Oral lesions" },
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
    cardiac: [
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
        { value: concepts.DYSPNOEA_ON_EXERTION, label: "Dyspnoea on exertion" },
        { value: concepts.DYSPNOEA_AT_REST, label: "Dyspnoea at rest" },
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
    neurologic: [
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
};

// Map category names to their corresponding concept IDs
const categoryConceptMap = {
    general: concepts.REVIEW_OF_SYSTEMS_GENERAL,
    ent: concepts.ENT,
    endocrine: concepts.REVIEW_OF_SYSTEMS__ENDOCRINE,
    cardiac: concepts.REVIEW_OF_SYSTEMS_CARDIAC,
    respiratory: concepts.SEVERE_RESPIRATORY,
    gastrointestinal: concepts.REVIEW_OF_SYSTEMS_GASTROINTESTINAL,
    genitourinary: concepts.REVIEW_OF_SYSTEMS_GENITOURINARY,
    musculoskeletal: concepts.REVIEW_OF_SYSTEMS_MUSCULOSKELETAL,
    neurologic: concepts.REVIEW_OF_SYSTEMS_NEUROLOGIC,
    psychiatric: concepts.REVIEW_OF_SYSTEMS_PSYCHIATRIC
};

const validationSchema = Yup.object({});

export const ReviewOfSystemsForm = ({ onSubmit, onSkip }: { onSubmit: (values: any) => void; onSkip: () => void }) => {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);

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
        const currentDateTime = getDateTime();

        if (!params.id || !activeVisit) {
            console.error("Missing patient ID or active visit");
            return;
        }

        // Debug the incoming values to understand their structure
        console.log("Form values:", values);

        // Create an array to hold all observations
        const obs = [];

        // Process each category of symptoms
        for (const [category, selectedValues] of Object.entries(values)) {
            // Skip empty categories
            if (!selectedValues || !Array.isArray(selectedValues) || selectedValues.length === 0) {
                continue;
            }

            // Handle potential different formats of checkbox values
            // This matches the pattern used in FamilyHistoryForm
            let processedValues = selectedValues;

            // If the values are objects with key property, extract the keys
            if (selectedValues.length > 0 && typeof selectedValues[0] === 'object') {
                processedValues = selectedValues
                    .filter((item: any) => item.value)
                    .map((item: any) => item.key);
            }

            // If still no values after processing, skip
            if (!processedValues.length) {
                continue;
            }

            // Get the concept ID for this category
            const categoryConcept = categoryConceptMap[category as keyof typeof categoryConceptMap];
            if (!categoryConcept) {
                console.warn(`No concept mapping found for category: ${category}`);
                continue;
            }

            // Get the options for this category
            const categoryOptions = reviewOfSystemsOptions[category as keyof typeof reviewOfSystemsOptions];
            if (!categoryOptions) {
                continue;
            }

            // Debug the processed values for this category
            console.log(`Processed values for ${category}:`, processedValues);

            // Create group members array for this category
            const groupMembers = processedValues.map(symptomValue => {
                // Find the option object for this symptom
                const option = categoryOptions.find(opt => opt.value === symptomValue);
                if (option) {
                    return {
                        concept: option.value,
                        value: option.label,
                        obsDatetime: currentDateTime
                    };
                }
                return null;
            }).filter(Boolean); // Remove any null values

            // Only add the category if it has group members
            if (groupMembers.length > 0) {
                obs.push({
                    concept: categoryConcept,
                    value: categoryConcept,
                    obsDatetime: currentDateTime,
                    groupMembers
                });
            }
        }

        // Debug the final obs structure
        console.log("Final obs structure:", obs);

        // Submit the encounter with all observations
        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            patient: params.id,
            encounterDatetime: currentDateTime,
            visit: activeVisit.uuid,
            obs,
        };

        try {
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
                ent: [],
                endocrine: [],
                cardiac: [],
                respiratory: [],
                gastrointestinal: [],
                genitourinary: [],
                musculoskeletal: [],
                neurologic: [],
                psychiatric: [],
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