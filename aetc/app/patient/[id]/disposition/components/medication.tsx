import {
    FormDatePicker,
    FormikInit,
    FormValuesListener,
    MainButton,
    SearchComboBox,
    TextInputField,
    UnitInputField,
    WrapperBox,
} from "@/components";

import React, { useEffect, useState } from "react";
import { FieldArray } from "formik";
import * as yup from "yup";
import { Box, Paper, TableCell, Typography } from "@mui/material";
import DynamicFormList from "@/components/form/dynamicFormList";
import { IoTimeOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";

import { concepts, durationOptions, encounters } from "@/constants";
import { getAllDrugs } from "@/hooks/drugs";
import {
    addEncounter,
    fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { getActivePatientDetails, useNavigation } from "@/hooks";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { PrescribedMedicationList } from "../../nursingChart/components/prescribedMedicationList";
import { AccordionComponent } from "@/components/accordion";
import useFetchMedications from "@/hooks/useFetchMedications";
import { useServerTime } from "@/contexts/serverTimeContext";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
    encounterType?: string;
    onSubmissionSuccess: () => void;
    medicationTitle?: string;
    medicationLabelTitle?: string
};
type Medication = {
    name: string;
    formulation: string;
    medication_dose: number;
    medication_dose_unit: string;
    medication_frequency: string;
    medication_duration: number;
    medication_duration_unit: string;
    // medication_date_last_taken: string;
    // medication_date_of_last_prescription: string;
};

const medicationTemplate: Medication = {
    name: "",
    formulation: "",
    medication_dose: 0,
    medication_dose_unit: "",
    medication_frequency: "",
    medication_duration: 0,
    medication_duration_unit: "",
    // medication_date_last_taken: "",
    // medication_date_of_last_prescription: "",
};

const initialValues = {
    medications: [medicationTemplate],
};

const formulationOptions = [
    { id: concepts.TABLET, label: "Tablet" },
    { id: concepts.VIAL, label: "Vial" },
    { id: concepts.INTRAVENOUS, label: "Intravenous" },
    { id: concepts.POWDER, label: "Powder" },
    { id: concepts.SOLUTION, label: "Solution" },
    { id: concepts.EYE_OINTMENT, label: "Eye Ointment" },
    { id: concepts.CREAM, label: "Cream" },
    { id: concepts.EYE_DROPS, label: "Eye Drops" },
    { id: concepts.OINTMENT, label: "Ointment" },
    { id: concepts.INHALER, label: "Inhaler" },
    { id: concepts.SUPPOSITORY, label: "Suppository" },
    { id: concepts.PESSARY, label: "Pessary" },
    { id: concepts.SUSPENSION, label: "Suspension" },
    { id: concepts.SHAMPOO, label: "Shampoo" },
    { id: concepts.EAR_DROPS, label: "Ear Drops" },
    { id: concepts.EYE_PASTE, label: "Eye Paste" },
];

const frequencyOptions = [
    { id: "STAT", label: "STAT" },
    { id: concepts.ONCE_A_DAY, label: "24 Hourly (OD) - Once a day " },
    { id: concepts.TWICE_A_DAY, label: "12 Hourly (BID) - Twice a day" },
    {
        id: concepts.THREE_TIMES_A_DAY,
        label: "8 Hourly (TID) - Three times a day",
    },
    { id: concepts.FOUR_TIMES_A_DAY, label: "6 Hourly (QID) - Four times a day" },
    { id: concepts.SIX_TIMES_A_DAY, label: "4 Hourly (OD) - Six times a day " },
    { id: concepts.ONCE_A_WEEK, label: "Once a week" },
    { id: concepts.ONCE_A_MONTH, label: "Once a month" },
    { id: concepts.MORNING, label: "Morning" },
    { id: concepts.EVENING, label: "Evening" },
    { id: concepts.OTHER, label: "Other" },
];

// Validation schema
const schema = yup.object().shape({
    medications: yup.array().of(
        yup.object().shape({
            name: yup.string().required("Medication name is required"),
            formulation: yup.string().required("Formulation is required"),
            medication_dose: yup
                .number()
                .required("Dose is required")
                .positive("Dose must be greater than 0"),
            medication_dose_unit: yup.string().required("Dose unit is required"),
            medication_frequency: yup.string().required("Frequency is required"),
            medication_duration: yup
                .number()
                .required("Duration is required")
                .positive("Duration must be greater than 0"),
            medication_duration_unit: yup
                .string()
                .required("Duration unit is required"),
            medication_date_last_taken: yup
                .date()
                .nullable()
                .required("Date of last taken is required"),
            medication_date_of_last_prescription: yup
                .date()
                .nullable()
                .required("Date of last prescription is required"),
        })
    ),
});

const medicationUnits = [
    "Milligrams (mg)",
    "Micrograms (µg)",
    "Grams (g)",
    "International Units (IU)",
    "Milliliters (ml)",
    "Millimoles (mmol)",
];

export const MedicationsForm = ({
    onSubmit,
    onSkip,
    encounterType = encounters.DISPOSED_PRESCRIPTIONS,
    onSubmissionSuccess,
    medicationTitle = "Prescribed Medication",
    medicationLabelTitle,
}: Prop) => {
    const { ServerTime } = useServerTime();
    const {
        mutate,
        isPending: addingDrugs,
        isSuccess,
    } = fetchConceptAndCreateEncounter();
    const { medicationOptions, loadingDrugs } = useFetchMedications();

    const [otherFrequency, setOtherFrequency] = useState<{
        [key: number]: boolean;
    }>({});
    const [formValues, setFormValues] = useState<any>({ medications: [] });
    const { activeVisit, patientId } = getActivePatientDetails();

    const handleUpdateFrequency = (index: number, value: boolean) => {
        setOtherFrequency((prevState) => ({
            ...prevState,
            [index]: value,
        }));
    };

    useEffect(() => {
        if (isSuccess) {
            onSubmissionSuccess();
        }
    }, [isSuccess]);

    const handleSubmit = () => {
        const obsDateTime = ServerTime.getServerTimeString();

        const obs = formValues.medications.map((medication: any) => {
            return {
                concept: concepts.DRUG_GIVEN,
                value: medication.name,
                obsDateTime,
                groupMembers: [
                    {
                        concept: concepts.MEDICATION_FORMULATION,
                        value: medication.formulation,
                        obsDateTime,
                    },
                    {
                        concept: concepts.MEDICATION_DOSE,
                        value: medication.medication_dose,
                        obsDateTime,
                    },
                    {
                        concept: concepts.MEDICATION_DOSE_UNIT,
                        value: medication.medication_dose_unit,
                        obsDateTime,
                    },
                    {
                        concept: concepts.MEDICATION_FREQUENCY,
                        value: medication.medication_frequency,
                        obsDateTime,
                    },
                    {
                        concept: concepts.MEDICATION_DURATION,
                        value: medication.medication_duration,
                        obsDateTime,
                    },
                    {
                        concept: concepts.MEDICATION_DURATION_UNIT,
                        value: medication.medication_duration_unit,
                        obsDateTime,
                    },
                    {
                        concept: concepts.DESCRIPTION,
                        value: "current",
                        obsDateTime,
                    },
                ],
            };
        });

        mutate({
            encounterType: encounterType,
            visit: activeVisit,
            patient: patientId,
            encounterDatetime: obsDateTime,
            obs,
        });
    };

    const sections = [
        {
            id: "prescribed",
            title: medicationTitle,
            content: (
                <PrescribedMedicationList
                    medicationLabelTitle={medicationLabelTitle}
                    encounterType={encounterType}
                />
            ),
        },
    ];
    return (
        <ContainerLoaderOverlay loading={addingDrugs || loadingDrugs}>
            <AccordionComponent sections={sections} />
            <br />
            <FormikInit
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={onSubmit}
                enableReinitialize
                submitButton={false}
            >
                {({ values, setFieldValue }) => (
                    <>
                        <FormValuesListener getValues={setFormValues} />
                        <FieldArray name="medications">
                            {({ push, remove }) => (
                                <DynamicFormList
                                    items={values.medications}
                                    setItems={(newItems) =>
                                        setFieldValue("medications", newItems)
                                    }
                                    newItem={medicationTemplate}
                                    renderFields={(item, index) => (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <SearchComboBox
                                                name={`medications[${index}].name`}
                                                label="Medication Name"
                                                options={medicationOptions}
                                                getValue={(value) =>
                                                    setFieldValue(`medications[${index}].name`, value)
                                                }
                                                multiple={false}
                                            />
                                            <SearchComboBox
                                                name={`medications[${index}].formulation`}
                                                label="Formulation"
                                                options={formulationOptions}
                                                getValue={(value) =>
                                                    setFieldValue(
                                                        `medications[${index}].formulation`,
                                                        value
                                                    )
                                                }
                                                sx={{ flex: 1 }}
                                                multiple={false}
                                            />
                                            <UnitInputField
                                                id={`medications[${index}].medication_dose`}
                                                label="Dose"
                                                name={`medications[${index}].medication_dose`}
                                                unitName={`medications[${index}].medication_dose_unit`}
                                                unitOptions={medicationUnits}
                                                placeholder="e.g., 500"
                                                // sx={{ flex: 1 }}
                                                inputIcon={<GiMedicines />}
                                            />
                                            {!otherFrequency[index] ? (
                                                <SearchComboBox
                                                    name={`medications[${index}].medication_frequency`}
                                                    label="Frequency"
                                                    options={frequencyOptions}
                                                    getValue={(value) => {
                                                        if (value === "Other")
                                                            handleUpdateFrequency(index, true);
                                                        setFieldValue(
                                                            `medications[${index}].medication_frequency`,
                                                            value
                                                        );
                                                    }}
                                                    // sx={{ flex: 1 }}
                                                    multiple={false}
                                                />
                                            ) : (
                                                <TextInputField
                                                    id={`medications[${index}].medication_frequency`}
                                                    name={`medications[${index}].medication_frequency`}
                                                    label="Specify frequency"
                                                    sx={{ flex: 1 }}
                                                />
                                            )}
                                            {formValues?.medications[index]?.medication_frequency !=
                                                "STAT" && (
                                                    <UnitInputField
                                                        id={`medications[${index}].medication_duration`}
                                                        name={`medications[${index}].medication_duration`}
                                                        unitName={`medications[${index}].medication_duration_unit`}
                                                        label="Duration"
                                                        unitOptions={durationOptions}
                                                        placeholder="e.g. 7"
                                                        inputIcon={<IoTimeOutline />}
                                                        sx={{ flex: 1 }}
                                                    />
                                                )}
                                        </Box>
                                    )}
                                />
                            )}
                        </FieldArray>
                        <WrapperBox sx={{ mt: "2ch" }}>
                            <MainButton
                                sx={{ m: 0.5 }}
                                title="Submit"
                                type="submit"
                                onClick={handleSubmit}
                            />
                        </WrapperBox>
                    </>
                )}
            </FormikInit>
        </ContainerLoaderOverlay>
    );
};
