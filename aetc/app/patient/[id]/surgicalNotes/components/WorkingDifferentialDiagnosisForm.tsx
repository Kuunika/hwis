"use client";
import React from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
    TextInputField,
} from "@/components";

import * as Yup from "yup";


type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};
const validationSchema = Yup.object({});

export const WorkingDifferentialDiagnosisForm = ({ onSubmit, onSkip }: Prop) => {
    return (
        <FormikInit
            initialValues={{
                differentialDiagnosis: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => console.log("Working Differential Diagnosis Data:", values)}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Working Differential Diagnosis">


                        {/* ICD-11 Differential Diagnosis Input */}
                        <TextInputField
                            name="differentialDiagnosis"
                            label="Working/Differential Diagnosis (ICD 11)"
                            type="text"
                            id="differentialDiagnosis"
                        />
                    </FormFieldContainerLayout>

                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};