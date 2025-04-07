"use client";
import React, { useState } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    CheckboxesGroup,
    FormFieldContainerLayout,
    TextInputField,
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
    cancerType: Yup.string().when("familyHistory", {
        is: (values: string[]) => values.includes("Cancer"),
        then: (schema) => schema.required("Please specify the type of cancer"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export const FamilyHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

    const handleCheckboxChange = (values: any) => {
        setSelectedConditions(values.filter((item: any) => item.value).map((item: any) => item.key));
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                familyHistory: [],
                cancerType: "",
            }}
            onSubmit={(values) => console.log("Selected Family History:", values)}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Family History">


                        {familyHistoryOptions.map((condition) => (
                            <div key={condition} style={{ marginBottom: "10px" }}>
                                <CheckboxesGroup
                                    name="familyHistory"
                                    allowFilter={false}
                                    options={[{ value: condition, label: condition }]}
                                    getValue={handleCheckboxChange}
                                />

                                {/* Show Text Input if "Cancer" is selected */}
                                {selectedConditions.includes("Cancer") && condition === "Cancer" && (
                                    <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                                        <TextInputField
                                            name="cancerType"
                                            label="Type of Cancer"
                                            placeholder="Specify cancer type" id={""} />
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