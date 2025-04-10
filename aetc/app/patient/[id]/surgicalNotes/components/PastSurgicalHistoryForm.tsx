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
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useFormikContext, useField } from "formik";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Validation schema with conditional field
const schema = Yup.object().shape({
    hasSurgicalHistory: Yup.string().required("Please select Yes or No"),
    surgicalDetails: Yup.string().when("hasSurgicalHistory", {
        is: concepts.YES,
        then: (schema) => schema.required("Please enter surgical details"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export const PastSurgicalHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);

    useEffect(() => {
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleSubmit = async (values: any) => {
        if (values.hasSurgicalHistory !== concepts.YES) {
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
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting surgical history:", error);
        }
    };

    // Custom component to show conditional field
    const SurgicalDetailsField = () => {
        const { values } = useFormikContext<any>();
        const [field, meta] = useField("surgicalDetails");

        if (values.hasSurgicalHistory !== concepts.YES) {
            return null;
        }

        return (
            <TextInputField
                {...field}
                id="surgicalDetails"
                sx={{ width: "100%" }}
                name="surgicalDetails"
                label="Enter previous procedures and surgeries (Month & Year)"
                placeholder="E.g., Appendectomy - January 2020"
                multiline
                rows={5}
            />
        );
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
                        <RadioGroupInput
                            name="hasSurgicalHistory"
                            label="Has Surgical History"
                            options={[
                                { value: concepts.YES, label: "Yes" },
                                { value: concepts.NO, label: "No" },
                            ]}
                        />

                        <SurgicalDetailsField />
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};