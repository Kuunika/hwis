"use client";
import React from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    FormFieldContainerLayout,
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