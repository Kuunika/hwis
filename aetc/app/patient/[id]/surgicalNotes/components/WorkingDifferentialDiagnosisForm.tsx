
"use client";
import React, { useState, useEffect } from "react";
import {
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import ECTReactComponent from "@/components/form/ECTReactComponent";
import { MinimalTable } from "@/components/tables/minimalTable";
import { Button } from "@mui/material";
import { useServerTime } from "@/contexts/serverTimeContext";


type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

export const WorkingDifferentialDiagnosisForm = ({ onSubmit, onSkip }: Prop) => {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<any[]>([]);
    const { init, ServerTime } = useServerTime();


    useEffect(() => {
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleAddDiagnosis = (diagnosis: any) => {
        setSelectedDiagnosis((prev) => [...prev, diagnosis]);
    };

    const handleSubmit = async () => {
        const obsDatetime = ServerTime.getServerTimeString();

        const diagnosisObs = selectedDiagnosis.map((item) => ({
            concept: concepts.DIFFERENTIAL_DIAGNOSIS,
            value: `${item.code}-${item.bestMatchText}`,
            obsDatetime,
        }));

        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: obsDatetime,
            obs: [
                {
                    concept: concepts.DIFFERENTIAL_DIAGNOSIS,
                    value: concepts.DIFFERENTIAL_DIAGNOSIS,
                    obsDatetime,
                    groupMembers: diagnosisObs,
                },
            ],
        };

        try {
            await submitEncounter(payload);
            console.log("Differential Diagnosis submitted successfully!");
            onSubmit(selectedDiagnosis);
        } catch (error) {
            console.error("Error submitting diagnosis:", error);
        }
    };

    return (
        <FormFieldContainer direction="column">
            <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                <FormFieldContainerLayout title="Working Differential Diagnosis">
                    <MinimalTable
                        columns={[
                            { label: "Code", field: "code" },
                            { label: "Diagnosis", field: "selectedText" },
                        ]}
                        data={selectedDiagnosis}
                    />
                    <br />
                    <ECTReactComponent
                        iNo={0}
                        label="Search ICD-11 Diagnosis"
                        onICD11Selection={handleAddDiagnosis}
                    />
                    <br />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Finish and Submit
                    </Button>
                </FormFieldContainerLayout>
            </WrapperBox>
        </FormFieldContainer>
    );
};