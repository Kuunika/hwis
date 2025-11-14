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
import { Box } from "@mui/material";
import DynamicFormList from "@/components/form/dynamicFormList";
import { IoTimeOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";

import { concepts, durationOptions, encounters } from "@/constants";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks";
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
  medicationLabelTitle?: string;
};
type Medication = {
  name: string;
  formulation: string;
  medication_dose: number;
  medication_dose_unit: string;
  medication_frequency: string;
  medication_duration: number;
  medication_duration_unit: string;
  specify?: string;
  diluent?: string;
  finalVolume?: string;
  rate?: string;
  route: string;
  otherDiluent: string;
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
  specify: "",
  diluent: "",
  finalVolume: "",
  route: "",
  rate: "",
  otherDiluent: "",
  // medication_date_last_taken: "",
  // medication_date_of_last_prescription: "",
};

const diluent = [
  { id: concepts.NORMAL_SALIVA, label: "Normal Saliva" },
  { id: concepts.WATER_FOR_INJECTION, label: "Water for injection" },
  { id: concepts.RINGERS_LACTATE, label: "Ringer’s Lactate" },
  { id: concepts.OTHER, label: "Other" },
];

const routeOptions = [
  {
    id: concepts.PO,
    label: "PO",
  },
  { id: concepts.NG, label: "PO" },
  { id: concepts.IM, label: "IM" },
  { id: concepts.IV, label: "IV" },
  { id: concepts.PR, label: "PR" },
  { id: concepts.SUBLINGUAL, label: "Sublingual" },
  { id: concepts.SUBCUT, label: "Sub cut" },
  { id: concepts.TOPICAL, label: "Topical" },
  { id: concepts.INTRANAS, label: "Intranas" },
  { id: concepts.INTRAOSSEOUS, label: "Intraosseous" },
];

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
  { id: concepts.PRN, label: "PRN" },
  { id: concepts.CONTINOUS_INFUSION, label: "Continous Infusion" },
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
      specify: yup.string(),
      diluent: yup.string().label("Diluent"),
      finalVolume: yup.string().label("Final Volume"),
      rate: yup.string().label("Rate"),
      route: yup.string().required().label("route"),
      otherDiluent: yup.string().label("specify diluent"),
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
  "Microg/kg/hr",
  "Mg/kg/hr",
];

export const MedicationsForm = ({
  onSubmit,
  onSkip,
  encounterType = encounters.PRESCRIPTIONS,
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
            concept: concepts.MEDICATION_ROUTE,
            value: medication.route,
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
            groupMembers: [
              {
                concept: concepts.DILUENT,
                value: medication.diluent,
                obsDateTime,
              },
              {
                concept: concepts.FINAL_VOLUME,
                value: medication.finalVolume,
                obsDateTime,
              },
              {
                concept: concepts.RATE,
                value: medication.rate,
                obsDateTime,
              },
              {
                concept: concepts.SPECIFY,
                value: medication.otherDiluent,
                obsDateTime,
              },
            ],
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
            concept: concepts.SPECIFY,
            value: medication.specify,
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

                      <SearchComboBox
                        name={`medications[${index}].route`}
                        label="Route"
                        options={routeOptions}
                        multiple={false}
                      />
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
                        multiple={false}
                      />

                      {formValues?.medications[index]?.medication_frequency ==
                        "Other" && (
                        <TextInputField
                          id={`medications[${index}].medication_frequency`}
                          name={`medications[${index}].specify`}
                          label="Specify frequency"
                          sx={{ width: "100%" }}
                        />
                      )}

                      {formValues?.medications[index]?.medication_frequency ==
                        concepts.CONTINOUS_INFUSION && (
                        <>
                          <SearchComboBox
                            name={`medications[${index}].diluent`}
                            label="Diluent"
                            options={diluent}
                            multiple={false}
                          />
                          {formValues?.medications[index]?.diluent ==
                            concepts.OTHER && (
                            <TextInputField
                              id={`medications[${index}].other_diluent`}
                              name={`medications[${index}].other_diluent`}
                              label="Specify Diluent"
                              sx={{ width: "100%" }}
                            />
                          )}
                          <TextInputField
                            id={`medications[${index}].finalVolume`}
                            name={`medications[${index}].finalVolume`}
                            label="Final Volume"
                            unitOfMeasure="ML"
                            sx={{ width: "100%" }}
                          />
                          <TextInputField
                            id={`medications[${index}].rate`}
                            name={`medications[${index}].rate`}
                            label="Rate"
                            unitOfMeasure="ml/h"
                            sx={{ width: "100%" }}
                          />
                        </>
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
