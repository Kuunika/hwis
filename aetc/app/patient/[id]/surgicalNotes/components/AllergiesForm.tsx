"use client";
import React, { useState, useEffect } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    FormFieldContainerLayout,
    CheckboxesGroup,
} from "@/components";
import * as Yup from "yup";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Allergy options
const allergyOptions = [
    { value: concepts.RECREATIONAL_DRUG, label: "Drugs" },
    { value: concepts.FOOD_ALLERGY, label: "Food" },
    { value: concepts.SKIN_PREP, label: "Skin prep" },
    { value: concepts.LATEX_ALLERGY, label: "Latex" },
    { value: concepts.MEDICATION_ALLERGY, label: "Medications" },
    { value: concepts.OTHER, label: "Other (Specify)" },
];

// Validation schema
const schema = Yup.object().shape({
    allergies: Yup.array().min(1, "Please select at least one allergy"),
    drugsDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Drugs"),
        then: (schema) => schema.required("Specify drug allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    foodDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Food"),
        then: (schema) => schema.required("Specify food allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    skinPrepDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Skin prep"),
        then: (schema) => schema.required("Specify skin prep allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    latexDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Latex"),
        then: (schema) => schema.required("Specify latex allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    medicationsDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Medications"),
        then: (schema) => schema.required("Specify medication allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    otherDetails: Yup.string().when("allergies", {
        is: (allergies: string[]) => allergies.includes("Other"),
        then: (schema) => schema.required("Specify other allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
});
//encounter: SURGICAL_NOTES_TEMPLATE_FORM
//concepts: ALLERGIC_REACTION, DESCRIPTION
export const AllergiesForm = ({ onSubmit, onSkip }: Prop) => {

    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [showOtherTextField, setShowOtherTextField] = useState(false);

    const handleCheckboxChange = (values: any) => {
        setSelectedAllergies(values.filter((item: any) => item.value).map((item: any) => item.key));
        setShowOtherTextField(values.some((val: any) => val.key === "Other" && val.value));

    };

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

        // Extract selected allergy
        const selectedAllergies = values.allergies.map((item: any) => item.key);

        // Include "Other" allergy if specified
        if (selectedAllergies.includes("Other") && values.otherDetails) {
            selectedAllergies[selectedAllergies.indexOf("Other")] = values.otherDetails;
        }

        const obs = [
            {
                concpt: concepts.ALLERGIC_REACTION,
                value: selectedAllergies.join(", "),
                obsDatetime: currentDateTime,
            }
        ]

        // const obs = values.allergies.map((allergy: string) => ({
        //     concept: concepts.ALLERGIC_REACTION,
        //     value: allergy,
        //     obsDatetime: currentDateTime,
        // }));

        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            console.log("Allergies submitted successfully!");
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting Allergies:", error);
        }
    };
    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                allergies: [],
                drugsDetails: "",
                foodDetails: "",
                skinPrepDetails: "",
                latexDetails: "",
                medicationsDetails: "",
                otherDetails: "",
            }}
            onSubmit={handleSubmit} // Call the updated function here
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>

                    <FormFieldContainerLayout title="Allergies and Adverse Reactions">
                        {allergyOptions.map((allergy) => (
                            <div key={allergy.value} style={{ marginBottom: "10px" }}>
                                <CheckboxesGroup
                                    name="allergies"
                                    allowFilter={false}
                                    options={[allergy]}
                                    getValue={handleCheckboxChange}
                                />

                                {/* Show Text Input if specific allergy is selected */}
                                {selectedAllergies.includes(allergy.value) && (
                                    <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                                        <TextInputField
                                            name={`${allergy.value.toLowerCase().replace(/\s+/g, '')}Details`}
                                            label={`Specify allergy `}
                                            placeholder={`Enter allergy details`} id={""} />
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
