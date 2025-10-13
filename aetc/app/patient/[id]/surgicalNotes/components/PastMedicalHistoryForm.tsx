"use client";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
    CheckboxesGroup,
    RadioGroupInput,
    TextInputField,
    FormValuesListener,
} from "@/components";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";
import { useFormikContext } from "formik";


type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Define a constant for "None" option
const NONE_CONDITION = "NONE";

// List of past medical history conditions with concepts mapping
const pastMedicalHistoryOptions = [
    { value: NONE_CONDITION, label: "None" },
    { value: concepts.HIV, label: "HIV" },
    { value: concepts.TUBERCULOSIS, label: "Tuberculosis (TB)" },
    { value: concepts.CHRONIC_OBSTRUCTIVE_PULMONARY_DISEASE, label: "Chronic Obstructive Pulmonary Disease (COPD)" },
    { value: concepts.DIABETES_MELLITUS, label: "Diabetes Mellitus" },
    { value: concepts.ASTHMA, label: "Asthma" },
    { value: concepts.EPILEPSY, label: "Epilepsy" },
    { value: concepts.PREVIOUS_STROKE, label: "Previous stroke" },
    { value: concepts.BLEEDING_DISORDERS, label: "Bleeding disorders" },
    { value: concepts.OTHER_CONDITION, label: "Other (Specify)" },
];

