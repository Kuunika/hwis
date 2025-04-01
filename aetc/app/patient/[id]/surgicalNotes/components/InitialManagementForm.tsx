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

export const InitialManagementForm = ({ onSubmit, onSkip }: Prop) => {
    return (
        <div>
            <h2>Initial Management</h2>
        </div>
    );
};