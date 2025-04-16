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
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useFormikContext } from "formik";

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

const schema = Yup.object().shape({
    allergies: Yup.array().min(1, "Please select at least one allergy"),
    drugsDetails: Yup.string().when("allergies", {
        is: (allergies: any[]) => allergies.some(a => a.key === concepts.RECREATIONAL_DRUG && a.value),
        then: (schema) => schema.required("Specify drug allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    foodDetails: Yup.string().when("allergies", {
        is: (allergies: any[]) => allergies.some(a => a.key === concepts.FOOD_ALLERGY && a.value),
        then: (schema) => schema.required("Specify food allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    skinPrepDetails: Yup.string().when("allergies", {
        is: (allergies: any[]) => allergies.some(a => a.key === concepts.SKIN_PREP && a.value),
        then: (schema) => schema.required("Specify skin prep allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    latexDetails: Yup.string().when("allergies", {
        is: (allergies: any[]) => allergies.some(a => a.key === concepts.LATEX_ALLERGY && a.value),
        then: (schema) => schema.required("Specify latex allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    medicationsDetails: Yup.string().when("allergies", {
        is: (allergies: any[]) => allergies.some(a => a.key === concepts.MEDICATION_ALLERGY && a.value),
        then: (schema) => schema.required("Specify medication allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
    otherDetails: Yup.string().when("allergies", {
        is: (allergies: any[]) => allergies.some(a => a.key === concepts.OTHER && a.value),
        then: (schema) => schema.required("Specify other allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

// Component to manage individual allergies with their detail fields
const AllergyItem = ({ allergy }: { allergy: { value: string, label: string } }) => {
    const { values } = useFormikContext<any>();

    const isSelected = values.allergies?.some(
        (item: any) => item.key === allergy.value && item.value
    );

    let detailFieldName = "";
    if (allergy.value === concepts.RECREATIONAL_DRUG) detailFieldName = "drugsDetails";
    else if (allergy.value === concepts.FOOD_ALLERGY) detailFieldName = "foodDetails";
    else if (allergy.value === concepts.SKIN_PREP) detailFieldName = "skinPrepDetails";
    else if (allergy.value === concepts.LATEX_ALLERGY) detailFieldName = "latexDetails";
    else if (allergy.value === concepts.MEDICATION_ALLERGY) detailFieldName = "medicationsDetails";
    else if (allergy.value === concepts.OTHER) detailFieldName = "otherDetails";

    return (
        <div key={allergy.value} style={{ marginBottom: "10px" }}>
            <CheckboxesGroup
                name="allergies"
                allowFilter={false}
                options={[allergy]}
            />

            {isSelected && (
                <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                    <TextInputField
                        name={detailFieldName}
                        label={`Specify ${allergy.label.toLowerCase()} allergy`}
                        placeholder={`Enter ${allergy.label.toLowerCase()} allergy details`}
                        id={detailFieldName}
                    />
                </div>
            )}
        </div>
    );
};

export const AllergiesForm = ({ onSubmit, onSkip }: Prop) => {
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

        // Extract selected allergies from form values
        const selectedAllergies = (values.allergies || [])
            .filter((item: any) => item.value)
            .map((item: any) => item.key);

        console.log("Selected allergies:", selectedAllergies);

        // Create an array to hold all our observations
        const obs: { concept: string; value: string; obsDatetime: string; }[] = [];

        // Process each allergy and add appropriate observations to the array
        selectedAllergies.forEach((allergyKey: string) => {
            let value = "";
            const option = allergyOptions.find(opt => opt.value === allergyKey);
            const label = option ? option.label : "Unknown";

            // Get details based on allergy type
            if (allergyKey === concepts.RECREATIONAL_DRUG) {
                value = `${label}: ${values.drugsDetails || ""}`;
            } else if (allergyKey === concepts.FOOD_ALLERGY) {
                value = `${label}: ${values.foodDetails || ""}`;
            } else if (allergyKey === concepts.SKIN_PREP) {
                value = `${label}: ${values.skinPrepDetails || ""}`;
            } else if (allergyKey === concepts.LATEX_ALLERGY) {
                value = `${label}: ${values.latexDetails || ""}`;
            } else if (allergyKey === concepts.MEDICATION_ALLERGY) {
                value = `${label}: ${values.medicationsDetails || ""}`;
            } else if (allergyKey === concepts.OTHER) {
                value = `${label}: ${values.otherDetails || ""}`;
            }

            // Add this observation to our array
            obs.push({
                concept: concepts.ALLERGIC_REACTION,
                value,
                obsDatetime: currentDateTime,
            });
        });

        console.log("Submitting observations:", obs);

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
            onSubmit={handleSubmit}
        >
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="Allergies and Adverse Reactions">
                        {allergyOptions.map((allergy) => (
                            <AllergyItem key={allergy.value} allergy={allergy} />
                        ))}
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};