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
import { Label } from "@mui/icons-material";

// Define the checklist options for each system
const reviewOfSystemsOptions = {
    general: ["Fever", "Lymphadenopathy", "Night sweats", "Fatigue", "Weight loss"],
    ent: ["Eye pain", "Rhinorrhea", "Tinnitus", "Epistaxis", "painSinus ", "Oral lesions", "Dysphagia", "Odynophagia", "Other"],
    endocrine: ["Heat tolerance", "Abnormal hair growth", "Cold tolerance", "Polyuria", "Polydipsia", "Other"],
    cardiac: ["Bleeding tendencies", "Chest pain", "Palpitations", "Oedema", "Cyanosis", "Claudication", "Orthopnoea", "Paroxysmal nocturnal dyspnoea", "Other"],
    respiratory: ["Shortness of breath", "Dyspnoea on exertion", "Dyspnoea at rest", "Cough", "Haemoptysis", "Wheezing", "Other"],
    gastrointestinal: ["Nausea", "Vomiting", "Melena", "Haematochezia", "Change in appetite", "Abdominal pain", "Change in bowel habit", "Heartburn"],
    genitourinary: ["Dysuria", "Urgency", "Incontinence", "Haematuria", "Pyuria", "Sexually Transmitted Infection (STI)", "Abnormal vaginal discharge", "Dysmenorrhea", "Pelvic pain"],
    musculoskeletal: ["Joint pain", "Joint swelling", "Back pain"],
    neurologic: ["Headache", "Change in smell", "Change in taste", "Paraesthesias", "Muscle weakness", "Ataxia", "Change in speech"],
    psychiatric: ["Depression", "Anxiety", "Hallucinations", "Mania", "Suicidal thoughts"],
};

//add:
// Eye pain
// Rhinorrhea
//  Sinus pain
// Oral lesions
// Heat tolerance
// Abnormal hair growth
// Cold tolerance
// Polydipsia
// Bleeding tendencies
// Chest pain
// Palpitations
// Claudication
// Orthopnoea
// Paroxysmal nocturnal dyspnoea
// Dyspnoea on exertion
// "Dyspnoea at rest
// Melena
// Haematochezia
// Change in appetite
// Change in bowel habit
// Heartburn
// Urgency
// Incontinence
// Pyuria
// Sexually Transmitted Infection (STI)
// Dysmenorrhea
// Pelvic pain
// Change in smell
// Change in taste
// Paraesthesias
// Muscle weakness
// Ataxia
// Change in speech
// Depression
// Mania
// Suicidal thoughts

const generalOptions = [
    {value: concepts.FEVER, label:"Fever" },
    {value: concepts.LYMPHADENOPATHY, label:"Lymphadenopathy" },
    {value: concepts.NIGHT_SWEATS, label:"Night sweats" },
    {value: concepts.FATIGUE, label:"Fatigue" },
    {value: concepts.WEIGHT_LOSS, label:"Weight loss" },
]
const entOptions = [
    {value: concepts.TINNITUS, label:"Tinnitus" },
    {value: concepts.EPISTAXIS, label:"Epistaxis" },
    {value: concepts.DYSPHAGIA, label:"Dysphagia" },
    {value: concepts.ODYNOPHAGIA, label:"Odynophagia" },
]

const endocrineOptions = [
    {value: concepts.POLYURIA, label:"Polyuria" },

]
const cardiacOptions = [
    {value: concepts.HEART_PALPITATIONS, Label:"Palpitations" },
    {value: concepts.OEDEMA, label:"Oedema" },
    {value: concepts.CYANOSIS, label:"Cyanosis" },
]

const respiratoryOptions = [
    {value: concepts.SHORTNESS_OF_BREATH, label:"Shortness Of Breath" },
    {value: concepts.COUGH, label:"Cough" },
    {value: concepts.HAEMOPTYSIS, label:"Haemoptysis" },
    {value: concepts.WHEEZING, label:"Wheezing" },  
]
const gastrointestinalOptions = [
    {value: concepts.NAUSEA, label:"Nausea" },
    {value: concepts.VOMITING, label:"Vomiting" },
    {value: concepts.ABDOMINALPAINS, label:"Abdominal pain" },
]
const genitourinaryOptions = [
    {value: concepts.DYSURIA, label:"Dysuria" },
    {value: concepts.HAEMATURIA, label:"Haematuria" },
    {value: concepts.ABNORMAL_VAGINAL_DISCHARGE, label:"bnormal Vaginal Discharge" },

]
const musculoskeletalOptions = [
    {value: concepts.JOINT_PAIN, label:"Joint Pain" },
    {value: concepts.SWELLING_JOINT, label:"Joint Swelling" },
    {value: concepts.PAIN_BACK, label:"Back Pain" },
]

const neurologicOptions = [
    {value: concepts.HEADACHE, label:"Headache" },

]
const psychiatricOptions = [
    {value: concepts.ANXIETY, label:"Anxiety" },
    {value: concepts.HALLUCINATIONS, label:"Hallucinations" },
]

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