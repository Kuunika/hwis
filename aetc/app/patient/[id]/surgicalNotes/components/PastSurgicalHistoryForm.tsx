"use client";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import {
    FormikInit,
    FormFieldContainer,
    WrapperBox,
    RadioGroupInput,
    FormFieldContainerLayout,
    TextInputField,
} from "@/components";
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

// Validation schema
const schema = Yup.object().shape({
    hasSurgicalHistory: Yup.string().required("Please select Yes or No"),
    surgicalDetails: Yup.string().required(" "),
});

//encounter: SURGICAL_NOTES_TEMPLATE_FORM
//concepts: PROCEDURES
// use these concepts: SURGICAL_PROCEDURE, SURGICAL_HISTORY

export const PastSurgicalHistoryForm = ({ onSubmit, onSkip }: Prop) => {
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
        if (values.hasSurgicalHistory !== "Yes") {
            // toast.error("No surgical history to submit.");
            return;
        }

        const currentDateTime = getDateTime();

        const obs = [
            {
                concept: concepts.PROCEDURES,
                value: values.surgicalDetails,
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
            // toast.success("Surgical history submitted successfully!");
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting surgical history:", error);
            // toast.error("Failed to submit surgical history.");
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                hasSurgicalHistory: "",
                surgicalDetails: "",
            }}
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>

                    <FormFieldContainerLayout title="Any history of previous surgery or procedures?">

                        {/* Yes/No Radio Buttons */}
                        <RadioGroupInput
                            name="hasSurgicalHistory"
                            label="Has Surgical History"
                            options={[
                                { value: "Yes", label: "Yes" },
                                { value: "No", label: "No" },
                            ]}
                        />

                        {/* Text Input for Surgery Details - Shown if 'Yes' is selected */}
                        <TextInputField
                            id="surgicalDetails"
                            sx={{ width: "100%" }}

                            name="surgicalDetails"
                            label="Enter previous procedures and surgeries (Month & Year)"
                            placeholder="E.g., Appendectomy - January 2020"
                            multiline
                            rows={5}
                        />
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};