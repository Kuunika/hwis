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
import { getActivePatientDetails } from "@/hooks";

import { Visit } from "@/interfaces";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Define options for radio group fields
const physicalExaminationOptions = {
    general: [
        { value: concepts.SEVERE_PAIN, label: "In Pain" },
        { value: concepts.COMFORTABLE, label: "Comfortable" },
        { value: concepts.ILL, label: "Ill" },
        { value: concepts.FIT_FOR_AGE, label: "Fit for age" },
    ],
    eyes: [
        { value: concepts.PALLOR, label: "Pallor" },
        { value: concepts.JAUNDICE, label: "Jaundice" },
    ],
    mouth: [
        { value: concepts.CANDIDA, label: "Candida" },
        { value: concepts.KAPOSI_SARCOMA, label: "Kaposi's Sarcoma (KS)" },
        { value: concepts.HYDRATION, label: "Hydration" },
    ],
    neck: [
        { value: concepts.NODES, label: "Nodes" },
        { value: concepts.SUBMENTAL, label: "Submental" },
        { value: concepts.EPITHROCHLEAR, label: "Epithrochlear" },
    ],
    endocrine: [
        { value: concepts.BREAST, label: "Breast" },
        { value: concepts.THYROID, label: "Thyroid" },

    ]
};


// Glasgow Coma Scale (GCS) options
const gcsOptions = {
    motorResponse: [
        { value: concepts.NO_MOVEMENT, label: "No movement" },
        { value: concepts.ABNORMAL_EXTENSION, label: "Abnormal extension (decerebrate posture)" },
        { value: concepts.ABNORMAL_FLEXION, label: "Abnormal flexion (decorticate posture)" },
        { value: concepts.FLEXION_WITHDRAWAL_FROM_PAINFUL_STIMULI, label: "Flexion/Withdrawal from painful stimuli" },
        { value: concepts.MOVES_TO_LOCALIZE_PAIN, label: "Moves to localize pain" },
        { value: concepts.OBEYS_COMMANDS, label: "Obeys commands" },
    ],
    verbalResponse: [
        { value: concepts.NO_SOUND, label: "No sound" },
        { value: concepts.INCOMPREHENSIBLE_SOUNDS, label: "Incomprehensible sounds" },
        { value: concepts.INAPPROPRIATE_WORDS, label: "Inappropriate words" },
        { value: concepts.CONFUSED_AND_DISORIENTED, label: "Confused and disoriented, but able to answer questions" },
        { value: concepts.ORIENTED_TO_TIME, label: "Oriented to time, person, and place, converses normally" },
    ],
    eyeResponse: [
        { value: concepts.DOES_NOT_OPEN_EYES, label: "Does not open eyes" },
        { value: concepts.OPENS_EYES_IN_RESPONSE_TO_PAIN, label: "Opens eyes in response to pain" },
        { value: concepts.OPENS_EYES_IN_RESPONSE_TO_VOICE, label: "Opens eyes in response to voice" },
        { value: concepts.OPENS_EYES_SPONTANEOUSLY, label: "Opens eyes spontaneously" },
    ],
};


const validationSchema = Yup.object({});

