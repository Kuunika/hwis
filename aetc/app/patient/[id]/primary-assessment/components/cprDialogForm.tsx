import {
  FieldsContainer,
  FormFieldContainerMultiple,
  FormikInit,
  GenericDialog,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
  UnitInputField,
} from "@/components";
import DynamicFormList from "@/components/form/dynamicFormList";
import { concepts, NO, YES } from "@/constants";
import { getInitialValues } from "@/helpers";
import useFetchMedications from "@/hooks/useFetchMedications";
import { getAllUsers } from "@/hooks/users";
import { Box, Typography } from "@mui/material";
import { FieldArray } from "formik";
import { useState } from "react";
import { GiMedicines } from "react-icons/gi";
import * as Yup from "yup";

const form = {
  cardiacArrest: {
    name: concepts.CARDIAC_ARREST,
    label: "Witnessed Cardiac Arrest",
  },
  site: {
    name: concepts.SITE,
    label: "SITE",
  },
  specify: {
    name: concepts.OTHER,
    label: "Specify",
  },
  reversibleCauses: {
    name: concepts.REVERSIBLE_CAUSES,
    label: "Reversible Causes",
  },
  reasonsCprStopped: {
    name: concepts.REASON_CPR_STOPPED,
    label: "Reason CPR Stopped",
  },
  otherReason: {
    name: concepts.OTHER,
    label: "Other Reason",
  },
  dispositionAfterCpr: {
    name: concepts.DISPOSITION_AFTER_CPR,
    label: "Disposition After CPR",
  },
  spo: {
    name: concepts.SPO2,
    label: "SPO2",
  },
  oxygen: {
    name: concepts.OXYGEN_GIVEN,
    label: "Oxygen",
  },
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate",
  },
  systolic: {
    name: concepts.BLOOD_PRESSURE_SYSTOLIC,
    label: "Systolic",
  },
  diastolic: {
    name: concepts.BLOOD_PRESSURE_DIASTOLIC,
    label: "Diastolic",
  },
  gcs: {
    name: concepts.GCS,
    label: "Glasgow Coma Scale",
  },
  pulseRate: {
    name: concepts.PULSE_RATE,
    label: "Pulse Rate",
  },
  temperature: {
    name: concepts.TEMPERATURE,
    label: "Temperature",
  },
  motorResponse: {
    name: concepts.MOTOR_RESPONSE,
    label: "Motor Response",
  },
  eyeOpeningResponse: {
    name: concepts.EYE_OPENING_RESPONSE,
    label: "Eye Opening Response",
  },
  verbalResponse: {
    name: concepts.VERBAL_RESPONSE,
    label: "Verbal Response",
  },
  teamLeader: {
    name: concepts.TEAM_LEADER,
    label: "Team Leader",
  },
  teamMembers: {
    name: concepts.TEAM_MEMBERS,
    label: "Team Members",
  },
};

const initialValues = getInitialValues(form);

