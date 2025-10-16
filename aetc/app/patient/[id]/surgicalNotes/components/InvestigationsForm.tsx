"use client";
import React, { useState, useEffect } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
} from "@/components";
import { LabOrderTable } from "@/app/patient/components/panels/labOrderTable";
import { concepts, encounters } from "@/constants";
import { getInitialValues } from "@/helpers";
import { useParameters } from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";
import * as Yup from "yup";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

const form = {
    additionalNotes: {
        name: concepts.NOTES,
        label: "Additional Investigation Notes",
    },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

export const InvestigationsForm = ({ onSubmit, onSkip }: Prop) => {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { ServerTime } = useServerTime();

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

        // Only submit if there are additional notes
        if (values[concepts.NOTES]?.trim()) {
            const payload = {
                encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
                visit: activeVisit?.uuid,
                patient: params.id,
                encounterDatetime: currentDateTime,
                obs: [
                    {
                        concept: concepts.NOTES,
                        value: values[concepts.NOTES],
                        obsDatetime: currentDateTime,
                    }
                ],
            };

            try {
                await submitEncounter(payload);
                console.log("Additional Notes submitted successfully!");
                onSubmit(values); // This triggers navigation to the next step
            } catch (error) {
                console.error("Error submitting additional notes:", error);
                // Optionally show error to user
            }
        } else {
            // If no notes, just proceed to next step
            onSubmit(values);
        }
    };

    return (
        <FormikInit
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <div>
                        <h2>Investigations</h2>
                        <LabOrderTable />

                        {/* Additional Notes Section */}
                        <div style={{ marginTop: "30px" }}>
                            <h3 style={{
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                marginBottom: "15px",
                                color: "#374151",
                                borderBottom: "2px solid #e5e7eb",
                                paddingBottom: "8px"
                            }}>
                                Additional Investigation Notes
                            </h3>
                            <p style={{
                                fontSize: "0.9rem",
                                color: "#6b7280",
                                marginBottom: "12px"
                            }}>
                                Include other radiology investigations and lab orders that AETC doesn't perform
                                (e.g., external diagnostic laboratories).
                            </p>
                            <TextInputField
                                multiline
                                rows={6}
                                name={form.additionalNotes.name}
                                label={form.additionalNotes.label}
                                id={form.additionalNotes.name}
                                sx={{ width: "100%" }}
                                placeholder="Enter external lab orders, radiology investigations, or other diagnostic tests not performed at AETC..."
                            />
                        </div>
                    </div>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};