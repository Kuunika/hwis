"use client";
import React, { useState } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    CheckboxesGroup,
} from "@/components";
import * as Yup from "yup";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Allergy options
const allergyOptions = [
    "Drugs",
    "Food",
    "Skin prep",
    "Latex",
    "Medications",
    "Other",
];

// Validation schema
const schema = Yup.object().shape({
    allergies: Yup.array().min(1, "Please select at least one allergy"),
    drugsDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Drugs"),
        then: (schema) => schema.required("Specify drug allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    foodDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Food"),
        then: (schema) => schema.required("Specify food allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    skinPrepDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Skin prep"),
        then: (schema) => schema.required("Specify skin prep allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    latexDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Latex"),
        then: (schema) => schema.required("Specify latex allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    medicationsDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Medications"),
        then: (schema) => schema.required("Specify medication allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    otherDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Other"),
        then: (schema) => schema.required("Specify other allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export const AllergiesForm = ({ onSubmit, onSkip }: Prop) => {
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

    const handleCheckboxChange = (values: any) => {
        setSelectedAllergies(values.filter((item: any) => item.value).map((item: any) => item.key));
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                allergies: [],
                drugsDetails: "",
                foodDetails: "",
                skinPrepDetails: "",
                latexDetails: "",
                medicationsDetails: "",
                otherDetails: "",
            }}
            onSubmit={(values) => console.log("Selected Allergies:", values)}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <h4>Allergies and Adverse Reactions</h4>

                    {allergyOptions.map((allergy) => (
                        <div key={allergy} style={{ marginBottom: "10px" }}>
                            <CheckboxesGroup
                                name="allergies"
                                allowFilter={false}
                                options={[{ value: allergy, label: allergy }]}
                                getValue={handleCheckboxChange}
                            />

                            {/* Show Text Input if specific allergy is selected */}
                            {selectedAllergies.includes(allergy) && (
                                <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                                    <TextInputField
                                        name={`${allergy.toLowerCase().replace(/\s+/g, '')}Details`}
                                        label={`Specify ${allergy} allergy`}
                                        placeholder={`Enter ${allergy} allergy details`} id={""} />
                                </div>
                            )}
                        </div>
                    ))}
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};