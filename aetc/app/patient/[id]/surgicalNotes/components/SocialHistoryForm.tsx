"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    RadioGroupInput,
} from "@/components";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Validation schema
const schema = Yup.object().shape({
    doYouSmoke: Yup.string().required("Please select an option"),
    cigarettesPerDay: Yup.string().when("doYouSmoke", {
        is: "Yes",
        then: (schema) => schema.required("Please enter how many you smoke per day"),
        otherwise: (schema) => schema.notRequired(),
    }),
    smokingHistory: Yup.string().when("doYouSmoke", {
        is: "No",
        then: (schema) => schema.required("Please select if you quit or never smoked"),
        otherwise: (schema) => schema.notRequired(),
    }),
    alcoholIntake: Yup.string().required("Please enter daily alcohol intake"),
    recreationalDrugs: Yup.string().required("Please select if you use recreational drugs"),
});

export const SocialHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    const [doYouSmoke, setDoYouSmoke] = useState<string>("");

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                doYouSmoke: "",
                cigarettesPerDay: "",
                smokingHistory: "",
                alcoholIntake: "",
                recreationalDrugs: "",
            }}
            onSubmit={onSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <h4>Social History</h4>

                    {/* Smoking */}
                    <RadioGroupInput
                        name="doYouSmoke"
                        label="Do you smoke?"
                        options={[
                            { value: "Yes", label: "Yes" },
                            { value: "No", label: "No" },
                        ]}
                        getValue={(value: string) => setDoYouSmoke(value)}
                    />

                    {/* Show text input for cigarettes per day if user smokes */}
                    {doYouSmoke === "Yes" && (
                        <TextInputField
                            id="cigarettesPerDay"
                            name="cigarettesPerDay"
                            label="How many cigarettes per day?"
                        />
                    )}
                    <br />

                    {/* Show smoking history if user does not smoke */}
                    {doYouSmoke === "No" && (
                        <RadioGroupInput
                            name="smokingHistory"
                            label="If not, did you quit over a month ago or never smoked?"
                            options={[
                                { value: "Quit over a month ago", label: "Quit over a month ago" },
                                { value: "Never smoked", label: "Never smoked" },
                            ]}
                        />
                    )}

                    {/* Alcohol Intake */}
                    <TextInputField
                        id="alcoholIntake"
                        name="alcoholIntake"
                        label="What is your daily alcohol intake?"
                    />

                    {/* Recreational Drugs */}
                    <RadioGroupInput
                        name="recreationalDrugs"
                        label="Do you use recreational drugs?"
                        options={[
                            { value: "Yes", label: "Yes" },
                            { value: "No", label: "No" },
                        ]}
                    />
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};