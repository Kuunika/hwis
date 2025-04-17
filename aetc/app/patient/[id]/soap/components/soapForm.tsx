import {
  CheckboxesGroup,
  FormDatePicker,
  FormFieldContainer,
  FormFieldContainerMultiple,
  FormikInit,
  FormValuesListener,
  SearchComboBox,
  TextInputField,
  UnitInputField,
  WrapperBox,
} from "@/components";
import { getInitialValues, getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import {
  getActivePatientDetails,
  useNavigation,
  useSubmitEncounter,
} from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatient } from "@/services/patient";
import { Box, Button, Typography, Paper, TextField } from "@mui/material";
import * as Yup from "yup";
import { useState } from "react";
import {
  ErrorMessage,
  FieldArray,
  useFormikContext,
  FormikProps,
} from "formik";
import DynamicFormList from "@/components/form/dynamicFormList";
import { GiMedicines } from "react-icons/gi";
import { IoTimeOutline } from "react-icons/io5";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import useFetchMedications from "@/hooks/useFetchMedications";
import { concepts, durationOptions, encounters } from "@/constants";
import * as yup from "yup";
import { PrescribedMedication } from "@/app/patient/[id]/nursingChart/components/prescribedMedications";

type Medication = {
  name: string;
  formulation: string;
  medication_dose: number;
  medication_route: string;
  medication_dose_unit: string;
  medication_frequency: string;
  medication_duration: number;
  medication_duration_unit: string;
  // medication_date_last_taken: string;
  // medication_date_of_last_prescription: string;
};

interface FormValues {
  procedures: any[]; // or a more specific type
  supportiveCare: any[];
  otherProcedureSpecify?: string;
  otherSupportiveCareSpecify?: string;
  medications: Medication[];
  [key: string]: any;
}
const medicationTemplate: Medication = {
  name: "",
  formulation: "",
  medication_dose: 0,
  medication_dose_unit: "",
  medication_route: "",
  medication_frequency: "",
  medication_duration: 0,
  medication_duration_unit: "",
  // medication_date_last_taken: "",
  // medication_date_of_last_prescription: "",
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
  { id: concepts.OTHER, label: "Other" },
];

const medicationUnits = [
  "Milligrams (mg)",
  "Micrograms (µg)",
  "Grams (g)",
  "International Units (IU)",
  "Milliliters (ml)",
  "Millimoles (mmol)",
];

const form = {
  subjective: {
    name: concepts.SUBJECTIVE,
    label: "Subjective",
  },
  objective: {
    name: concepts.MEDICAL_RECORD_OBSERVATIONS,
    label: "General observation",
  },
  systolic: {
    name: concepts.SYSTOLIC_BLOOD_PRESSURE,
    label: "Systolic",
  },
  diastolic: {
    name: concepts.DIASTOLIC_BLOOD_PRESSURE,
    label: "Diastolic",
  },
  pulseRate: {
    name: concepts.PULSE_RATE,
    label: "Pulse Rate",
  },
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate",
  },
  spo: {
    name: concepts.SPO2,
    label: "SPO2",
  },
  temperature: {
    name: concepts.TEMPERATURE,
    label: "Temperature",
  },
  MRDT: {
    name: concepts.MRDT,
    label: "MRDT",
  },
  RBG: {
    name: concepts.BLOOD_GLUCOSE,
    label: "RBG",
  },
  PT: {
    name: concepts.INVESTIGATIONS_PT,
    label: "PT",
  },
  urineDipstick: {
    name: concepts.URINE_DIPSTICK_KETONES,
    label: "Urine Dipstick",
  },
  assessment: {
    name: concepts.ASSESSMENT,
    label: "Assessment",
  },
  plan: {
    name: concepts.PLAN,
    label: "Plan",
  },
  evaluation: {
    name: concepts.EVALUATION,
    label: "Evaluation",
  },
  replan: {
    name: concepts.REPLAN,
    label: "Replan",
  },
  implementation: {
    name: concepts.IMPLEMENTATION,
    label: "Implementation",
  },
  medications: [medicationTemplate] as any,
  procedures: [],
  supportiveCare: [],
  otherProcedureSpecify: "",
  otherSupportiveCareSpecify: "",
};
const proceduresConfig = [
  { value: concepts.INTRAVENOUS_CANNULATION, label: "Intravenous Cannulation" },
  {
    value: concepts.CATHETERIZATION_URETHRAL,
    label: "Urethral Catheterization",
  },
  { value: concepts.SUCTIONING, label: "Suctioning" },
  {
    value: concepts.OROPHARYNGEAL_AIRWAY_INSERTION,
    label: "Oropharyngeal Airway Insertion",
  },
  {
    value: concepts.NASOPHARYNGEAL_AIRWAY_INSERTION,
    label: "Nasopharyngeal Airway Insertion",
  },
  {
    value: concepts.LARYNGEAL_MASK_AIRWAY_INSERTION,
    label: "Laryngeal Mask Airway Insertion",
  },
  {
    value: concepts.NASOGASTRIC_TUBE_INSERTION,
    label: "Nasogastric Tube Insertion",
  },
  { value: concepts.OTHER, label: "Other (Specify)" },
];

