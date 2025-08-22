"use client";

import {
  FormikInit,
  FormFieldContainerLayout,
  FieldsContainer,
  RadioGroupInput,
  TextInputField,
  FormValuesListener,
  WrapperBox,
} from "@/components";
import * as Yup from "yup";
import { useState } from "react";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";

const radioOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

interface PregnancyHistoryFormProps {
  onSubmit: (values: any) => void;
  initialValues?: Record<string, any>;
}
const form = {
  pvBleeding: { name: "pvBleeding", label: "PV Bleeding?" },
  pvBleedingFeatures: {
    name: "pvBleedingFeatures",
    label: "Features and Severity",
  },

  duration: { name: "duration", label: "Duration" },
  foulSmelling: { name: "foulSmelling", label: "Foul Smelling?" },
  shoulderTipPain: { name: "shoulderTipPain", label: "Shoulder Tip Pain?" },
  anaemiaSymptoms: { name: "anaemiaSymptoms", label: "Anaemia Symptoms?" },
  collapseHistory: { name: "collapseHistory", label: "Collapse History?" },
  productsOfConception: {
    name: "productsOfConception",
    label: "Products of Conception?",
  },
  inducedAbortionHistory: {
    name: "inducedAbortionHistory",
    label: "History of Induced Abortion?",
  },
  specifyAbortionHistory: {
    name: "specifyAbortionHistory",
    label: "If yes, briefly explain ",
  },

  abdominalPain: { name: "abdominalPain", label: "Abdominal Pain?" },
  abdominalPainFeatures: {
    name: "abdominalPainFeatures",
    label: "Features and Severity",
  },

  urinarySymptoms: { name: "urinarySymptoms", label: "Urinary Symptoms?" },
  urinaryFeatures: { name: "urinaryFeatures", label: "Features" },
  distension: { name: "distension", label: "Distension?" },

  nauseaVomiting: { name: "nauseaVomiting", label: "Nausea & Vomiting?" },
  nauseaFeatures: { name: "nauseaFeatures", label: "Features and Severity" },

  fevers: { name: "fevers", label: "Fevers?" },
  feverDuration: { name: "feverDuration", label: "Duration" },

  otherSymptoms: {
    name: "otherSymptoms",
    label: "Other Symptoms / Relevant History",
  },
};

const schema = Yup.object().shape({
  [form.pvBleeding.name]: Yup.string().required("Required"),
  [form.pvBleedingFeatures.name]: Yup.string().required("Required"),

  [form.duration.name]: Yup.string().required("Required"),
  [form.foulSmelling.name]: Yup.string().required("Required"),
  [form.shoulderTipPain.name]: Yup.string().required("Required"),
  [form.anaemiaSymptoms.name]: Yup.string().required("Required"),
  [form.collapseHistory.name]: Yup.string().required("Required"),
  [form.productsOfConception.name]: Yup.string().required("Required"),
  [form.inducedAbortionHistory.name]: Yup.string().required("Required"),
  [form.specifyAbortionHistory.name]: Yup.string().required("Required"),

  [form.abdominalPain.name]: Yup.string().required("Required"),
  [form.abdominalPainFeatures.name]: Yup.string().required("Required"),

  [form.urinarySymptoms.name]: Yup.string().required("Required"),
  [form.urinaryFeatures.name]: Yup.string().required("Required"),
  [form.distension.name]: Yup.string().required("Required"),

  [form.nauseaVomiting.name]: Yup.string().required("Required"),
  [form.nauseaFeatures.name]: Yup.string().required("Required"),

  [form.fevers.name]: Yup.string().required("Required"),
  [form.feverDuration.name]: Yup.string().required("Required"),

  [form.otherSymptoms.name]: Yup.string().required("Required"),
});

const defaultInitialValues = Object.keys(form).reduce((acc, key) => {
  acc[key] = "";
  return acc;
}, {} as Record<string,any>);

