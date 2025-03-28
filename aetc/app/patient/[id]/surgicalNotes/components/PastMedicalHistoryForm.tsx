"use client";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
    CheckboxesGroup,
    RadioGroupInput,
} from "@/components";
import * as yup from "yup";
import React, { useState } from "react";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// List of past medical history conditions
const pastMedicalHistoryOptions = [
    "HIV",
    "Tuberculosis (TB)",
    "Chronic Obstructive Pulmonary Disease (COPD)",
    "Diabetes Mellitus",
    "Asthma",
    "Epilepsy",
    "Previous stroke",
    "Bleeding disorders",
];

// Diabetes Type options
const diabetesTypeOptions = [
    { value: "Type I", label: "Type I" },
    { value: "Type II", label: "Type II" },
    { value: "Unsure", label: "Unsure" },
];

// Diabetes Control options
const diabetesControlOptions = [
    { value: "Diet", label: "Diet" },
    { value: "Tablet", label: "Tablet" },
    { value: "Insulin", label: "Insulin" },
];

// Validation schema
const schema = yup.object().shape({
    pastMedicalHistory: yup.array().min(1, "Select at least one condition"),
    diabetesType: yup.string().nullable(),
    diabetesControl: yup.string().nullable(),
});

export const PastMedicalHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

    const handleCheckboxChange = (values: any) => {
        setSelectedConditions(values.filter((item: any) => item.value).map((item: any) => item.key));
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                pastMedicalHistory: [],
                diabetesType: "", // Added diabetes type field
                diabetesControl: "", // Added diabetes control field
            }}
            onSubmit={(values) => console.log("Past Medical History:", values)}
        >
            <FormFieldContainer direction="column">
                {/* Past Medical History Checkboxes */}
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Past Medical History">

                        {pastMedicalHistoryOptions.map((condition) => (
                            <div key={condition} style={{ marginBottom: "10px" }}>
                                <CheckboxesGroup
                                    name="pastMedicalHistory"
                                    allowFilter={false}
                                    options={[{ value: condition, label: condition }]}
                                    getValue={handleCheckboxChange}
                                />
                                {/* Show Diabetes Type & Control options if Diabetes Mellitus is selected */}
                                {selectedConditions.includes("Diabetes Mellitus") &&
                                    condition === "Diabetes Mellitus" && (
                                        <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                                            <RadioGroupInput
                                                name="diabetesType"
                                                label="Type"
                                                options={diabetesTypeOptions}
                                            />
                                            <RadioGroupInput
                                                name="diabetesControl"
                                                label="Controlled by"
                                                options={diabetesControlOptions}
                                            />
                                        </div>
                                    )}
                            </div>
                        ))}
                    </FormFieldContainerLayout>

                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};