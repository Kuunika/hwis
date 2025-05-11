"use client";
import React, { useState, useEffect } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    FormFieldContainerLayout,
    RadioGroupInput,
} from "@/components";
import { getDateTime } from "@/helpers/dateTime";
import * as Yup from "yup";
import { getActivePatientDetails } from "@/hooks";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { concepts, encounters } from "@/constants";
import { Visit } from "@/interfaces";
import { useParameters } from "@/hooks";
import { useNavigation } from "@/hooks";
import { useServerTime } from "@/contexts/serverTimeContext";



// Add concepts: Stable, Sick, Critical, Mild, Moderate, Severe, Stats, RBS, Weight, Height , Abdomen, Vaginal Inspection, extremities, impression, Immediate Intervention
// available concepts: CONDITION, PALLOR, VITAL_SIGNS, TEMPERATURE, PULSE_RATE, RESPIRATORY_RATE,  BLOOD_PRESSURE_MEASURED,  CHEST_EXAMINATION, VAGINAL_EXAMINATION, PLAN,

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

const conditionOptions = [
    { value: "Stable", label: "Stable" },
    { value: "Sick", label: "Sick" },
    { value: "Critical", label: "Critical" },
];

const yesNoOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
];

const validationSchema = Yup.object({});

export const GeneralExaminationsForm = ({ onSubmit, onSkip }: Prop) => {
    const { gender } = getActivePatientDetails();
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { navigateTo } = useNavigation();
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
        if (!activeVisit) {
            console.error("No active visit found for the patient.");
            return;
        }

        // const currentDateTime = getDateTime();
        const currentDateTime = ServerTime.getServerTimeString();

        const createObs = (concept: string, value: any) => ({
            concept,
            value,
            obsDatetime: currentDateTime,
        });

        const obs = [
            createObs(concepts.CONDITION, values.condition),
            createObs(concepts.PALLOR, values.pallor),
            createObs(concepts.TEMPERATURE, values.temperature),
            createObs(concepts.PULSE_RATE, values.pulse),
            createObs(concepts.RESPIRATORY_RATE, values.respiratoryRate),
            createObs(concepts.BLOOD_PRESSURE_MEASURED, values.bloodPressure),
            createObs(concepts.STATS, values.stats),
            createObs(concepts.RBS, values.rbs),
            createObs(concepts.WEIGHT, values.weight),
            createObs(concepts.HEIGHT, values.height),
            createObs(concepts.CHEST_EXAMINATION, values.chest),
            createObs(concepts.ABDOMINAL_EXAMINATION, values.abdomen),
            createObs(concepts.VAGINAL_INSPECTION, values.vaginalInspection),
            createObs(concepts.VAGINAL_EXAMINATION, values.vaginalExamination),
            createObs(concepts.EXTREMITIES, values.extremities),
            createObs(concepts.IMPRESSION, values.impression),
            createObs(concepts.PLAN, values.plan),
            createObs(concepts.IMMEDIATE_INTERVENTION, values.immediateIntervention),
        ].filter((item) => item.value && item.value !== "");

        const payload = {
            encounterType: encounters.GYNEACOLOGY_WARD,
            patient: params.id,
            visit: activeVisit.uuid,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            // onSubmit(values);
            navigateTo(`/dispositions`);

        } catch (error) {
            console.error("Error submitting General Examination:", error);
        }
    };

    return (
        <FormikInit
            initialValues={{
                condition: "",
                pallor: "",
                temperature: "",
                pulse: "",
                respiratoryRate: "",
                bloodPressure: "",
                stats: "",
                rbs: "",
                weight: "",
                height: "",
                chest: "",
                abdomen: "",
                vaginalInspection: "",
                vaginalExamination: "",
                extremities: "",
                impression: "",
                plan: "",
                immediateIntervention: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="General Examination">

                        <FormFieldContainerLayout title="Condition">
                            <RadioGroupInput name="condition" options={conditionOptions} label={""} />
                        </FormFieldContainerLayout>

                        <FormFieldContainerLayout title="Pallor">
                            <RadioGroupInput name="pallor" options={yesNoOptions} label={""} />
                        </FormFieldContainerLayout>

                        <FormFieldContainerLayout title="Vitals">
                            <TextInputField name="temperature" label="Temperature" type="text" id={""} />
                            <TextInputField name="pulse" label="Pulse" type="text" id={""} />
                            <TextInputField name="respiratoryRate" label="Respiratory Rate" type="text" id={""} />
                            <TextInputField name="bloodPressure" label="Blood Pressure" type="text" id={""} />
                            <TextInputField name="stats" label="Stats" type="text" id={""} />
                            <TextInputField name="rbs" label="RBS" type="text" id={""} />
                            <TextInputField name="weight" label="Weight" type="text" id={""} />
                            <TextInputField name="height" label="Height" type="text" id={""} />
                        </FormFieldContainerLayout>


                        <FormFieldContainerLayout title="Other Examinations">
                            <TextInputField name="chest" label="Chest" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="abdomen" label="Abdomen" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="vaginalInspection" label="Vaginal Inspection" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="vaginalExamination" label="Vaginal Examination" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="extremities" label="Extremities" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="impression" label="Impression" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="plan" label="Plan" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="immediateIntervention" label="Immediate Intervention" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                        </FormFieldContainerLayout>

                    </FormFieldContainerLayout>


                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};