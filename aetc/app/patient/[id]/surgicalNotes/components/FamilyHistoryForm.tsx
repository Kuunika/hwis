"use client";
import React, { useState, useEffect } from "react";
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
import {
    addEncounter,
    fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { toast } from "react-toastify";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Family History options
const familyHistoryOptions = [
    "Asthma", "Diabetes", " Epilepsy", " Hypertension", "Cancer "
];


// const familyHistoryOptions = [
//     { value:concepts.FAMILY_HISTORY_ASTHMA, label:"Asthma" },
//     { value:concepts.FAMILY_HISTORY_DIABETES_MELLITUS, label:"Diabetes" },
//     { value:concepts.FAMILY_HISTORY_EPILEPSY, label:"Epilepsy" },
//     { value:concepts.FAMILY_HISTORY_HYPERTENSION, label:"Hypertension" },
//     { value:concepts.FAMILY_HISTORY_CANCER, label:"Cancer" },

// ];

// Validation schema
const schema = Yup.object().shape({
    familyHistory: Yup.array().min(1, "Please select at least one option"),
    cancerType: Yup.string().when("familyHistory", {
        is: (values: string[]) => values.includes("Cancer"),
        then: (schema) => schema.required("Please specify the type of cancer"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export const FamilyHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

    const handleCheckboxChange = (values: any) => {
        setSelectedConditions(values.filter((item: any) => item.value).map((item: any) => item.key));
    };
    // encounter: SURGICAL_NOTES_TEMPLATE_FORM

    // FAMILY_HISTORY_ASTHMA  FAMILY_HISTORY_HYPERTENSION, FAMILY_HISTORY_DIABETES_MELLITUS, FAMILY_HISTORY_EPILEPSY FAMILY_HISTORY_CANCER
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);

    useEffect(() => {
        // Finds the active visit for the patient from their visit history
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleSubmit = async (values: any) => {
        const currentDateTime = getDateTime();

        // Mapping selected conditions to their corresponding concepts
        const conditionConcepts: Record<string, string> = {
            Asthma: concepts.FAMILY_HISTORY_ASTHMA,
            Hypertension: concepts.FAMILY_HISTORY_HYPERTENSION,
            Diabetes: concepts.FAMILY_HISTORY_DIABETES_MELLITUS,
            Epilepsy: concepts.FAMILY_HISTORY_EPILEPSY,
            Cancer: concepts.FAMILY_HISTORY_CANCER,
        };

        // Creating observations based on selected conditions
        const obs = values.familyHistory.map((condition: string) => ({
            concept: conditionConcepts[condition],
            value: condition === "Cancer" ? values.cancerType : conditionConcepts[condition],
            obsDatetime: currentDateTime,
        }));

        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            console.log("Family History submitted successfully!");
            onSubmit(values); //  This triggers navigation to the next step

        } catch (error) {
            console.error("Error submitting Family History:", error);
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                familyHistory: [],
                cancerType: "",
            }}
            onSubmit={handleSubmit} // Call the function here
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Family History">
                        {familyHistoryOptions.map((condition) => (
                            <div key={condition} style={{ marginBottom: "10px" }}>
                                <CheckboxesGroup
                                    name="familyHistory"
                                    allowFilter={false}
                                    options={[{ value: condition, label: condition }]}
                                    getValue={handleCheckboxChange}
                                />

                                {/* Show Text Input if "Cancer" is selected */}
                                {selectedConditions.includes("Cancer") && condition === "Cancer" && (
                                    <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                                        <TextInputField
                                            name="cancerType"
                                            label="Type of Cancer"
                                            placeholder="Specify cancer type" id={""} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};