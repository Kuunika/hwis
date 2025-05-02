"use client";
import React, { useEffect, useState } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    CheckboxesGroup,
    FormFieldContainerLayout,
} from "@/components";
import * as Yup from "yup";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";

// Add concepts: Mental Illness, Blood Transfusion, Drug Allergies


// Medical History options
const medicalHistoryOptions = [
    { value: concepts.FAMILY_HISTORY_HYPERTENSION, label: "Hypertension (HTN)" },
    { value: concepts.FAMILY_HISTORY_DIABETES_MELLITUS, label: "Diabetes Mellitus (DM)" },
    { value: concepts.FAMILY_HISTORY_TUBERCULOSIS, label: "Tuberculosis (TB)" },
    { value: concepts.FAMILY_HISTORY_EPILEPSY, label: "Epilepsy" },
    { value: concepts.FAMILY_HISTORY_ASTHMA, label: "Asthma" },
    { value: concepts.MENTAL_ILLNESS, label: "Mental Illness" },
    { value: concepts.BLOOD_TRANSFUSION, label: "Blood Transfusion" },
    { value: concepts.DRUG_ALLERGIES, label: "Drug Allergies" },
];

const schema = Yup.object().shape({
    medicalHistory: Yup.array().min(1, "Please select at least one condition"),
});

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

export const MedicalHistoryForm = ({ onSubmit, onSkip }: Prop) => {
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

        const selectedConditions = (values.medicalHistory || [])
            .filter((item: any) => item.value)
            .map((item: any) => item.key);

        const obs = selectedConditions.map((conceptId: string) => {
            const option = medicalHistoryOptions.find(opt => opt.value === conceptId);
            return {
                concept: conceptId,
                value: option?.label || "Yes",
                obsDatetime: currentDateTime,
            };
        });

        const payload = {
            encounterType: encounters.GYNEACOLOGY_WARD, // adjust if needed
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting Medical History:", error);
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{ medicalHistory: [] }}
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Medical History">
                        <CheckboxesGroup
                            name="medicalHistory"
                            allowFilter={false}
                            options={medicalHistoryOptions}
                        />
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};