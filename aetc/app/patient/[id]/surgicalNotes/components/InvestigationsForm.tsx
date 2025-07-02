"use client";
import React from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    RadioGroupInput,
    CheckboxesGroup,
} from "@/components";
import { LabOrderTable } from "@/app/patient/components/panels/labOrderTable";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};


export const InvestigationsForm = ({ onSubmit, onSkip }: Prop) => {
    const handleSubmit = async (values: any) => {
        onSubmit(values); //  This triggers navigation to the next step

    }
    return (
        <FormikInit
            initialValues={{
            }}
            validationSchema={''}
            onSubmit={handleSubmit} // Call the function here
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <div>
                        <h2>Investigations</h2>
                        <LabOrderTable />

                    </div>
                    </WrapperBox>
                </FormFieldContainer>
        </FormikInit>
    );
};