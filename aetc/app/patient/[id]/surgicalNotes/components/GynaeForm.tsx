"use client";
import React from "react";
import * as Yup from "yup";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    RadioGroupInput,
    DatePickerInput,
    FormDatePicker,


} from "@/components";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Function to calculate gestational age from LNMP
const calculateGestationalAge = (lnmp: string | null) => {
    if (!lnmp) return "";
    const lnmpDate = new Date(lnmp);
    const today = new Date();
    const diffInDays = Math.floor((today.getTime() - lnmpDate.getTime()) / (1000 * 60 * 60 * 24));
    const gestationalWeeks = Math.floor(diffInDays / 7);
    return `${gestationalWeeks} weeks`;
};

// Validation schema
const schema = Yup.object().shape({
    areYouPregnant: Yup.string().required("Please select an option"),
    lnmp: Yup.string().when("areYouPregnant", {
        is: "Yes",
        then: (schema) => schema.required("Please enter the Last Normal Menstrual Period"),
        otherwise: (schema) => schema.notRequired(),
    }),
    gestationalAge: Yup.string().when("areYouPregnant", {
        is: "Yes",
        then: (schema) => schema.required("Gestational age is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    parity: Yup.string().when("areYouPregnant", {
        is: "Yes",
        then: (schema) => schema.required("Please enter the parity"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export const GynaeObstetricHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                areYouPregnant: "",
                lnmp: "",
                gestationalAge: "",
                parity: "",
            }}
            onSubmit={(values) => console.log("Form Data:", values)}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <h4>Gynae/Obstetric History (Only for Females)</h4>

                    {/* Pregnancy Status */}
                    <RadioGroupInput
                        name="areYouPregnant"
                        label="Are you pregnant?"
                        options={[
                            { value: "Yes", label: "Yes" },
                            { value: "No", label: "No" },
                        ]}
                    />

                    {/* If pregnant, show additional fields */}
                    <FormDatePicker name="lnmp" label="Last Normal Menstrual Period (LNMP)" />
                    <TextInputField
                        name="gestationalAge"
                        label="Gestational Age (weeks)"
                        id={""}
                    // calculateValue={(values: { lnmp: string | null; }) => calculateGestationalAge(values.lnmp)}
                    />
                    <TextInputField id="parity" name="parity" label="Parity" />
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};