"use client";
import React from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    RadioGroupInput
} from "@/components";
import * as Yup from "yup";

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

export const PhysicalExaminationForm = ({ onSubmit, onSkip }: Prop) => {
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
            onSubmit={(values) => console.log("Physical Examination Data:", values)}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <h4>Physical Examination</h4>

                    {/* General */}
                    <h5>General Condition</h5>
                    <RadioGroupInput name="general" options={physicalExaminationOptions.general.map((option) => ({ value: option, label: option }))} label={""} />

                    {/* Vitals */}
                    <h5>Vitals</h5>
                    <TextInputField name="temperature" label="Temperature" type="text" id={""} />
                    <TextInputField name="pulse" label="Pulse" type="text" id={""} />
                    <TextInputField name="bloodPressure" label="Blood Pressure (BP)" type="text" id={""} />
                    <TextInputField name="respiratoryRate" label="Respiratory Rate" type="text" id={""} />

                    {/* Eyes */}
                    <h5>Eyes</h5>
                    <RadioGroupInput name="eyes" options={physicalExaminationOptions.eyes.map((option) => ({ value: option, label: option }))} label={""} />

                    {/* Mouth */}
                    <h5>Mouth</h5>
                    <RadioGroupInput name="mouth" options={physicalExaminationOptions.mouth.map((option) => ({ value: option, label: option }))} label={""} />

                    {/* Neck */}
                    <h5>Neck</h5>
                    <RadioGroupInput name="neck" options={physicalExaminationOptions.neck.map((option) => ({ value: option, label: option }))} label={""} />

                    {/* Chest */}
                    <h5>Chest Examination</h5>
                    <TextInputField name="chest" label="Chest" type="text" id={""} />

                    {/* Endocrine */}
                    <h5>Endocrine Examination</h5>
                    <RadioGroupInput name="endocrine" options={physicalExaminationOptions.endocrine.map((option) => ({ value: option, label: option }))} label={""} />

                    {/* Abdomen */}
                    <h5>Abdominal Examination</h5>
                    <TextInputField name="abdomen" label="Abdomen" type="text" id={""} />

                    {/* Glasgow Coma Scale (GCS) */}
                    <h4>Glasgow Coma Scale (GCS)</h4>

                    <h5>Motor Response</h5>
                    <RadioGroupInput name="motorResponse" options={gcsOptions.motorResponse.map((option) => ({ value: option, label: option }))} label={""} />

                    <h5>Verbal Response</h5>
                    <RadioGroupInput name="verbalResponse" options={gcsOptions.verbalResponse.map((option) => ({ value: option, label: option }))} label={""} />

                    <h5>Eye Response</h5>
                    <RadioGroupInput name="eyeResponse" options={gcsOptions.eyeResponse.map((option) => ({ value: option, label: option }))} label={""} />

                    {/* Additional Examinations */}
                    <h4>Additional Examinations</h4>

                    <TextInputField name="cranialNerves" label="Cranial Nerves" type="text" id={""} />
                    <TextInputField name="grossMotor" label="Gross Motor" type="text" id={""} />
                    <TextInputField name="sensation" label="Sensation" type="text" id={""} />
                    <h4>Extremities</h4>

                    <TextInputField name="pulsations" label="Pulsations" type="text" id={""} />
                    <TextInputField name="rectalExamination" label="Rectal Examination" type="text" id={""} />
                    <TextInputField name="vaginalExamination" label="Vaginal Examination (For Females Only)" type="text" id={""} />
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};