const validationSchema = Yup.object().shape({
  [form.cardiacArrest.name]: Yup.string()
    .required()
    .label(form.cardiacArrest.label),
  [form.site.name]: Yup.string().required().label(form.site.label),
  [form.specify.name]: Yup.string().when(form.site.name, {
    is: (value: any) => value === concepts.OTHER,
    then: (schema) => schema.required().label(form.specify.label),
  }),
  records: Yup.array().of(
    Yup.object().shape({
      rhythm: Yup.string().required("Required"),
      shockEnergy: Yup.string().required("Required"),
      medication: Yup.string().required("Required"),
      dose: Yup.string().required("Required"),
      route: Yup.string().required("Required"),
      Interventions: Yup.string().required("Required"),
      occurrences: Yup.string().required("Required"),
    })
  ),
  [form.reversibleCauses.name]: Yup.array()
    .required()
    .label(form.reversibleCauses.label),
  [form.reasonsCprStopped.name]: Yup.string()
    .required()
    .label(form.reasonsCprStopped.label),
  [form.otherReason.name]: Yup.string()
    .when(form.reasonsCprStopped.name, {
      is: (value: any) => value === concepts.OTHER,
      then: (schema) => schema.required().label(form.otherReason.label),
    })
    .label(form.otherReason.label),
  [form.dispositionAfterCpr.name]: Yup.string()
    .required()
    .label(form.dispositionAfterCpr.label),
  [form.spo.name]: Yup.number()
    .min(0)
    .max(100)
    .required()
    .label(form.spo.label),
  [form.oxygen.name]: Yup.string().required().label(form.oxygen.label),
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
  [form.gcs.name]: Yup.string().required().label(form.gcs.label),
  [form.temperature.name]: Yup.number()
    .min(20)
    .max(45)
    .required()
    .label(form.temperature.label),
  [form.pulseRate.name]: Yup.number()
    .min(60)
    .max(100)
    .label(form.pulseRate.label),
  [form.eyeOpeningResponse.name]: Yup.string()
    .required()
    .label(form.eyeOpeningResponse.label),
  [form.motorResponse.name]: Yup.string()
    .required()
    .label(form.motorResponse.label),
  [form.verbalResponse.name]: Yup.string()
    .required()
    .label(form.verbalResponse.label),
  [form.teamLeader.name]: Yup.string().required().label(form.teamLeader.label),
  [form.teamMembers.name]: Yup.array().required().label(form.teamMembers.label),
});

const sites = [
  { label: "Rescitation", value: concepts.RESCITATION },
  { label: "SSW", value: concepts.SSW },
  { label: "Priority", value: concepts.PRIORITY },
  { label: "Other", value: concepts.OTHER },
];
const rhythmOptions = [
  { label: "PEA", id: concepts.PEA },
  { label: "VF", id: concepts.VF },
  { label: "VT", id: concepts.VT },
  { label: "Asys", id: concepts.ASYS },
];

const reversibleCauses = [
  { label: "Hypoxia", id: concepts.HYPOXIA },
  { label: "Hypovolemia", id: concepts.HYPOVOLEMIA },
  { label: "Hyperkalaemia", id: concepts.HYPERKALAEMIA },
  { label: "Hypokalaemia", id: concepts.HYPOKALAEMIA },
  { label: "Hypothermia", id: concepts.HYPOTHERMIA },
  { label: "Tension Pneumothorax", id: concepts.TENSION_PNEUMOTHORAX },
  { label: "Tamponade, Cadiac", id: concepts.TAMPONADE_CADIAC },
  { label: "Toxins", id: concepts.TOXINS },
  { label: "Thrombosis, Pulmonary", id: concepts.THROMBOSIS_PULMONARY },
  { label: "Thrombosis, Coronary", id: concepts.THROMBOSIS_CORONARY },
  { label: "Hydrogen Ions (Acidosis)", id: concepts.HYDROGEN_ION_ACIDOSIS },
];

const reasonsCprStopped = [
  { label: "ROSC", id: concepts.ROSC },
  { label: "Team decision to stop", id: concepts.TEAM_DECISION_TO_STOP },
  { label: "DNA CPR document found", id: concepts.DNA_CPR_DOCUMENT_FOUND },
  { label: "Other", id: concepts.OTHER },
];

