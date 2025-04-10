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
    return (
        <div>
            <h2>Investigations</h2>
            <LabOrderTable />

        </div>
    );
};