"use client";
import React from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    CheckboxesGroup,
} from "@/components";
import * as Yup from "yup";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Family History options
const familyHistoryOptions = [
    "Asthma",
    "Diabetes",
    "Epilepsy",
    "Hypertension",
    "Cancer",
];

// Validation schema
const schema = Yup.object().shape({
    familyHistory: Yup.array().min(1, "Please select at least one option"),
});

export const FamilyHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{ familyHistory: [] }}
            onSubmit={(values) => console.log("Selected Family History:", values.familyHistory)}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <h4>Family History</h4>

                    {/* Family History Checkboxes */}
                    <CheckboxesGroup
                        name="familyHistory"
                        allowFilter={false}
                        options={familyHistoryOptions.map((item) => ({
                            value: item,
                            label: item,
                        }))}
                    />
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};