const supportiveCareConfig = [
  { value: concepts.WOUND_DRESSING, label: "Wound Dressing" },
  { value: concepts.PATIENT_EDUCATION, label: "Patient Education" },
  { value: concepts.COUNSELLING, label: "Counselling" },
  { value: concepts.FEEDING, label: "Feeding" },
  { value: concepts.OXYGENATION, label: "Oxygenation" },
  { value: concepts.TAPID_SPONGING, label: "Tapid Sponging" },
  {
    value: concepts.ELECTROCARDIOGRAPHY_MONITORING,
    label: "Electrocardiography (ECG) Monitoring",
  },
  { value: concepts.TURNING_PATIENTS, label: "Turning Patients" },
  { value: concepts.ORAL_CARE, label: "Oral Care" },
  { value: concepts.OTHER, label: "Other (Specify)" },
];
const validationSchema = Yup.object().shape({
  [form.subjective.name]: Yup.string().required(form.subjective.label),
  [form.objective.name]: Yup.string().required(form.objective.label),
  [form.assessment.name]: Yup.string().required(form.assessment.label),
  [form.plan.name]: Yup.string().required(form.plan.label),
  [form.evaluation.name]: Yup.string().required(form.evaluation.label),
  [form.replan.name]: Yup.string().required(form.replan.label),
  [form.implementation.name]: Yup.string().required(form.implementation.label),
  [form.MRDT.name]: Yup.string(),
  [form.RBG.name]: Yup.string(),
  [form.PT.name]: Yup.string(),
  [form.urineDipstick.name]: Yup.string(),
  procedures: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string().required(),
        value: yup.boolean().required(),
      })
    )
    .transform((value) =>
      Array.isArray(value)
        ? value.filter((item: any) => item.value === true)
        : []
    )
    .min(1, "At least one procedure must be selected"),

  otherProcedureSpecify: yup
    .string()
    .nullable()
    .when("procedures", {
      is: (procedures: any[]) =>
        procedures.some((procedure) => procedure.key === concepts.OTHER),
      then: (schema) => schema.required("Please specify the other procedure"),
    }),

  supportiveCare: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string().required(),
        value: yup.boolean().required(),
      })
    )
    .transform((value) =>
      Array.isArray(value)
        ? value.filter((item: any) => item.value === true)
        : []
    )
    .min(1, "At least one supportive care option must be selected"),

  otherSupportiveCareSpecify: yup
    .string()
    .nullable()
    .when("supportiveCare", {
      is: (supportiveCare: any[]) =>
        supportiveCare.some((care) => care.key === concepts.OTHER),
      then: (schema) =>
        schema.required("Please specify the other supportive care"),
    }),
  [form.spo.name]: Yup.number()
    .min(0)
    .max(100)
    .required()
    .label(form.spo.label),
  [form.respiratoryRate.name]: Yup.number()
    .min(0)
    .max(90)
    .required()
    .label(form.respiratoryRate.label),
  [form.systolic.name]: Yup.number()
    .min(0)
    .max(300)
    .required()
    .label(form.systolic.label),
  [form.diastolic.name]: Yup.number()
    .min(0)
    .max(300)
    .required()
    .label(form.diastolic.label),
  [form.temperature.name]: Yup.number()
    .min(20)
    .max(45)
    .required()
    .label(form.temperature.label),
  [form.pulseRate.name]: Yup.number()
    .min(60)
    .max(100)
    .label(form.pulseRate.label),
});