//// encounter: SURGICAL_NOTES_TEMPLATE_FORM
// concepts:  CONDITION, TEMPERATURE, PULSE_RATE, BLOOD_PRESSURE_MEASURED, RESPIRATORY_RATE, PALLOR, JAUNDICE,  KAPOSI_SARCOMA_LESIONS, LYMPH_NODES,  MOTOR_RESPONSE, VERBAL_RESPONSE,  EYE_OPENING_RESPONSE  DIGITAL_VAGINAL_EXAMINATION
// new concepts: GENERAL_CONDITION , TEMPERATURE,  PULSE_RATE,  BLOOD_PRESSURE_MEASURED,  RESPIRATORY_RATE,  EYES, MOUTH,  NECK, CHEST_EXAMINATION, ENDOCRINE_EXAMINATION, ABDOMINAL_EXAMINATION, MOTOR_RESPONSE, VERBAL_RESPONSE,  EYE_OPENING_RESPONSE,  CRANIAL_ERVES, GROSS_MOTOR, SENSATION, PULSATIONS, RECTAL_EXAMINATION, VAGINAL_EXAMINATION 
export const PhysicalExaminationForm = ({ onSubmit, onSkip }: Prop) => {
    const { gender } = getActivePatientDetails();

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

        const currentDateTime = getDateTime();

        // Helper to create observation
        const createObs = (concept: string, value: any) => ({
            concept,
            value,
            obsDatetime: currentDateTime,
        });

        // Create the obs array
        const obs = [
            createObs(concepts.GENERAL_CONDITION, values.general),
            createObs(concepts.TEMPERATURE, values.temperature),
            createObs(concepts.PULSE_RATE, values.pulse),
            createObs(concepts.BLOOD_PRESSURE_MEASURED, values.bloodPressure),
            createObs(concepts.RESPIRATORY_RATE, values.respiratoryRate),
            createObs(concepts.EYES, values.eyes),
            createObs(concepts.MOUTH, values.mouth),
            createObs(concepts.NECK, values.neck),
            createObs(concepts.CHEST_EXAMINATION, values.chest),
            createObs(concepts.ENDOCRINE_EXAMINATION, values.endocrine),
            createObs(concepts.ABDOMINAL_EXAMINATION, values.abdomen),
            createObs(concepts.MOTOR_RESPONSE, values.motorResponse),
            createObs(concepts.VERBAL_RESPONSE, values.verbalResponse),
            createObs(concepts.EYE_OPENING_RESPONSE, values.eyeResponse),
            createObs(concepts.CRANIAL_ERVES, values.cranialNerves),
            createObs(concepts.GROSS_MOTOR, values.grossMotor),
            createObs(concepts.SENSATION, values.sensation),
            createObs(concepts.PULSATIONS, values.pulsations),
            createObs(concepts.RECTAL_EXAMINATION, values.rectalExamination),
            createObs(concepts.VAGINAL_EXAMINATION, values.vaginalExamination),
        ].filter((item) => item.value && item.value !== ""); // Filter out empty obs

        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            patient: params.id,
            visit: activeVisit.uuid,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            console.log("Physical Examination submitted successfully!");
            onSubmit(values); // Proceed to the next step
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
                            <RadioGroupInput name="general" options={physicalExaminationOptions.general} label={""} />
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

                            <RadioGroupInput name="eyes" options={physicalExaminationOptions.eyes} label={""} />
                        </FormFieldContainerLayout>

                        {/* Mouth */}
                        <FormFieldContainerLayout title="Mouth">

                            <RadioGroupInput name="mouth" options={physicalExaminationOptions.mouth} label={""} />
                        </FormFieldContainerLayout>

                        {/* Neck */}
                        <FormFieldContainerLayout title="Neck">

                            <RadioGroupInput name="neck" options={physicalExaminationOptions.neck} label={""} />                        </FormFieldContainerLayout>

                        {/* Chest */}
                        <FormFieldContainerLayout title="Chest Examination">

                            <TextInputField sx={{ width: "100%" }}
                                name="chest" label="Chest" type="text" id={""} />
                        </FormFieldContainerLayout>

                        {/* Endocrine */}
                        <FormFieldContainerLayout title="Endocrine Examination">

                            <RadioGroupInput name="endocrine" options={physicalExaminationOptions.endocrine} label={""} />
                        </FormFieldContainerLayout>

                        {/* Abdomen */}
                        <FormFieldContainerLayout title="Abdominal Examination">

                            <TextInputField sx={{ width: "100%" }}
                                name="abdomen" label="Abdomen" type="text" id={""} />
                        </FormFieldContainerLayout>

                        {/* Glasgow Coma Scale (GCS) */}
                        <FormFieldContainerLayout title="Glasgow Coma Scale (GCS)">

                            <h5>Motor Response</h5>
                            <RadioGroupInput name="motorResponse" options={gcsOptions.motorResponse} label={""} />

                            <h5>Verbal Response</h5>
                            <RadioGroupInput name="verbalResponse" options={gcsOptions.verbalResponse} label={""} />

                            <h5>Eye Response</h5>
                            <RadioGroupInput name="eyeResponse" options={gcsOptions.eyeResponse} label={""} />

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
                            {gender == "Female" && (

                                <TextInputField sx={{ width: "100%" }}
                                    name="vaginalExamination" label="Vaginal Examination (For Females Only)" type="text" id={""} />
                            )}

                        </FormFieldContainerLayout>

                    </FormFieldContainerLayout>

                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};