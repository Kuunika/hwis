"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import {
    FormikInit,
    FormFieldContainer,
    WrapperBox,
    RadioGroupInput,
    FormFieldContainerLayout,
    TextInputField,
} from "@/components";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Validation schema
const schema = Yup.object().shape({
    hasSurgicalHistory: Yup.string().required("Please select Yes or No"),
    surgicalDetails: Yup.string().required(" "),
});

export const PastSurgicalHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                hasSurgicalHistory: "",
                surgicalDetails: "",
            }}
            onSubmit={(values) => console.log("Surgical History:", values)}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>

                    <FormFieldContainerLayout title="Any history of previous surgery or procedures?">

                        {/* Yes/No Radio Buttons */}
                        <RadioGroupInput
                            name="hasSurgicalHistory"
                            label="Has Surgical History"
                            options={[
                                { value: "Yes", label: "Yes" },
                                { value: "No", label: "No" },
                            ]}
                        />

                        {/* Text Input for Surgery Details - Shown if 'Yes' is selected */}
                        <TextInputField
                            id="surgicalDetails"
                            name="surgicalDetails"
                            label="Enter previous procedures and surgeries (Month & Year)"
                            placeholder="E.g., Appendectomy - January 2020"
                            multiline
                            rows={5}
                        />
                    </FormFieldContainerLayout>

                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};