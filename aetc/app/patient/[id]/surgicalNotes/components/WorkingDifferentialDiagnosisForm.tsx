"use client";
import React, { useState, useEffect } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
    TextInputField,
} from "@/components";

import * as Yup from "yup";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";


type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};
const validationSchema = Yup.object({});

//encounter: SURGICAL_NOTES_TEMPLATE_FORM

// Concepts: DIFFERENTIAL_DIAGNOSIS

export const WorkingDifferentialDiagnosisForm = ({ onSubmit, onSkip }: Prop) => {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);

    useEffect(() => {
        // Finds the active visit for the patient from their visit history
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleSubmit = async (values: any) => {
        const currentDateTime = getDateTime();

        const obs = [
            {
                concept: concepts.DIFFERENTIAL_DIAGNOSIS,
                value: values.differentialDiagnosis,
                obsDatetime: currentDateTime,
            },
        ];

        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            console.log("Working Differential Diagnosis submitted successfully!");
            onSubmit(values); //  This triggers navigation to the next step

        } catch (error) {
            console.error("Error submitting Working Differential Diagnosis:", error);
        }
    };


    return (
        <FormikInit
            initialValues={{
                differentialDiagnosis: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit} // Call the function here
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Working Differential Diagnosis">


                        {/* ICD-11 Differential Diagnosis Input */}
                        <TextInputField
                            sx={{ width: "100%" }}

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