const dispositionAfterCpr = [
  { label: "Resuscitation room", id: concepts.RESUSCITATION_ROOM },
  { label: "ICU", id: concepts.ICU },
  { label: "HDU Specify", id: concepts.HDU_SPECIFY },
  { label: "General Ward Specify", id: concepts.GENERAL_WARD_SPECIFY },
  { label: "Mortuary", id: concepts.MORTUARY },
];

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];
const emptyRecord = {
  rhythm: "",
  shockEnergy: "",
  medication: "",
  dose: "",
  route: "",
  Interventions: "",
  occurrences: "",
};
const medicationUnits = [
  "Milligrams (mg)",
  "Micrograms (µg)",
  "Grams (g)",
  "International Units (IU)",
  "Milliliters (ml)",
  "Millimoles (mmol)",
];
const interventions = [
  { label: "IV Access", id: concepts.IV_ACCESS },
  { label: "Intubation", id: concepts.INTUBATION },
  { label: "POCUS", id: concepts.POCUS },
  { label: "ABG", id: concepts.ABG },
];
const eyeOpeningResponses = [
  { label: "Spontaneous", value: "Spontaneous", weight: 4 },
  { label: "To Speech", value: "To Speech", weight: 3 },
  { label: "To Pain", value: "To Pain", weight: 2 },
  { label: "No Response", value: "No Response", weight: 1 },
];
const motorResponses = [
  { label: "Obeying Commands", value: "Obeying Commands", weight: 6 },
  { label: "Localising", value: "Localising", weight: 5 },
  { label: "Withdraw", value: "Withdraw", weight: 4 },
  { label: "Normal Flexion", value: "Normal Flexion", weight: 3 },
  { label: "Extension", value: "Extension", weight: 2 },
  { label: "None", value: "None", weight: 1 },
];
const verbalResponses = [
  { label: "Oriented", value: "Oriented", weight: 5 },
  { label: "Confused", value: "Confused", weight: 4 },
  { label: "Inappropriate Words", value: "Inappropriate Words", weight: 3 },
  {
    label: "Incomprehensible sounds",
    value: "Incomprehensible sounds",
    weight: 2,
  },
  { label: "None", value: "None", weight: 1 },
];

