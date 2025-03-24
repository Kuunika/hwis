"use client";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    CheckboxesGroup,
} from "@/components";
import * as yup from "yup";
import React from "react";

// List of past medical history conditions
const pastMedicalHistoryOptions = [
    "HIV",
    "Tuberculosis (TB)",
    "Chronic Obstructive Pulmonary Disease (COPD)",
    "Diabetes Mellitus",
    "Asthma",
    "Epilepsy",
    "Previous stroke",
    "Bleeding disorders"
];

// Validation schema
const schema = yup.object().shape({
    pastMedicalHistory: yup.array().min(1, "Select at least one condition"),
});

export const PastMedicalHistoryForm = () => {
    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                pastMedicalHistory: [],
            }}
            onSubmit={(values) => console.log("Past Medical History:", values.pastMedicalHistory)}
        >
            <FormFieldContainer direction="column">
                {/* Past Medical History Checkboxes */}
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <h4>Past Medical History</h4>
                    <CheckboxesGroup
                        name="pastMedicalHistory"
                        allowFilter={false}
                        options={pastMedicalHistoryOptions.map((item) => ({
                            value: item,
                            label: item
                        }))}
                    />
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};