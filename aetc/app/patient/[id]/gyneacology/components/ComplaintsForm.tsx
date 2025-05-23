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
import { getDateTime } from "@/helpers/dateTime";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};
//BACKEND: Replace datatype for chief complaint to text
const validationSchema = Yup.object({});
export const ComplaintsForm = ({ onSubmit, onSkip }: Prop) => {
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
                concept: concepts.CHIEF_COMPLAINT, // Replace with actual concept UUID
                value: values.chiefComplaint,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.HISTORY_OF_PRESENT_ILLNESS, // Replace with actual concept UUID
                value: values.historyOfPresentIllness,
                obsDatetime: currentDateTime,
            },
        ];
        const payload = {
            encounterType: encounters.GYNEACOLOGY_WARD, // Change if needed
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            console.log("Complaints submitted successfully!");
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting Complaints Form:", error);
        }
    };
    return (
        <FormikInit
            initialValues={{
                chiefComplaint: "",
                historyOfPresentIllness: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Chief Complaint">
                        <TextInputField
                            name="chiefComplaint"
                            label="Chief Complaint"
                            type="text"
                            multiline
                            rows={5}
                            sx={{ width: "100%" }} id={""} />
                    </FormFieldContainerLayout>
                    <FormFieldContainerLayout title="History of Present Illness">
                        <TextInputField
                            name="historyOfPresentIllness"
                            label="History of Present Illness"
                            type="text"
                            multiline
                            rows={5}
                            sx={{ width: "100%" }} id={""} />
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};