// Validation schema
const schema = yup.object().shape({
    pastMedicalHistory: yup
        .array()
        .of(
            yup.object().shape({
                key: yup.string().required(),
                value: yup.boolean().required(),
            })
        )
        .transform((value) =>
            Array.isArray(value) ? value.filter((item: any) => item.value === true) : []
        )
        .min(1, "Select at least one option"),
    otherConditionDetails: yup.string().when("pastMedicalHistory", {
        is: (pastMedicalHistory: any[]) =>
            pastMedicalHistory.some(c => c.key === concepts.OTHER_CONDITION && c.value),
        then: (schema) => schema.required("Please specify the other condition"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

// Watcher component to handle "None" logic
const PastMedicalHistoryWatcher = () => {
    const { values, setFieldValue } = useFormikContext<any>();
    const isUpdatingRef = React.useRef(false);

    useEffect(() => {
        if (!values.pastMedicalHistory || values.pastMedicalHistory.length === 0) return;
        if (isUpdatingRef.current) {
            isUpdatingRef.current = false;
            return;
        }

        const currentHistory = values.pastMedicalHistory;

        const noneItem = currentHistory.find((item: any) => item.key === NONE_CONDITION);
        const otherCheckedConditions = currentHistory.filter((item: any) => item.key !== NONE_CONDITION && item.value);

        // If "None" is checked along with other conditions
        if (noneItem?.value && otherCheckedConditions.length > 0) {
            console.log("None is checked with others - unchecking all others");
            isUpdatingRef.current = true;
            const updatedHistory = currentHistory.map((item: any) => {
                if (item.key === NONE_CONDITION) return item;
                return { ...item, value: false };
            });
            setFieldValue("pastMedicalHistory", updatedHistory);

            // Clear all related fields
            setFieldValue("otherConditionDetails", "");
            setFieldValue("onTreatment", {});
            setFieldValue("medications", {});
        }
    }, [values.pastMedicalHistory]);

    return null;
};

// Component for individual condition item
const ConditionItem = ({
    condition,
    isNoneSelected,
    selectedConditions,
    formik
}: {
    condition: { value: string; label: string };
    isNoneSelected: boolean;
    selectedConditions: string[];
    formik: any;
}) => {
    const isDisabled = isNoneSelected && condition.value !== NONE_CONDITION;
    const isSelected = selectedConditions.includes(condition.value);

    return (
        <div key={condition.value} style={{ marginBottom: "10px" }}>
            {/* Checkbox for each condition */}
            <CheckboxesGroup
                name="pastMedicalHistory"
                allowFilter={false}
                options={[{ value: condition.value, label: condition.label }]}
                disabled={isDisabled}
            />

            {/* If "Other" is selected, show text field to specify */}
            {condition.value === concepts.OTHER_CONDITION && isSelected && (
                <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                    <TextInputField
                        name="otherConditionDetails"
                        label="Specify other condition"
                        placeholder="Enter other medical condition"
                        type="text"
                        id="otherConditionDetails"
                    />
                </div>
            )}

            {/* If the condition is selected (and not "None"), show treatment options */}
            {isSelected && condition.value !== NONE_CONDITION && (
                <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                    <RadioGroupInput
                        name={`onTreatment.${condition.value}`}
                        label={`Are you on treatment for ${condition.label}?`}
                        options={[
                            { value: concepts.YES, label: "Yes" },
                            { value: concepts.NO, label: "No" },
                        ]}
                        getValue={(value) =>
                            formik.setFieldValue(`onTreatment.${condition.value}`, value)
                        }
                    />

                    {formik.values.onTreatment[condition.value] === concepts.YES && (
                        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                            <h5>Medication Details</h5>
                            <TextInputField
                                name={`medications.${condition.value}.currentMedication`}
                                label="Current Medication"
                                type="text"
                                id={`med-${condition.value}`}
                            />
                            <TextInputField
                                name={`medications.${condition.value}.dose`}
                                label="Dose"
                                type="text"
                                id={`dose-${condition.value}`}
                            />
                            <TextInputField
                                name={`medications.${condition.value}.reason`}
                                label="Reason for Taking"
                                type="text"
                                id={`reason-${condition.value}`}
                            />
                            <TextInputField
                                name={`medications.${condition.value}.duration`}
                                label="How long have you been taking it?"
                                type="text"
                                id={`duration-${condition.value}`}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const PastMedicalHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

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

    // Watch for changes in form values
    useEffect(() => {
        if (formValues.pastMedicalHistory) {
            const selected = formValues.pastMedicalHistory
                .filter((item: any) => item.value)
                .map((item: any) => item.key);
            setSelectedConditions(selected);
        }
    }, [formValues.pastMedicalHistory]);

    const handleSubmit = async (values: any) => {
        const currentDateTime = ServerTime.getServerTimeString();

        // Extract the selected conditions
        const selectedConditions = (values.pastMedicalHistory || [])
            .filter((item: any) => item.value)
            .map((item: any) => item.key);

        console.log("Selected conditions:", selectedConditions);

        // If "None" is selected, handle it differently
        if (selectedConditions.includes(NONE_CONDITION)) {
            const payload = {
                encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
                visit: activeVisit?.uuid,
                patient: params.id,
                encounterDatetime: currentDateTime,
                obs: [{
                    concept: concepts.CONDITION,
                    value: "None",
                    obsDatetime: currentDateTime,
                }],
            };

            try {
                await submitEncounter(payload);
                console.log("No past medical history submitted successfully!");
                onSubmit(values);
            } catch (error) {
                console.error("Error submitting past medical history:", error);
            }
            return;
        }

        // Construct observations for selected conditions
        const obs = selectedConditions.map((condition: string) => {
            const isOnTreatment = values.onTreatment[condition] === concepts.YES;

            // Get the condition value - if it's "Other", use the specified details
            let conditionValue = condition;
            if (condition === concepts.OTHER_CONDITION && values.otherConditionDetails) {
                conditionValue = `Other: ${values.otherConditionDetails}`;
            }

            return {
                concept: concepts.CONDITION,
                value: conditionValue,
                obsDatetime: currentDateTime,
                groupMembers: [
                    {
                        concept: concepts.ON_TREATMENT,
                        value: values.onTreatment[condition] || concepts.NO,
                        obsDatetime: currentDateTime,
                    },
                    ...(isOnTreatment
                        ? [
                            {
                                concept: concepts.MEDICATION,
                                value: values.medications?.[condition]?.currentMedication || "",
                                obsDatetime: currentDateTime,
                            },
                            {
                                concept: concepts.MEDICATION_DOSE,
                                value: values.medications?.[condition]?.dose || "",
                                obsDatetime: currentDateTime,
                            },
                            {
                                concept: concepts.REASON_FOR_REQUEST,
                                value: values.medications?.[condition]?.reason || "",
                                obsDatetime: currentDateTime,
                            },
                            {
                                concept: concepts.MEDICATION_DURATION,
                                value: values.medications?.[condition]?.duration || "",
                                obsDatetime: currentDateTime,
                            },
                        ]
                        : []),
                ],
            };
        });

        // Construct the encounter payload
        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            console.log("Past Medical History submitted successfully!");
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting Past Medical History: ", error);
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                pastMedicalHistory: [],
                onTreatment: {},
                medications: {},
                otherConditionDetails: "",
            }}
            onSubmit={handleSubmit}
        >
            {(formik) => {
                const isNoneSelected = formik.values.pastMedicalHistory?.some(
                    (item: any) => item.key === NONE_CONDITION && item.value
                );

                return (
                    <FormFieldContainer direction="column">
                        <FormValuesListener getValues={setFormValues} />
                        <PastMedicalHistoryWatcher />
                        <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                            <FormFieldContainerLayout title="Past Medical History">
                                {pastMedicalHistoryOptions.map((condition) => (
                                    <ConditionItem
                                        key={condition.value}
                                        condition={condition}
                                        isNoneSelected={isNoneSelected}
                                        selectedConditions={selectedConditions}
                                        formik={formik}
                                    />
                                ))}
                            </FormFieldContainerLayout>
                        </WrapperBox>
                    </FormFieldContainer>
                );
            }}
        </FormikInit>
    );
};