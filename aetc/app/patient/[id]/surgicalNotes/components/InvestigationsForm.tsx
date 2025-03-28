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
type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

export const InvestigationsForm = ({ onSubmit, onSkip }: Prop) => {
    return (
        <div>
            <h2>Investigations</h2>
        </div>
    );
};