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
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useFormikContext } from "formik";
import { useServerTime } from "@/contexts/serverTimeContext";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

// Define a constant for "None" option
const NONE_ALLERGY = "NONE";

// Allergy options
const allergyOptions = [
    { value: NONE_ALLERGY, label: "None" },
    { value: concepts.RECREATIONAL_DRUG, label: "Drugs" },
    { value: concepts.FOOD_ALLERGY, label: "Food" },
    { value: concepts.SKIN_PREP, label: "Skin prep" },
    { value: concepts.LATEX_ALLERGY, label: "Latex" },
    { value: concepts.MEDICATION_ALLERGY, label: "Medications" },
    { value: concepts.OTHER_CONDITION, label: "Other (Specify)" },
];

const schema = Yup.object().shape({
    allergies: Yup.array().min(1, "Please select at least one option"),
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
        is: (allergies: any[]) => allergies.some(a => a.key === concepts.OTHER_CONDITION && a.value),
        then: (schema) => schema.required("Specify other allergy"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

// Watch for changes in allergies and handle "None" logic
const AllergiesWatcher = () => {
    const { values, setFieldValue } = useFormikContext<any>();
    const isUpdatingRef = React.useRef(false);

    useEffect(() => {
        if (!values.allergies || values.allergies.length === 0) return;
        if (isUpdatingRef.current) {
            isUpdatingRef.current = false;
            return;
        }

        const currentAllergies = values.allergies;

        const noneItem = currentAllergies.find((item: any) => item.key === NONE_ALLERGY);
        const otherCheckedAllergies = currentAllergies.filter((item: any) => item.key !== NONE_ALLERGY && item.value);

        // If "None" is checked along with other allergies
        if (noneItem?.value && otherCheckedAllergies.length > 0) {
            console.log("None is checked with others - unchecking all others");
            isUpdatingRef.current = true;
            const updatedAllergies = currentAllergies.map((item: any) => {
                if (item.key === NONE_ALLERGY) return item;
                return { ...item, value: false };
            });
            setFieldValue("allergies", updatedAllergies);

            // Clear all detail fields
            setFieldValue("drugsDetails", "");
            setFieldValue("foodDetails", "");
            setFieldValue("skinPrepDetails", "");
            setFieldValue("latexDetails", "");
            setFieldValue("medicationsDetails", "");
            setFieldValue("otherDetails", "");
        }
        // If other allergies are checked, uncheck "None"
        else if (!noneItem?.value && otherCheckedAllergies.length > 0) {
            // Check if None exists in the array but is false
            const noneExists = currentAllergies.some((item: any) => item.key === NONE_ALLERGY);
            if (noneExists && noneItem?.value === false) {
                // None is already unchecked, do nothing
                return;
            }
        }
    }, [values.allergies]);

    return null;
};

// Component to manage individual allergies with their detail fields
const AllergyItem = ({ allergy, isNoneSelected }: { allergy: { value: string, label: string }, isNoneSelected: boolean }) => {
    const { values } = useFormikContext<any>();

    const isSelected = values.allergies?.some(
        (item: any) => item.key === allergy.value && item.value
    );

    // Disable other allergies if "None" is selected (but not "None" itself)
    const isDisabled = isNoneSelected && allergy.value !== NONE_ALLERGY;

    let detailFieldName = "";
    if (allergy.value === concepts.RECREATIONAL_DRUG) detailFieldName = "drugsDetails";
    else if (allergy.value === concepts.FOOD_ALLERGY) detailFieldName = "foodDetails";
    else if (allergy.value === concepts.SKIN_PREP) detailFieldName = "skinPrepDetails";
    else if (allergy.value === concepts.LATEX_ALLERGY) detailFieldName = "latexDetails";
    else if (allergy.value === concepts.MEDICATION_ALLERGY) detailFieldName = "medicationsDetails";
    else if (allergy.value === concepts.OTHER_CONDITION) detailFieldName = "otherDetails";

    return (
        <div key={allergy.value} style={{ marginBottom: "10px" }}>
            <CheckboxesGroup
                name="allergies"
                allowFilter={false}
                options={[allergy]}
                disabled={isDisabled}
            />

            {isSelected && detailFieldName && (
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
  const { init, ServerTime } = useServerTime();

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
    const currentDateTime = ServerTime.getServerTimeString();

    // Extract selected allergies from form values
    const selectedAllergies = (values.allergies || [])
      .filter((item: any) => item.value)
      .map((item: any) => item.key);

        console.log("Selected allergies:", selectedAllergies);

        // If "None" is selected, handle it differently
        if (selectedAllergies.includes(NONE_ALLERGY)) {
            const payload = {
                encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
                visit: activeVisit?.uuid,
                patient: params.id,
                encounterDatetime: currentDateTime,
                obs: [{
                    concept: concepts.ALLERGIC_REACTION,
                    value: "None",
                    obsDatetime: currentDateTime,
                }],
            };

            try {
                await submitEncounter(payload);
                console.log("No allergies submitted successfully!");
                onSubmit(values);
            } catch (error) {
                console.error("Error submitting allergies:", error);
            }
            return;
        }

    // Create an array to hold all our observations
    const obs: { concept: string; value: string; obsDatetime: string }[] = [];

    // Process each allergy and add appropriate observations to the array
    selectedAllergies.forEach((allergyKey: string) => {
      let value = "";
      const option = allergyOptions.find((opt) => opt.value === allergyKey);
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
            } else if (allergyKey === concepts.OTHER_CONDITION) {
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
            {({ values }: any) => {
                const isNoneSelected = values.allergies?.some(
                    (item: any) => item.key === NONE_ALLERGY && item.value
                );

                return (
                    <>
                        <AllergiesWatcher />
                        <FormFieldContainer direction="column">
                            <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                                <FormFieldContainerLayout title="Allergies and Adverse Reactions">
                                    {allergyOptions.map((allergy) => (
                                        <AllergyItem
                                            key={allergy.value}
                                            allergy={allergy}
                                            isNoneSelected={isNoneSelected}
                                        />
                                    ))}
                                </FormFieldContainerLayout>
                            </WrapperBox>
                        </FormFieldContainer>
                    </>
                );
            }}
        </FormikInit>
    );
};
