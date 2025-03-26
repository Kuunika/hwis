"use client";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    CheckboxesGroup,
    FormValuesListener,
    RadioGroupInput, // Ensure this is imported
} from "@/components";
import * as yup from "yup";
import React, { useState } from "react";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// List of presenting complaints
const presentingComplaintsConfig = [
    { value: "Feeling of a mass", label: "Feeling of a mass" },
    { value: "Pain", label: "Pain" },
    { value: "Difficulty/Pain on passing stools", label: "Difficulty/Pain on passing stools" },
    { value: "Not passing stools", label: "Not passing stools" },
    { value: "Not passing flatus", label: "Not passing flatus" },
    { value: "Passing bloody stools", label: "Passing bloody stools" },
    { value: "Passing melena", label: "Passing melena" },
    { value: "Vomiting", label: "Vomiting" },
    { value: "Vomiting blood", label: "Vomiting blood" },
    { value: "Dysphagia", label: "Dysphagia" },
    { value: "Odynophagia", label: "Odynophagia" },
    { value: "Ulcer", label: "Ulcer" },
    { value: "Yellowing of the eyes", label: "Yellowing of the eyes" },
    { value: "Not passing urine", label: "Not passing urine" },
    { value: "Difficulty passing urine", label: "Difficulty passing urine" },
    { value: "Passing deep yellow urine", label: "Passing deep yellow urine" },
    { value: "Passing pus in urine", label: "Passing pus in urine" },
    { value: "Bleeding", label: "Bleeding" },
    { value: "Shortness of breath", label: "Shortness of breath" },
    { value: "Other", label: "Other (Specify)" }, // "Other" option
];

// Location options
const locationOptions = [
    { value: "Breast", label: "Breast" },
    { value: "Chest", label: "Chest" },
    { value: "Arm", label: "Arm" },
    { value: "Forearm", label: "Forearm" },
    { value: "Hand", label: "Hand" },
    { value: "Thigh", label: "Thigh" },
    { value: "Leg", label: "Leg" },
    { value: "Foot", label: "Foot" },
    { value: "Head", label: "Head" },
    { value: "Neck", label: "Neck" },
];

// Validation schema
const schema = yup.object().shape({
    presentingComplaints: yup
        .array()
        .of(
            yup.object().shape({
                key: yup.string().required(),
                value: yup.boolean().required(),
            })
        )
        .transform((value) =>
            Array.isArray(value) ? value.filter((item: any) => item.value === true) : []
        )
        .min(1, "Select at least one complaint"),

    otherComplaintSpecify: yup
        .string()
        .nullable()
        .when("presentingComplaints", {
            is: (complaints: any[]) => complaints.some((complaint) => complaint.key === "Other"),
            then: (schema) => schema.required("Please specify the other complaint"),
        }),

    historyOfPresentingComplaint: yup.string().required("History is required"),
});

export const PresentingComplaintsForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [showOtherTextField, setShowOtherTextField] = useState(false);
    const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);

    const handleCheckboxChange = (values: any) => {
        setSelectedComplaints(values.filter((item: any) => item.value).map((item: any) => item.key));
        setShowOtherTextField(values.some((val: any) => val.key === "Other" && val.value));
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                presentingComplaints: [],
                otherComplaintSpecify: "",
                historyOfPresentingComplaint: "",
                location: "", // Add location field
            }}
            onSubmit={(values) => {
                console.log("Submitting form data:", values);
                toast.success("Presenting Complaints Form submitted successfully!");
            }}
        >
            <FormValuesListener getValues={setFormValues} />

            <FormFieldContainer direction="row">
                {/* Presenting Complaints Checkboxes */}
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width: "100%" }}>
                    <h4>Presenting Complaints</h4>
                    {presentingComplaintsConfig.map((complaint) => (
                        <div key={complaint.value} style={{ marginBottom: "10px" }}>
                            <CheckboxesGroup
                                name="presentingComplaints"
                                allowFilter={false}
                                options={[complaint]} // Only render one checkbox per row
                                getValue={handleCheckboxChange}
                            />
                            {/* Show RadioGroupInput below specific complaints */}
                            {selectedComplaints.includes(complaint.value) &&
                                ["Feeling of a mass", "Pain", "Ulcer", "Bleeding"].includes(
                                    complaint.value
                                ) && (
                                    <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                                        <RadioGroupInput
                                            name="location"
                                            label="Location"
                                            options={locationOptions}
                                        />
                                    </div>
                                )}
                        </div>
                    ))}

                    {showOtherTextField && (
                        <TextInputField
                            id="otherComplaintSpecify"
                            label="Specify Other Complaint"
                            name="otherComplaintSpecify"
                            placeholder="Specify the complaint"
                        />
                    )}
                    <br />

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