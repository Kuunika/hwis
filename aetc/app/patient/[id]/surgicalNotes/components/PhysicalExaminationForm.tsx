"use client";
import React, { useState, useEffect } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    FormFieldContainerLayout,
    RadioGroupInput
} from "@/components";
import * as Yup from "yup";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Define options for radio group fields
const physicalExaminationOptions = {
    general: ["In pain", "Comfortable", "Ill", "Fit for age"],
    eyes: ["Pallor", "Jaundice"],
    mouth: ["Candida", "Kaposi's Sarcoma (KS)", "Hydration"],
    neck: ["Nodes", "Submental", "Epithrochlear"],
    endocrine: ["Breast", "Thyroid"],
};

// Glasgow Coma Scale (GCS) options
const gcsOptions = {
    motorResponse: [
        "No movement",
        "Abnormal extension (decerebrate posture)",
        "Abnormal flexion (decorticate posture)",
        "Flexion/Withdrawal from painful stimuli",
        "Moves to localize pain",
        "Obeys commands",
    ],
    verbalResponse: [
        "No sound",
        "Incomprehensible sounds",
        "Inappropriate words",
        "Confused and disoriented, but able to answer questions",
        "Oriented to time, person, and place, converses normally",
    ],
    eyeResponse: [
        "Does not open eyes",
        "Opens eyes in response to pain",
        "Opens eyes in response to voice",
        "Opens eyes spontaneously",
    ],
};
const validationSchema = Yup.object({});

