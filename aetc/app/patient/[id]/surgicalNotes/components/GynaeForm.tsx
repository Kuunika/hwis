"use client";
import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import * as Yup from "yup";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    RadioGroupInput,
    FormFieldContainerLayout,
    FormDatePicker,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";


type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
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
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { init, ServerTime } = useServerTime();


    useEffect(() => {
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleSubmit = async (values: any) => {
        const currentDateTime = ServerTime.getServerTimeString();

        const obs = [
            {
                concept: concepts.PREGNANCY_TEST,
                value: values.areYouPregnant,
                obsDatetime: currentDateTime,
            },
            ...(values.areYouPregnant === "Yes"
                ? [
                    {
                        concept: concepts.LNMP,
                        value: values.lnmp,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.GESTATIONAL_AGE,
                        value: values.gestationalAge,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.PARITY,
                        value: values.parity,
                        obsDatetime: currentDateTime,
                    },
                ]
                : []),
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
            console.log("Gynae Obstetric History submitted successfully!");
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting Gynae Obstetric History: ", error);
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                areYouPregnant: "",
                lnmp: "",
                gestationalAge: "",
                parity: "",
            }}
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Gynae/Obstetric History (Only for Females)">
                        {/* Pregnancy Status */}
                        <RadioGroupInput
                            name="areYouPregnant"
                            label="Are you pregnant?"
                            options={[
                                { value: "Yes", label: "Yes" },
                                { value: "No", label: "No" },
                            ]}
                        />

                        <PregnancyFields />
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};

// Component to conditionally render pregnancy-related fields
const PregnancyFields = () => {
    const { values } = useFormikContext<any>();

    if (values.areYouPregnant !== "Yes") return null;

    return (
        <>
            <FormDatePicker name="lnmp" label="Last Normal Menstrual Period (LNMP)" />
            <TextInputField name="gestationalAge" label="Gestational Age (weeks)" id={""} />
            <TextInputField id="parity" name="parity" label="Parity" />
        </>
    );
};