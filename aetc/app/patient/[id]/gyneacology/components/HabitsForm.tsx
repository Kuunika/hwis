"use client";
import React, { useEffect, useState } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
    CheckboxesGroup,
} from "@/components";
import * as Yup from "yup";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";


const habitOptions = [
    { value: concepts.ALCOHOL_INTAKE, label: "Use of Alcohol" },
    { value: concepts.SMOKING_HISTORY, label: "Smoking" },
    { value: concepts.RECREATIONAL_DRUG, label: "Drugs" },
];

const schema = Yup.object().shape({
    habits: Yup.array().min(1, "Please select at least one option"),
});

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

export const HabitsForm = ({ onSubmit, onSkip }: Prop) => {
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
        const selectedHabits = (values.habits || [])
            .filter((item: any) => item.value)
            .map((item: any) => item.key);

        const obs = selectedHabits.map((optionKey: string) => {
            const option = habitOptions.find((opt) => opt.value === optionKey);
            const label = option ? option.label : "Unknown";
            return {
                concept: optionKey,
                value: label,
                obsDatetime: currentDateTime,
            };
        });

        const payload = {
            encounterType: encounters.GYNEACOLOGY_WARD,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting Habits Form:", error);
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{ habits: [] }}
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Habits">
                        <CheckboxesGroup
                            name="habits"
                            allowFilter={false}
                            options={habitOptions}
                        />
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};