const PregnancyHistoryForm: React.FC<PregnancyHistoryFormProps> = ({
  onSubmit,initialValues: prefill,
}) => {
  type formValuesType = typeof defaultInitialValues; //added
  const [formValues, setFormValues] = useState<formValuesType>({ ...defaultInitialValues,...(prefill || {})});

  const handleFromSubmission = (values: any) => {
    console.log("Pregnancy History Form submitted:", values);
    onSubmit = values;
  };

  return (
    <WrapperBox
      sx={{
        display: "flex",
        justifyContent: "start",
        flexDirection: "column",
        alignItems: "start",
        borderRadius: "1ch",
        marginTop: "20px",
        position: "relative", //added
      }}
    >
      <FormikInit
        initialValues={{...defaultInitialValues, ...(prefill || {})}}
        validationSchema={schema}
        onSubmit={handleFromSubmission}
        submitButtonText="Next"
      >
        <FormValuesListener getValues={setFormValues} />

        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.pvBleeding.name}
            label={form.pvBleeding.label}
            options={radioOptions}
          />
        </FieldsContainer>

        {formValues[form.pvBleeding.name] === "yes" && (
          <FieldsContainer sx={{ alignItems: "flex-start" }}>
            <TextInputField
              multiline
              rows={3}
              sx={{ m: 0, width: "100%" }}
              name={form.pvBleedingFeatures.name}
              label={form.pvBleedingFeatures.label}
              id={""}
            />
          </FieldsContainer>
        )}

        <br />
        <FieldsContainer sx={{ gap: 10, alignItems: "flex-start" }}>
          <TextInputField
            multiline
            rows={3}
            sx={{ m: 0, width: "100%" }}
            name={form.duration.name}
            label={form.duration.label}
            id={""}
          />
        </FieldsContainer>

        <br />
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.foulSmelling.name}
            label={form.foulSmelling.label}
            options={radioOptions}
          />
          <RadioGroupInput
            name={form.shoulderTipPain.name}
            label={form.shoulderTipPain.label}
            options={radioOptions}
          />
        </FieldsContainer>

        <br />
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.anaemiaSymptoms.name}
            label={form.anaemiaSymptoms.label}
            options={radioOptions}
          />
          <RadioGroupInput
            name={form.collapseHistory.name}
            label={form.collapseHistory.label}
            options={radioOptions}
          />
        </FieldsContainer>

        <br />
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.productsOfConception.name}
            label={form.productsOfConception.label}
            options={radioOptions}
          />
          <RadioGroupInput
            name={form.inducedAbortionHistory.name}
            label={form.inducedAbortionHistory.label}
            options={radioOptions}
          />
        </FieldsContainer>

        {formValues[form.inducedAbortionHistory.name] === "yes" && (
          <TextInputField
            multiline
            rows={3}
            sx={{ m: 0, width: "100%" }}
            name={form.specifyAbortionHistory.name}
            label={form.specifyAbortionHistory.label}
            id={""}
          />
        )}
        <br />
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.abdominalPain.name}
            label={form.abdominalPain.label}
            options={radioOptions}
          />
        </FieldsContainer>

        {formValues[form.abdominalPain.name] === "yes" && (
          <FieldsContainer sx={{ alignItems: "flex-start" }}>
            <TextInputField
              multiline
              rows={3}
              sx={{ m: 0, width: "100%" }}
              name={form.abdominalPainFeatures.name}
              label={form.abdominalPainFeatures.label}
              id=""
            />
          </FieldsContainer>
        )}

        <br />
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.distension.name}
            label={form.distension.label}
            options={radioOptions}
          />
          <RadioGroupInput
            name={form.urinarySymptoms.name}
            label={form.urinarySymptoms.label}
            options={radioOptions}
          />
        </FieldsContainer>

        {formValues[form.urinarySymptoms.name] === "yes" && (
          <FieldsContainer sx={{ alignItems: "flex-start" }}>
            <TextInputField
              multiline
              rows={3}
              sx={{ m: 0, width: "100%" }}
              name={form.urinaryFeatures.name}
              label={form.urinaryFeatures.label}
              id={""}
            />
          </FieldsContainer>
        )}
        <br />
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.nauseaVomiting.name}
            label={form.nauseaVomiting.label}
            options={radioOptions}
          />
        </FieldsContainer>

        {formValues[form.nauseaVomiting.name] === "yes" && (
          <FieldsContainer sx={{ alignItems: "flex-start" }}>
            <TextInputField
              multiline
              rows={3}
              sx={{ m: 0, width: "100%" }}
              name={form.nauseaFeatures.name}
              label={form.nauseaFeatures.label}
              id={""}
            />
          </FieldsContainer>
        )}

        <br />
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.fevers.name}
            label={form.fevers.label}
            options={radioOptions}
          />
        </FieldsContainer>

        {formValues[form.fevers.name] === "yes" && (
          <FieldsContainer sx={{ alignItems: "flex-start" }}>
            <TextInputField
              multiline
              rows={3}
              sx={{ m: 0, width: "100%" }}
              name={form.feverDuration.name}
              label={form.feverDuration.label}
              id={""}
            />
          </FieldsContainer>
        )}
        <br />
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <TextInputField
            name={form.otherSymptoms.name}
            label={form.otherSymptoms.label}
            multiline
            rows={3}
            id={""}
            sx={{ m: 0, width: "100%" }}
          />
        </FieldsContainer>
      </FormikInit>
    </WrapperBox>
  );
};

export default PregnancyHistoryForm;
