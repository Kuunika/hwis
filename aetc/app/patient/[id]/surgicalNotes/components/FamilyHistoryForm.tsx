"use client";
import React, { useEffect, useState } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    CheckboxesGroup,
    FormFieldContainerLayout,
    TextInputField,
} from "@/components";
import * as Yup from "yup";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useFormikContext, useField } from "formik";

// Family History options
const familyHistoryOptions = [
    { value: concepts.FAMILY_HISTORY_ASTHMA, label: "Asthma" },
    { value: concepts.FAMILY_HISTORY_DIABETES_MELLITUS, label: "Diabetes" },
    { value: concepts.FAMILY_HISTORY_EPILEPSY, label: "Epilepsy" },
    { value: concepts.FAMILY_HISTORY_HYPERTENSION, label: "Hypertension" },
    { value: concepts.FAMILY_HISTORY_CANCER, label: "Cancer" },
];

const schema = Yup.object().shape({
    familyHistory: Yup.array().min(1, "Please select at least one option"),
    // cancerType: Yup.string().when("familyHistory", {
    //     is: (values: string[]) => values?.includes(concepts.FAMILY_HISTORY_CANCER),
    //     then: (schema) => schema.required("Please specify the type of cancer"),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
});

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

export const FamilyHistoryForm = ({ onSubmit, onSkip }: Prop) => {
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

        const currentDateTime = getDateTime();
        const selectedFamilyOptions = (values.familyHistory || [])
            .filter((item: any) => item.value)
            .map((item: any) => item.key);


        // Map selected family history items into observations
        // const obs = values.familyHistory.map((conceptValue: string) => ({
        //     concept: conceptValue,
        //     value: conceptValue,
        //     obsDatetime: currentDateTime,
        // }));
        const obs = selectedFamilyOptions.map((optionKey: string) => {
            // Find the corresponding option to get its label
            const option = familyHistoryOptions.find(opt => opt.value === optionKey);
            const label = option ? option.label : "Unknown";

            return {
                concept: optionKey, // The concept UUID
                value: label,      // The human-readable label as a string
                obsDatetime: currentDateTime,
            };
        });

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
            console.error("Error submitting Family History:", error);
        }
    };

    // const CancerTypeField = () => {
    //     const { values } = useFormikContext<any>();

    //     if (!values.familyHistory.includes(concepts.FAMILY_HISTORY_CANCER)) {
    //         return null;
    //     }

    //     return (
    //         <TextInputField
    //             name="cancerType"
    //             label="Type of Cancer"
    //             placeholder="Specify cancer type"
    //             id="cancerType"
    //         />
    //     );
    // };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                familyHistory: [],
                cancerType: "",
            }}
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Family History">
                        <CheckboxesGroup
                            name="familyHistory"
                            allowFilter={false}
                            options={familyHistoryOptions}
                        />
                        {/* <CancerTypeField /> */}
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};