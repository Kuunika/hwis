"use client";
import React, { useState, useEffect } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
    TextInputField,
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
import { useServerTime } from "@/contexts/serverTimeContext";


// add concepts: Gravidity, Number of living children, Menarche,  Menstrual cycle, Duration, Prev Abortion ,  Prev Ectopic,  Consistency, color, odour, amount, Previous Contraceptive, side effects, Cancer Screening, Date of screening, Result, History of STIs
//concepts available: LNMP, GESTATIONAL_AGE, PARITY, STRONG_REGULAR, IRREGULAR, ABNORMAL_VAGINAL_DISCHARGE , SPECIFY

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

const yesNoOptions = [
    { value: concepts.YES, label: "Yes" },
    { value: concepts.NO, label: "No" },
];

const menstrualCycleOptions = [
    { value: concepts.STRONG_REGULAR, label: "Regular" },
    { value: concepts.IRREGULAR, label: "Irregular" },
];

const validationSchema = Yup.object({});
export const ObstetricGynecologyHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    const { gender } = getActivePatientDetails();
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
        const dateTime = ServerTime.getServerTimeString();


        const obs = [
            {
                concept: concepts.LNMP,
                value: values.lnmp,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.GESTATIONAL_AGE,
                value: values.gestationAge,
                obsDatetime: currentDateTime,
            },
            // {
            //     concept: concepts.GRAVIDITY,
            //     value: values.gravidity,
            //     obsDatetime: currentDateTime,
            // },
            // {
            //     concept: concepts.PARITY,
            //     value: values.parity,
            //     obsDatetime: currentDateTime,
            // },
            {
                concept: concepts.NUMBER_OF_LIVING_CHILDREN,
                value: values.numberOfLivingChildren,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.MENARCHE,
                value: values.menarche,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.MENSTRUAL_CYCLE,
                value: values.menstrualCycle,
                obsDatetime: currentDateTime,
            },
            // {
            //     concept: concepts.DURATION,
            //     value: values.duration,
            //     obsDatetime: currentDateTime,
            // },
            {
                concept: concepts.PREV_ABORTION,
                value: values.prevAbortions,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.PREV_ECTOPIC,
                value: values.prevEctopic,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.ABNORMAL_VAGINAL_DISCHARGE,
                value: values.abnormalVaginalDischarge,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.CONSISTENCY,
                value: values.consistency,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.COLOR,
                value: values.color,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.ODOUR,
                value: values.odour,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.AMOUNT,
                value: values.amount,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.PREVIOUS_CONTRACEPTIVE,
                value: values.previousContraceptiveUse,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.CURRENTLY_ON_CONTRACEPTIVE,
                value: values.currentlyOnContraceptive,
                obsDatetime: currentDateTime,
            },
            // {
            //     concept: concepts.SIDE_EFFECTS,
            //     value: values.anySideEffects,
            //     obsDatetime: currentDateTime,
            // },
            {
                concept: concepts.CANCER_SCREENING,
                value: values.cancerScreening,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.HISTORY_OF_STIS,
                value: values.historyOfSTIs,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.EDD,
                value: values.edd,
                obsDatetime: currentDateTime,
            },
        ];

        const payload = {
            encounterType: encounters.GYNEACOLOGY_WARD,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            console.log("Obstetric Gynecology History submitted successfully!");
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting Obstetric Gynecology History:", error);
        }
    };

    return (
        <FormikInit
            initialValues={{
                lnmp: "",
                edd: "",
                gestationAge: "",
                gravidity: "",
                parity: "",
                numberOfLivingChildren: "",
                menarche: "",
                menstrualCycle: "",
                duration: "",
                prevAbortions: "",
                prevEctopic: "",
                abnormalVaginalDischarge: "",
                consistency: "",
                color: "",
                odour: "",
                amount: "",
                previousContraceptiveUse: "",
                currentlyOnContraceptive: "",
                anySideEffects: "",
                cancerScreening: "",
                historyOfSTIs: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Obstetric Gynaecology History">
                        <TextInputField name="lnmp" label="LNMP" type="text" id="" />
                        <TextInputField name="edd" label="EDD" type="text" id="" />
                        <TextInputField name="gestationAge" label="Gestation Age" type="text" id="" />
                        <TextInputField name="gravidity" label="Gravidity" type="number" id="" />
                        <TextInputField name="parity" label="Parity" type="number" id="" />
                        <TextInputField name="numberOfLivingChildren" label="Number of Living Children" type="text" id="" />
                        <TextInputField name="menarche" label="Menarche" type="text" id="" />

                        <FormFieldContainerLayout title="Menstrual Cycle">
                            <RadioGroupInput name="menstrualCycle" options={menstrualCycleOptions} label="" />
                        </FormFieldContainerLayout>

                        <TextInputField name="duration" label="Duration" type="text" id="" />
                        <TextInputField name="prevAbortions" label="Previous Abortions" type="text" id="" />
                        <TextInputField name="prevEctopic" label="Previous Ectopic" type="text" id="" />

                        <FormFieldContainerLayout title="Abnormal Vaginal Discharge">
                            <RadioGroupInput name="abnormalVaginalDischarge" options={yesNoOptions} label="" />
                        </FormFieldContainerLayout>
                        <TextInputField name="consistency" label="Consistency" type="text" id="" />
                        <TextInputField name="color" label="Color" type="text" id="" />
                        <TextInputField name="odour" label="Odour" type="text" id="" />
                        <TextInputField name="amount" label="Amount" type="text" id="" />

                        <FormFieldContainerLayout title="Contraceptive Use">
                            <RadioGroupInput name="previousContraceptiveUse" options={yesNoOptions} label="Previous Use" />
                            <RadioGroupInput name="currentlyOnContraceptive" options={yesNoOptions} label="Currently Using" />
                            <RadioGroupInput name="anySideEffects" options={yesNoOptions} label="Any Side Effects" />
                        </FormFieldContainerLayout>

                        <RadioGroupInput name="cancerScreening" options={yesNoOptions} label="Cancer Screening (VIA/Pap smear)" />
                        <RadioGroupInput name="historyOfSTIs" options={yesNoOptions} label="History of STIs" />
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};
