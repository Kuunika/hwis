import {
    FormikInit,
    FormValuesListener,
    TextInputField,
} from "@/components";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import { concepts } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import {
    getInitialValues,
    getObservations,
    mapSearchComboOptionsToConcepts,
} from "@/helpers";
import { useAllergyFormat } from "@/hooks/useAllergyFormat";
import { useState } from "react";
import * as Yup from "yup";

const form = {
    allergy: {
        name: concepts.ALLERGY,
        label: "Allergy",
    },
    allergyDetails: {
        name: concepts.ALLERGY_DETAILS,
        label: "Other",
    },
};

const initialValues = getInitialValues(form);

// Updated validation schema to require allergy details when any "Other" allergen type is selected
const schema = Yup.object().shape({
    [form.allergyDetails.name]: Yup.string().when(form.allergy.name, {
        is: (allergies: any[]) => {
            // Check if any "Other" allergen type is selected
            return allergies && allergies.some((allergy: any) =>
                allergy.label === "Other Medication Allergen" ||
                allergy.label === "Other Medical Substance Allergen" ||
                allergy.label === "Other Substance Allergen" ||
                allergy.label === "Other Food Allergen" ||
                allergy.id === concepts.OTHER
            );
        },
        then: (schema) => schema.required('Please specify the other allergy details'),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export const AllergyHistory = ({
    onSubmit,
}: {
    onSubmit: (values: any) => void;
}) => {
    const { allergyOptions } = useAllergyFormat();
    const { ServerTime } = useServerTime();
    const [formValues, setFormValues] = useState<any>({});

    // Check if any "Other" allergen type is selected
    const selectedAllergies = formValues[form.allergy.name] || [];
    const isOtherSelected = selectedAllergies.some((allergy: any) =>
        allergy.label === "Other Medication Allergen" ||
        allergy.label === "Other Medical Substance Allergen" ||
        allergy.label === "Other Substance Allergen" ||
        allergy.label === "Other Food Allergen" ||
        allergy.id === concepts.OTHER
    );

    const handleSubmit = (values: any) => {
        const formValues = { ...values };
        const obsDatetime = ServerTime.getServerTimeString();

        const selectedAllergies = formValues[form.allergy.name] || [];

        // Create child observations for each allergy
        const allergyObservations = selectedAllergies.map((allergy: any) => {
            if (allergy.id === concepts.OTHER ||
                allergy.label === "Other Medication Allergen" ||
                allergy.label === "Other Medical Substance Allergen" ||
                allergy.label === "Other Substance Allergen" ||
                allergy.label === "Other Food Allergen") {
                return {
                    concept: form.allergy.name,
                    value: formValues[form.allergyDetails.name] || "Other allergy specified",
                    obsDatetime,
                };
            }

            return {
                concept: form.allergy.name,
                value: allergy.label,   // 👈 store actual allergy name here
                obsDatetime,
            };
        });

        // Parent allergy observation (group)
        const obsFormatted = [
            {
                concept: form.allergy.name,
                value: "Allergic reaction",
                groupMembers: allergyObservations,
                obsDatetime,
            },
        ];

        // Process any additional free-text fields (e.g., "Other details")
        // delete formValues[form.allergy.name];
        // const obs = getObservations(formValues, obsDatetime);
        const { [form.allergy.name]: removedAllergy, ...otherFormValues } = formValues;
        const obs = getObservations(otherFormValues, obsDatetime);

        onSubmit([...obs, ...obsFormatted]);
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitButtonText="next"
        >
            <FormValuesListener getValues={setFormValues} />
            <GroupedSearchComboBox
                options={allergyOptions}
                multiple={true}
                name={form.allergy.name}
                label={form.allergy.label}
            />
            <br />

            {/* Conditionally render the text field when any "Other" allergen type is selected */}
            {isOtherSelected && (
                <TextInputField
                    multiline
                    rows={4}
                    name={form.allergyDetails.name}
                    label={form.allergyDetails.label}
                    id={form.allergyDetails.name}
                    sx={{ width: "100%" }}
                />
            )}
        </FormikInit>
    );
};