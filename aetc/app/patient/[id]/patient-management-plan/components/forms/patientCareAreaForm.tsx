"use client";

import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import {
    FormikInit,
    FormFieldContainerLayout,
    FormValuesListener,
    RadioGroupInput,
    WrapperBox,
    MainButton,
    TextInputField,
} from "@/components";
import { toast } from "react-toastify";
import { useParameters } from "@/hooks";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { concepts, encounters } from "@/constants";
import { Visit } from "@/interfaces";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

const careAreaFormConfig: Record<
    "gyno" | "surgical" | "medicalBench" | "shortStay" | "isolation" | "trauma",
    { name: string; label: string }
> = {
    gyno: { name: concepts.GYNO, label: "Gyno" },
    surgical: { name: concepts.SURGICAL, label: "Surgical" },
    medicalBench: { name: concepts.MEDICAL_BENCH, label: "Medical Bench" },
    shortStay: { name: concepts.SHORT_STAY_AREA, label: "Short Stay" },
    isolation: { name: concepts.ISOLATION, label: "Isolation" },
    trauma: { name: concepts.TRAUMA, label: "Trauma" },
    // other: { name: concepts.OTHER, label: "Other (Specify)" },
};

const radioOptions = Object.keys(careAreaFormConfig).map((key) => ({
    value: key as keyof typeof careAreaFormConfig,
    label: careAreaFormConfig[key as keyof typeof careAreaFormConfig].label,
}));

const schema = Yup.object().shape({
    careArea: Yup.string().required("Please select a patient care area."),
    // otherCareAreaSpecify: Yup.string().when("careArea", {
    //     is: (careArea: unknown) => careArea === "other",
    //     then: (schema) => schema.required("Please specify the other care area."),
    //     otherwise: (schema) => schema,
    // }),
});




export const PatientCareAreaForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});

    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);

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

        // Determine selected care area
        let selectedCareArea = careAreaFormConfig[values.careArea as keyof typeof careAreaFormConfig]?.name;

        // If 'Other' is selected, use the specified other care area
        // if (values.careArea === "other") {
        //     selectedCareArea = values.otherCareAreaSpecify;
        // }

        const obs = [
            {
                concept: concepts.CARE_AREA, // UUID for care area
                value: selectedCareArea,
                obsDatetime: currentDateTime,
            },
        ];

        const payload = {
            encounterType: encounters.PATIENT_CARE_AREA, // UUID for encounter type
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            toast.success("Patient Care Area submitted successfully!");
        } catch (error) {
            console.error("Error submitting Patient Care Area: ", error);
            toast.error("Failed to submit the form.");
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{ careArea: "", otherCareAreaSpecify: "" }}
            onSubmit={handleSubmit}
        >
            <FormValuesListener getValues={setFormValues} />
            <FormFieldContainerLayout title="Patient Care Area">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width: "100%" }}>
                    <RadioGroupInput
                        row
                        options={radioOptions}
                        name="careArea"
                        label="Select Patient Care Area"
                    />
                    {/* Show input field for 'Other' option only when selected */}
                    {/* {formValues.careArea === "other" && (
                        <WrapperBox>
                            <TextInputField
                                id="otherCareAreaSpecify"
                                label="Specify Other Care Area"
                                name="otherCareAreaSpecify"
                                placeholder="Specify the care area"
                            />
                        </WrapperBox>
                    )} */}
                </WrapperBox>
                <WrapperBox>
                    {/* <MainButton sx={{ m: 0.5 }} title="Submit" type="submit" /> */}
                    {/* <MainButton variant="secondary" title="Skip" type="button" onClick={onSkip} /> */}
                </WrapperBox>
            </FormFieldContainerLayout>
        </FormikInit>
    );
};