const initialValues = getInitialValues(form);
initialValues.medications = [medicationTemplate];
initialValues.procedures = [];
initialValues.supportiveCare = [];
initialValues.otherProcedureSpecify = "";
initialValues.otherSupportiveCareSpecify = "";
export const SoapForm = () => {
  const { activeVisit, patientId }: { activeVisit: any; patientId: any } =
    getActivePatientDetails();
  const [otherFrequency, setOtherFrequency] = useState<{
    [key: number]: boolean;
  }>({});
  const handleUpdateFrequency = (index: number, value: boolean) => {
    setOtherFrequency((prevState) => ({
      ...prevState,
      [index]: value,
    }));
  };
  const {
    mutate,
    isPending: addingDrugs,
    isSuccess,
  } = fetchConceptAndCreateEncounter();
  const [formValues, setFormValues] = useState<any>({ medications: [] });
  const medicationOptions = [
    {
      id: "b8ba947e-8d80-11d8-abbb-0024217bb78e",
      label: "Paracetamol",
    },
    {
      id: "b8caf940-8d80-11d8-abbb-0024217bb78e",
      label: "Ibuprofen",
    },
    {
      id: "3a6cc329-12b9-4257-b80c-6de1fce95550",
      label: "Diclofenac sodium 75mg/ml, 3ml",
    },
    {
      id: "ad5768ae-7b63-425b-a9b6-f99b9a19a230",
      label: "Diclofenac sodium Slow Release",
    },
    {
      id: "b90fe5a0-8d80-11d8-abbb-0024217bb78e",
      label: "Diclofenac sodium",
    },
    {
      id: "b8c9affe-8d80-11d8-abbb-0024217bb78e",
      label: "Salbutamol",
    },
    {
      id: "a74b6c1a-6f4e-4ec3-b274-7f34f574843f",
      label: "Salbutamol sulphate",
    },
    {
      id: "f513a483-5afb-49bf-b29b-702ce3b9a202",
      label: "Salbutamol solution for nebulising 5mg/ml",
    },
    {
      id: "7dc1b649-eaac-4a52-aca6-68027838a553",
      label: "Salbutamol sulphate aerosol inhalation, 100mcg/dose, 200 doses",
    },
    {
      id: "b900b4cc-8d80-11d8-abbb-0024217bb78e",
      label: "Oxytocin",
    },
    {
      id: "684ac072-0186-4b9e-8232-a7aeadf7d8b5",
      label: "Dextrose 50%,",
    },
    {
      id: "b8ba92d0-8d80-11d8-abbb-0024217bb78e",
      label: "Aspirin",
    },
    {
      id: "b8c86e5a-8d80-11d8-abbb-0024217bb78e",
      label: "Prednisolone",
    },
    {
      id: "b8c3963c-8d80-11d8-abbb-0024217bb78e",
      label: "Diazepam",
    },
  ];
  const [showTextFields, setShowTextFields] = useState({
    otherProcedure: false,
    otherSupportiveCare: false,
  });
  const { navigateBack } = useNavigation();
  const { handleSubmit } = useSubmitEncounter(
    encounters.NURSING_CARE_NOTES,
    () => navigateBack()
  );

  const handleSubmitForm = (values: any) => {
    console.log("🚀 ~ handleSubmitForm ~ values:", values);
    submitMedications();
    submitProcedureSupportiveCares(values);
    handleSubmit(getObservations(values, getDateTime()));
  };
  const submitMedications = () => {
    const requiredFields = [
      "name",
      "formulation",
      "medication_dose",
      "medication_route",
      "medication_dose_unit",
      "medication_frequency",
      "medication_duration",
      "medication_duration_unit",
    ];

    const medications = formValues.medications.filter((med: any) =>
      requiredFields.every(
        (field) =>
          med[field] !== null && med[field] !== undefined && med[field] !== ""
      )
    );

    if (medications.length === 0) return;
    submitDispensedDrugs(medications);
    const obsDateTime = getDateTime();
    const obs = medications.map((medication: any) => {
      return {
        concept: concepts.DRUG_GIVEN,
        value: medication.name,
        obsDateTime,
        groupMembers: [
          {
            concept: concepts.MEDICATION_FORMULATION,
            value: medication.formulation,
            obsDateTime,
            coded: true,
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
            coded: true,
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
            value: "soapier",
            obsDateTime,
          },
        ],
      };
    });

    mutate({
      encounterType: encounters.PRESCRIPTIONS,
      visit: activeVisit,
      patient: patientId,
      encounterDatetime: obsDateTime,
      obs,
    });
    formValues.medications = [medicationTemplate];
  };
  const submitDispensedDrugs = (medications: any) => {
    const obsDateTime = getDateTime();
    const obs = medications.map((medication: any) => {
      return {
        concept: concepts.DRUG_GIVEN,
        value: medication.name,
        obsDateTime,
        groupMembers: [
          {
            concept: concepts.MEDICATION_DOSE,
            value: medication.medication_dose,
            obsDateTime,
          },
          {
            concept: concepts.MEDICATION_ROUTE,
            value: medication.medication_route,
            obsDatetime: getDateTime(),
          },
          {
            concept: concepts.DESCRIPTION,
            value: "soapier",
            obsDateTime,
          },
        ],
      };
    });
    const payload = {
      encounterType: encounters.DISPENSING,
      visit: activeVisit,
      patient: patientId,
      encounterDatetime: obsDateTime,
      obs,
    };

    mutate(payload);
  };
  const submitProcedureSupportiveCares = async (values: any) => {
    const currentDateTime = getDateTime();

    const obs = [
      {
        concept: concepts.PROCEDURES,
        value: concepts.PROCEDURES,
        obsDatetime: currentDateTime,
        group_members: (values.procedures || [])
          .filter((procedure: any) => procedure.value === true)
          .map((procedure: any) => ({
            concept: procedure.key,
            value:
              procedure.key === concepts.OTHER
                ? values.otherProcedureSpecify
                : procedure.key,
            obsDatetime: currentDateTime,
          })),
      },
      {
        concept: concepts.SUPPORTIVE_CARE,
        value: concepts.SUPPORTIVE_CARE,
        obsDatetime: currentDateTime,
        group_members: (values.supportiveCare || [])
          .filter((care: any) => care.value === true)
          .map((care: any) => ({
            concept: care.key,
            value:
              care.key === concepts.OTHER
                ? values.otherSupportiveCareSpecify
                : null,
            obsDatetime: currentDateTime,
          })),
      },
    ];

    mutate({
      encounterType: encounters.NURSING_CARE_NOTES,
      visit: activeVisit,
      patient: patientId,
      encounterDatetime: currentDateTime,
      obs,
    });
  };
  return (
    <>
      <ContainerLoaderOverlay loading={addingDrugs}>
        <FormikInit
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
          submitButton={false}
        >
          {({ values, setFieldValue }) => (
            <>
              <Box>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">{form.subjective.label}</Typography>
                  <TextInputField
                    label=""
                    name={form.subjective.name}
                    multiline
                    id={form.subjective.name}
                    rows={3}
                    sx={{ width: "100%", mt: 0 }}
                  />
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">Objective</Typography>
                  <div style={{ marginLeft: "50px" }}>
                    <Typography>{form.objective.label}</Typography>
                    <TextInputField
                      label=""
                      name={form.objective.name}
                      multiline
                      id={form.objective.name}
                      rows={3}
                      sx={{ width: "100%" }}
                    />
                    <Typography>Vital signs</Typography>
                    <FormFieldContainerMultiple>
                      <TextInputField
                        name={form.spo.name}
                        label={form.spo.label}
                        id={form.spo.name}
                        sx={{ width: "100%" }}
                        unitOfMeasure="%"
                      />

                      <TextInputField
                        name={form.systolic.name}
                        label={form.systolic.label}
                        id={form.systolic.name}
                        sx={{ width: "100%" }}
                        unitOfMeasure="mmHg"
                      />
                      <TextInputField
                        name={form.diastolic.name}
                        label={form.diastolic.label}
                        id={form.diastolic.name}
                        sx={{ width: "100%" }}
                        unitOfMeasure="mmHg"
                      />
                      <TextInputField
                        name={form.respiratoryRate.name}
                        label={form.respiratoryRate.label}
                        id={form.respiratoryRate.name}
                        sx={{ width: "100%" }}
                        unitOfMeasure="BPM"
                      />
                      <TextInputField
                        name={form.pulseRate.name}
                        label={form.pulseRate.label}
                        id={form.pulseRate.name}
                        sx={{ width: "100%" }}
                        unitOfMeasure="BPM"
                      />
                      <TextInputField
                        name={form.temperature.name}
                        label={form.temperature.label}
                        id={form.temperature.name}
                        sx={{ width: "100%" }}
                        unitOfMeasure="°C"
                      />
                    </FormFieldContainerMultiple>
                    <Typography>Bed side investigations</Typography>
                    <FormFieldContainerMultiple>
                      <TextInputField
                        id={form.MRDT.name}
                        name={form.MRDT.name}
                        label={form.MRDT.label}
                      />
                      <TextInputField
                        id={form.RBG.name}
                        name={form.RBG.name}
                        label={form.RBG.label}
                      />
                      <TextInputField
                        id={form.PT.name}
                        name={form.PT.name}
                        label={form.PT.label}
                      />

                      <TextInputField
                        id={form.urineDipstick.name}
                        name={form.urineDipstick.name}
                        label={form.urineDipstick.label}
                      />
                    </FormFieldContainerMultiple>
                  </div>
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">{form.assessment.label}</Typography>
                  <TextInputField
                    label=""
                    name={form.assessment.name}
                    multiline
                    id={form.assessment.name}
                    rows={3}
                    sx={{ width: "100%" }}
                  />
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">{form.plan.label}</Typography>
                  <TextInputField
                    label=""
                    name={form.plan.name}
                    multiline
                    id={form.plan.name}
                    rows={3}
                    sx={{ width: "100%" }}
                  />
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Intervention
                  </Typography>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {" "}
                    Non-pharmacological management{" "}
                  </span>

                  <div style={{ maxWidth: "900px" }}>
                    <FormFieldContainer direction="row">
                      <WrapperBox
                        sx={{
                          bgcolor: "white",
                          padding: "0.5ch",
                          mb: "2ch",
                          width: "90%",
                        }}
                      >
                        <h4>Procedures</h4>
                        <CheckboxesGroup
                          name="procedures"
                          allowFilter={false}
                          options={proceduresConfig}
                          getValue={(values) =>
                            setShowTextFields((prev) => ({
                              ...prev,
                              otherProcedure: values.some(
                                (val: any) =>
                                  val.key === concepts.OTHER && val.value
                              ),
                            }))
                          }
                        />
                        {showTextFields.otherProcedure && (
                          <TextInputField
                            id="otherProcedureSpecify"
                            label="Specify Other Procedure"
                            name="otherProcedureSpecify"
                            placeholder="Specify the procedure"
                          />
                        )}
                      </WrapperBox>
                      <WrapperBox
                        sx={{
                          bgcolor: "white",
                          padding: "2ch",
                          mb: "2ch",
                          width: "90%",
                        }}
                      >
                        <h4>Supportive Care</h4>
                        <CheckboxesGroup
                          name="supportiveCare"
                          allowFilter={false}
                          options={supportiveCareConfig}
                          getValue={(values) =>
                            setShowTextFields((prev) => ({
                              ...prev,
                              otherSupportiveCare: values.some(
                                (val: any) =>
                                  val.key === concepts.OTHER && val.value
                              ),
                            }))
                          }
                        />
                        {showTextFields.otherSupportiveCare && (
                          <TextInputField
                            id="otherSupportiveCareSpecify"
                            label="Specify Other Supportive Care"
                            name="otherSupportiveCareSpecify"
                            placeholder="Specify the care"
                          />
                        )}
                      </WrapperBox>
                    </FormFieldContainer>
                  </div>

                  <h4 style={{ marginBottom: "1ch" }}>
                    Pharmacological management
                  </h4>
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
                              width: "100%",
                            }}
                          >
                            <SearchComboBox
                              name={`medications[${index}].name`}
                              label="Medication Name"
                              options={medicationOptions}
                              getValue={(value) =>
                                setFieldValue(
                                  `medications[${index}].name`,
                                  value
                                )
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
                            {formValues?.medications[index]
                              ?.medication_frequency != "STAT" && (
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

                            <TextField
                              id={`medications[${index}].medication_route`}
                              name={`medications[${index}].medication_route`}
                              label="Route"
                              fullWidth
                              variant="outlined"
                            />
                          </Box>
                        )}
                      />
                    )}
                  </FieldArray>
                  <br />
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">{form.evaluation.label}</Typography>
                  <TextInputField
                    label=""
                    name={form.evaluation.name}
                    multiline
                    id={form.evaluation.name}
                    rows={3}
                    sx={{ width: "100%" }}
                  />
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">{form.replan.label}</Typography>
                  <TextInputField
                    label=""
                    name={form.replan.name}
                    multiline
                    id={form.replan.name}
                    rows={3}
                    sx={{ width: "100%" }}
                  />
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">
                    {form.implementation.label}
                  </Typography>
                  <TextInputField
                    label=""
                    name={form.implementation.name}
                    multiline
                    id={form.implementation.name}
                    rows={3}
                    sx={{ width: "100%" }}
                  />
                </Paper>

                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </>
          )}
        </FormikInit>
      </ContainerLoaderOverlay>
    </>
  );
};