const CPRForm = () => {
  const { medicationOptions } = useFetchMedications();
  const { data: users, isLoading } = getAllUsers();

  const userOptions = users?.map((user) => {
    return {
      label:
        user.person.names[0].family_name +
        " " +
        user.person.names[0].given_name,
      id: user.uuid,
    };
  });

  const getWeight = (value: string, lists: any) => {
    const found = lists.find((l: any) => l.value == value);
    return found ? found.weight : 0;
  };

  return (
    <FormikInit
      onSubmit={() => {}}
      initialValues={{ ...initialValues, records: [emptyRecord] }}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue }) => (
        <>
          <FormFieldContainerMultiple>
            <RadioGroupInput
              options={radioOptions}
              label={form.cardiacArrest.label}
              name={form.cardiacArrest.name}
              //   sx={{ width: "1ch", backgroundColor: "red" }}
              row
            />
            <RadioGroupInput
              //   sx={{ backgroundColor: "red" }}
              name={form.site.name}
              label={form.site.label}
              options={sites}
              row
            />
          </FormFieldContainerMultiple>
          {values[form.site.name] == concepts.OTHER && (
            <TextInputField
              size="small"
              name={form.specify.name}
              label={form.specify.label}
              id={form.specify.name}
              sx={{ width: "100%" }}
            />
          )}
          <FieldArray name="records">
            {({}) => (
              <DynamicFormList
                items={values.records}
                setItems={(newItems) => setFieldValue("records", newItems)}
                newItem={emptyRecord}
                itemsProps={{
                  flexDirection: "column",
                  gap: 0,
                  alignItems: "start",
                  borderBottom: "1px solid #ccc",
                  pb: "1ch",
                }}
                renderFields={(item, index) => (
                  <>
                    <br />
                    <Typography color={"#333"} variant="h6">
                      Record {index + 1}
                    </Typography>
                    <br />
                    <FieldsContainer sx={{ width: "100%" }} mr="1ch">
                      <SearchComboBox
                        name={`records.${index}.rhythm`}
                        label="Rhythm"
                        options={rhythmOptions}
                        size="small"
                        sx={{ width: "100%" }}
                      />
                      <TextInputField
                        name={`records.${index}.shockEnergy`}
                        label="Shock Energy"
                        id={`records.${index}.shockEnergy`}
                        sx={{ width: "100%" }}
                      />
                    </FieldsContainer>
                    <br />
                    <FormFieldContainerMultiple>
                      <SearchComboBox
                        name={`records[${index}].medication`}
                        label="Medication Name"
                        options={medicationOptions}
                        getValue={(value) =>
                          setFieldValue(`records[${index}].medication`, value)
                        }
                        multiple={false}
                      />
                      <UnitInputField
                        id={`medications[${index}].medication_dose`}
                        label="Dose"
                        name={`medications[${index}].medication_dose`}
                        unitName={`medications[${index}].medication_dose_unit`}
                        unitOptions={medicationUnits}
                        placeholder="e.g., 500"
                        sx={{ m: 0 }}
                        inputIcon={<GiMedicines />}
                      />
                      <TextInputField
                        name={`records[${index}].route`}
                        label="Route"
                        id={`records[${index}].route`}
                        sx={{ width: "100%" }}
                      />
                    </FormFieldContainerMultiple>
                    <br />
                    <FormFieldContainerMultiple>
                      <Box>
                        <SearchComboBox
                          name={`records[${index}].Interventions`}
                          label="Interventions"
                          options={interventions}
                          sx={{ width: "100%" }}
                        />
                      </Box>
                      <TextInputField
                        name={`records[${index}].occurrences`}
                        label="Occurrences"
                        id={`records[${index}].occurrences`}
                        sx={{ width: "100%" }}
                      />
                    </FormFieldContainerMultiple>
                  </>
                )}
              ></DynamicFormList>
            )}
          </FieldArray>
          <br />
          <br />
          <FormFieldContainerMultiple>
            <SearchComboBox
              name={form.reversibleCauses.name}
              label={form.reversibleCauses.label}
              options={reversibleCauses}
              multiple
            />
            <SearchComboBox
              name={form.reasonsCprStopped.name}
              label={form.reasonsCprStopped.label}
              options={reasonsCprStopped}
              multiple={false}
            />
            <SearchComboBox
              name={form.dispositionAfterCpr.name}
              label={form.dispositionAfterCpr.label}
              options={dispositionAfterCpr}
              multiple={false}
            />
          </FormFieldContainerMultiple>
          <br />
          <Typography variant="h6">Vital signs after ROSC</Typography>
          <br />

          <FormFieldContainerMultiple>
            <TextInputField
              name={form.spo.name}
              label={form.spo.label}
              id={form.spo.name}
              sx={{ width: "100%" }}
              unitOfMeasure="%"
            />

            <RadioGroupInput
              name={form.oxygen.name}
              label={form.oxygen.label}
              options={radioOptions}
              row
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
          </FormFieldContainerMultiple>
          <FormFieldContainerMultiple>
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
          <br />

          <FieldsContainer sx={{ alignItems: "start" }}>
            <RadioGroupInput
              name={form.motorResponse.name}
              label={form.motorResponse.label}
              options={motorResponses}
              row={false}
            />
            <RadioGroupInput
              name={form.verbalResponse.name}
              label={form.verbalResponse.label}
              options={verbalResponses}
              row={false}
            />
            <RadioGroupInput
              name={form.eyeOpeningResponse.name}
              label={form.eyeOpeningResponse.label}
              options={eyeOpeningResponses}
              row={false}
            />
          </FieldsContainer>
          <Typography fontWeight={"800"} variant="body2">
            (M
            {getWeight(values[form.motorResponse.name], motorResponses)} V
            {getWeight(values[form.verbalResponse.name], verbalResponses)} E
            {getWeight(
              values[form.eyeOpeningResponse.name],
              eyeOpeningResponses
            )}
            ){" "}
            {getWeight(values[form.motorResponse.name], motorResponses) +
              getWeight(values[form.verbalResponse.name], verbalResponses) +
              getWeight(
                values[form.eyeOpeningResponse.name],
                eyeOpeningResponses
              )}
            /15
          </Typography>
          <br />
          <Typography variant="h6">Resuscitation Team</Typography>
          <br />
          <SearchComboBox
            name={form.teamLeader.name}
            label={form.teamLeader.label}
            options={userOptions ?? []}
            multiple={false}
          />
          <br />
          <SearchComboBox
            name={form.teamMembers.name}
            label={form.teamMembers.label}
            options={userOptions ?? []}
          />
        </>
      )}
    </FormikInit>
  );
};

export const CPRDialogForm = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <GenericDialog maxWidth="md" open={open} title="CPR" onClose={onClose}>
      <CPRForm />
    </GenericDialog>
  );
};
