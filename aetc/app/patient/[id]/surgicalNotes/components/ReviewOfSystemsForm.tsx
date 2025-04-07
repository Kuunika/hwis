"use client";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { FormikInit, WrapperBox, FormFieldContainer, FormFieldContainerLayout, CheckboxesGroup } from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";

// Define the checklist options for each system
const reviewOfSystemsOptions = {
    general: ["Fever", "Lymphadenopathy", "Night sweats", "Fatigue", "Weight loss"],
    ent: ["Eye pain", "Rhinorrhea", "Tinnitus", "Epistaxis", "Sinus pain", "Oral lesions", "Dysphagia", "Odynophagia", "Other"],
    endocrine: ["Heat tolerance", "Abnormal hair growth", "Cold tolerance", "Polyuria", "Polydipsia", "Other"],
    cardiac: ["Bleeding tendencies", "Chest pain", "Palpitations", "Oedema", "Cyanosis", "Claudication", "Orthopnoea", "Paroxysmal nocturnal dyspnoea", "Other"],
    respiratory: ["Shortness of breath", "Dyspnoea on exertion", "Dyspnoea at rest", "Cough", "Haemoptysis", "Wheezing", "Other"],
    gastrointestinal: ["Nausea", "Vomiting", "Melena", "Haematochezia", "Change in appetite", "Abdominal pain", "Change in bowel habit", "Heartburn"],
    genitourinary: ["Dysuria", "Urgency", "Incontinence", "Haematuria", "Pyuria", "Sexually Transmitted Infection (STI)", "Abnormal vaginal discharge", "Dysmenorrhea", "Pelvic pain"],
    musculoskeletal: ["Joint pain", "Joint swelling", "Back pain"],
    neurologic: ["Headache", "Change in smell", "Change in taste", "Paraesthesias", "Muscle weakness", "Ataxia", "Change in speech"],
    psychiatric: ["Depression", "Anxiety", "Hallucinations", "Mania", "Suicidal thoughts"],
};
const validationSchema = Yup.object({});

//// encounter: SURGICAL_NOTES_TEMPLATE_FORM

// concepts: REVIEW_OF_SYSTEMS_GENERAL,  ENT, SECRETION (endocrine), REVIEW_OF_SYSTEMS_CARDIOPULMONARY, SEVERE_RESPIRATORY,    REVIEW_OF_SYSTEMS_GASTROINTESTINAL, REVIEW_OF_SYSTEMS_GENITOURINARY, , PAIN,  FOCAL_NEUROLOGICAL,  PSYCHIATRY,
// new concepts:REVIEW_OF_SYSTEMS_GENERAL, ENT, REVIEW_OF_SYSTEMS__ENDOCRINE, REVIEW_OF_SYSTEMS_CARDIAC, SEVERE_RESPIRATORY, REVIEW_OF_SYSTEMS_GASTROINTESTINAL, REVIEW_OF_SYSTEMS_GENITOURINARY,  REVIEW_OF_SYSTEMS_MUSCULOSKELETAL, REVIEW_OF_SYSTEMS_NEUROLOGIC, REVIEW_OF_SYSTEMS_PSYCHIATRIC, 

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

    const handleSubmit = async (values: any) => {
        const currentDateTime = getDateTime();

        if (!params.id || !activeVisit) {
            console.error("Missing patient ID or active visit");
            return;
        }

        // Map form values to concept UUIDs
        const observations = [
            { concept: concepts.REVIEW_OF_SYSTEMS_GENERAL, value: values.general.join(", "), obsDatetime: currentDateTime, },
            { concept: concepts.ENT, value: values.ent.join(", "), obsDatetime: currentDateTime, },
            { concept: concepts.REVIEW_OF_SYSTEMS__ENDOCRINE, value: values.endocrine.join(", "), obsDatetime: currentDateTime, },
            { concept: concepts.REVIEW_OF_SYSTEMS_CARDIAC, value: values.cardiac.join(", "), obsDatetime: currentDateTime, },
            { concept: concepts.SEVERE_RESPIRATORY, value: values.respiratory.join(", "), obsDatetime: currentDateTime, },
            { concept: concepts.REVIEW_OF_SYSTEMS_GASTROINTESTINAL, value: values.gastrointestinal.join(", "), obsDatetime: currentDateTime, },
            { concept: concepts.REVIEW_OF_SYSTEMS_GENITOURINARY, value: values.genitourinary.join(", "), obsDatetime: currentDateTime, },
            { concept: concepts.REVIEW_OF_SYSTEMS_MUSCULOSKELETAL, value: values.musculoskeletal.join(", "), obsDatetime: currentDateTime, },
            { concept: concepts.REVIEW_OF_SYSTEMS_NEUROLOGIC, value: values.neurologic.join(", "), obsDatetime: currentDateTime, },
            { concept: concepts.REVIEW_OF_SYSTEMS_PSYCHIATRIC, value: values.psychiatric.join(", "), obsDatetime: currentDateTime, },
        ].filter((obs) => obs.value !== ""); // Exclude empty values

        // Save encounter with observations
        submitEncounter({
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            patient: params.id,
            encounterDatetime: getDateTime(),
            visit: activeVisit.uuid,
            observations,
        });

        onSubmit(values);
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

            onSubmit={handleSubmit} // Call the updated function here
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
                                        value: item,
                                        label: item,
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