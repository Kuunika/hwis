"use client";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    CheckboxesGroup,
} from "@/components";
import * as yup from "yup";
import React from "react";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// List of presenting complaints
const presentingComplaintsOptions = [
    "Feeling of a mass",
    "Pain",
    "Difficulty/Pain on passing stools",
    "Not passing stools",
    "Not passing flatus",
    "Passing bloody stools",
    "Passing melena",
    "Vomiting",
    "Vomiting blood",
    "Dysphagia",
    "Odynophagia",
    "Ulcer",
    "Yellowing of the eyes",
    "Not passing urine",
    "Difficulty passing urine",
    "Passing deep yellow urine",
    "Passing pus in urine",
    "Bleeding",
    "Shortness of breath"
];

// Validation schema
const schema = yup.object().shape({
    presentingComplaints: yup.array().min(1, "Select at least one complaint"),
    historyOfPresentingComplaint: yup.string().required("History is required"),
});

export const PresentingComplaintsForm = ({ onSubmit, onSkip }: Prop) => {
    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                presentingComplaints: [],
                historyOfPresentingComplaint: "",
            }}
            onSubmit={(values) =>
                console.log("Form Data:", values)
            }
        >
            <FormFieldContainer direction="column">
                {/* Presenting Complaints Checkboxes */}
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width: "100%" }}>
                    <h4>Presenting Complaints</h4>
                    <CheckboxesGroup
                        name="presentingComplaints"
                        allowFilter={false}
                        options={presentingComplaintsOptions.map((item) => ({
                            value: item,
                            label: item
                        }))}
                    />
                </WrapperBox>

                {/* History of Presenting Complaint - Text Field */}
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <TextInputField
                        id="historyOfPresentingComplaint"
                        name="historyOfPresentingComplaint"
                        label="History of Presenting Complaint"
                        multiline
                        rows={5}
                        placeholder="Describe the history of the presenting complaint..."
                    />
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};