//// encounter: SURGICAL_NOTES_TEMPLATE_FORM
// concepts:  CONDITION, TEMPERATURE, PULSE_RATE, BLOOD_PRESSURE_MEASURED, RESPIRATORY_RATE, PALLOR, JAUNDICE,  KAPOSI_SARCOMA_LESIONS, LYMPH_NODES,  MOTOR_RESPONSE, VERBAL_RESPONSE,  EYE_OPENING_RESPONSE  DIGITAL_VAGINAL_EXAMINATION
// new concepts: GENERAL_CONDITION , TEMPERATURE,  PULSE_RATE,  BLOOD_PRESSURE_MEASURED,  RESPIRATORY_RATE,  EYES, MOUTH,  NECK, CHEST_EXAMINATION, ENDOCRINE_EXAMINATION, ABDOMINAL_EXAMINATION, MOTOR_RESPONSE, VERBAL_RESPONSE,  EYE_OPENING_RESPONSE,  CRANIAL_ERVES, GROSS_MOTOR, SENSATION, PULSATIONS, RECTAL_EXAMINATION, VAGINAL_EXAMINATION 
export const PhysicalExaminationForm = ({ onSubmit, onSkip }: Prop) => {
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
        if (!activeVisit) {
            console.error("No active visit found for the patient.");
            return;
        }

        const encounterPayload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM, // Encounter type
            patient: params.id, // Patient UUID
            visit: activeVisit.uuid, // Visit UUID
            encounterDatetime: getDateTime(), // Current timestamp
            observations: [
                { concept: concepts.GENERAL_CONDITION, value: values.general },
                { concept: concepts.TEMPERATURE, value: values.temperature },
                { concept: concepts.PULSE_RATE, value: values.pulse },
                { concept: concepts.BLOOD_PRESSURE_MEASURED, value: values.bloodPressure },
                { concept: concepts.RESPIRATORY_RATE, value: values.respiratoryRate },
                { concept: concepts.EYES, value: values.eyes },
                { concept: concepts.MOUTH, value: values.mouth },
                { concept: concepts.NECK, value: values.neck },
                { concept: concepts.CHEST_EXAMINATION, value: values.chest },
                { concept: concepts.ENDOCRINE_EXAMINATION, value: values.endocrine },
                { concept: concepts.ABDOMINAL_EXAMINATION, value: values.abdomen },
                { concept: concepts.MOTOR_RESPONSE, value: values.motorResponse },
                { concept: concepts.VERBAL_RESPONSE, value: values.verbalResponse },
                { concept: concepts.EYE_OPENING_RESPONSE, value: values.eyeResponse },
                { concept: concepts.CRANIAL_ERVES, value: values.cranialNerves },
                { concept: concepts.GROSS_MOTOR, value: values.grossMotor },
                { concept: concepts.SENSATION, value: values.sensation },
                { concept: concepts.PULSATIONS, value: values.pulsations },
                { concept: concepts.RECTAL_EXAMINATION, value: values.rectalExamination },
                { concept: concepts.VAGINAL_EXAMINATION, value: values.vaginalExamination },
            ].filter(obs => obs.value !== ""), // Exclude empty fields
        };

        try {
            await submitEncounter(encounterPayload);
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting Physical Examination:", error);
        }
    };
    return (
        <FormikInit
            initialValues={{
                general: "",
                temperature: "",
                pulse: "",
                bloodPressure: "",
                respiratoryRate: "",
                eyes: "",
                mouth: "",
                neck: "",
                chest: "",
                endocrine: "",
                abdomen: "",
                motorResponse: "",
                verbalResponse: "",
                eyeResponse: "",
                cranialNerves: "",
                grossMotor: "",
                sensation: "",
                pulsations: "",
                rectalExamination: "",
                vaginalExamination: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit} // Call the updated function here
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Physical Examination">

                        {/* General */}
                        <FormFieldContainerLayout title="General Condition">
                            <RadioGroupInput name="general" options={physicalExaminationOptions.general.map((option) => ({ value: option, label: option }))} label={""} />
                        </FormFieldContainerLayout>

                        {/* Vitals */}
                        <FormFieldContainerLayout title="Vitals">

                            <TextInputField sx={{ width: "100%" }}
                                name="temperature" label="Temperature" type="text" id={""} />
                            <TextInputField sx={{ width: "100%" }}
                                name="pulse" label="Pulse" type="text" id={""} />
                            <TextInputField sx={{ width: "100%" }}
                                name="bloodPressure" label="Blood Pressure (BP)" type="text" id={""} />
                            <TextInputField sx={{ width: "100%" }}
                                name="respiratoryRate" label="Respiratory Rate" type="text" id={""} />
                        </FormFieldContainerLayout>

                        {/* Eyes */}
                        <FormFieldContainerLayout title="Eyes">

                            <RadioGroupInput name="eyes" options={physicalExaminationOptions.eyes.map((option) => ({ value: option, label: option }))} label={""} />
                        </FormFieldContainerLayout>

                        {/* Mouth */}
                        <FormFieldContainerLayout title="Mouth">

                            <RadioGroupInput name="mouth" options={physicalExaminationOptions.mouth.map((option) => ({ value: option, label: option }))} label={""} />
                        </FormFieldContainerLayout>

                        {/* Neck */}
                        <FormFieldContainerLayout title="Neck">

                            <RadioGroupInput name="neck" options={physicalExaminationOptions.neck.map((option) => ({ value: option, label: option }))} label={""} />
                        </FormFieldContainerLayout>

                        {/* Chest */}
                        <FormFieldContainerLayout title="Chest Examination">

                            <TextInputField sx={{ width: "100%" }}
                                name="chest" label="Chest" type="text" id={""} />
                        </FormFieldContainerLayout>

                        {/* Endocrine */}
                        <FormFieldContainerLayout title="Endocrine Examination">

                            <RadioGroupInput name="endocrine" options={physicalExaminationOptions.endocrine.map((option) => ({ value: option, label: option }))} label={""} />
                        </FormFieldContainerLayout>

                        {/* Abdomen */}
                        <FormFieldContainerLayout title="Abdominal Examination">

                            <TextInputField sx={{ width: "100%" }}
                                name="abdomen" label="Abdomen" type="text" id={""} />
                        </FormFieldContainerLayout>

                        {/* Glasgow Coma Scale (GCS) */}
                        <FormFieldContainerLayout title="Glasgow Coma Scale (GCS)">

                            <h5>Motor Response</h5>
                            <RadioGroupInput name="motorResponse" options={gcsOptions.motorResponse.map((option) => ({ value: option, label: option }))} label={""} />

                            <h5>Verbal Response</h5>
                            <RadioGroupInput name="verbalResponse" options={gcsOptions.verbalResponse.map((option) => ({ value: option, label: option }))} label={""} />

                            <h5>Eye Response</h5>
                            <RadioGroupInput name="eyeResponse" options={gcsOptions.eyeResponse.map((option) => ({ value: option, label: option }))} label={""} />

                        </FormFieldContainerLayout>

                        {/* Additional Examinations */}

                        <FormFieldContainerLayout title="Additional Examinations">

                            <TextInputField name="cranialNerves" sx={{ width: "100%" }}
                                label="Cranial Nerves" type="text" id={""} />
                            <TextInputField sx={{ width: "100%" }}
                                name="grossMotor" label="Gross Motor" type="text" id={""} />
                            <TextInputField sx={{ width: "100%" }}
                                name="sensation" label="Sensation" type="text" id={""} />

                        </FormFieldContainerLayout>

                        <FormFieldContainerLayout title="Extremities">

                            <TextInputField sx={{ width: "100%" }}
                                name="pulsations" label="Pulsations" type="text" id={""} />
                            <TextInputField sx={{ width: "100%" }}
                                name="rectalExamination" label="Rectal Examination" type="text" id={""} />
                            <TextInputField sx={{ width: "100%" }}
                                name="vaginalExamination" label="Vaginal Examination (For Females Only)" type="text" id={""} />
                        </FormFieldContainerLayout>

                    </FormFieldContainerLayout>

                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};