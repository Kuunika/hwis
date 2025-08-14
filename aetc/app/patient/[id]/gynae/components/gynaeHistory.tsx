"use client";

import {
  FormikInit,
  FormFieldContainerLayout,
  FieldsContainer,
  RadioGroupInput,
  TextInputField,
  FormValuesListener,
  WrapperBox,
  DatePickerInput,
  FormDatePicker,
} from "@/components";
import * as Yup from "yup";
import { useState } from "react";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { DateCalendar, DateField } from "@mui/x-date-pickers";

// Types
type PregnancyAdditionalHistoryFormValues = {
  pidHistory: string;
  specifySti: string;
  previousPelvicSurgery: string;
  contraceptiveHistory: string;
  cervicalCancerDate: string;
  cervicalCancerResult: string;
  obstetricHistory: string;
  medicalHistory: string;
  surgicalHistory: string;
  drugHistory: string;
  allergies: string;
  familyHistory: string;
};

// Form field configs
const form = {
  pidHistory: { name: "pidHistory", label: "PID/STI History" },
  specifySti: { name: "specifySti", label: "If yes, specify which STI" },
  previousPelvicSurgery: {
    name: "previousPelvicSurgery",
    label: "Previous Pelvic Surgery?",
  },
  contraceptiveHistory: {
    name: "contraceptiveHistory",
    label: "Contraceptive History",
  },
  cervicalCancerDate: {
    name: "cervicalCancerDate",
    label: "Date of Last Cervical Cancer Screening",
  },
  cervicalCancerResult: { name: "cervicalCancerResult", label: "Result" },
  obstetricHistory: {
    name: "obstetricHistory",
    label: "Brief Obstetric History",
  },
  medicalHistory: { name: "medicalHistory", label: "Medical History" },
  surgicalHistory: { name: "surgicalHistory", label: "Surgical History" },
  drugHistory: { name: "drugHistory", label: "Drug History" },
  allergies: { name: "allergies", label: "Allergies" },
  familyHistory: { name: "familyHistory", label: "Family History" },
};

// Yes/No options
const yesNoOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const schema = Yup.object().shape({
  [form.pidHistory.name]: Yup.string().required("Required"),
  //[form.specifySti.name]: Yup.string().when(form.pidHistory.name, {
  // is: "Yes",
  // then: Yup.string().required("Specify STI"),
  // }),
  [form.previousPelvicSurgery.name]: Yup.string().required("Required"),
  [form.contraceptiveHistory.name]: Yup.string().required("Required"),
  [form.cervicalCancerDate.name]: Yup.string().required("Required"),
  [form.cervicalCancerResult.name]: Yup.string().required("Required"),
  [form.obstetricHistory.name]: Yup.string().required("Required"),
  [form.medicalHistory.name]: Yup.string().required("Required"),
  [form.surgicalHistory.name]: Yup.string().required("Required"),
  [form.drugHistory.name]: Yup.string().required("Required"),
  [form.allergies.name]: Yup.string().required("Required"),
  [form.familyHistory.name]: Yup.string().required("Required"),
});

// Main component
const PregnancyAdditionalHistoryForm = ({
  onSubmit,
}: {
  onSubmit: (values: PregnancyAdditionalHistoryFormValues) => void;
}) => {
  const initialValues: PregnancyAdditionalHistoryFormValues = {
    pidHistory: "",
    specifySti: "",
    previousPelvicSurgery: "",
    contraceptiveHistory: "",
    cervicalCancerDate: "",
    cervicalCancerResult: "",
    obstetricHistory: "",
    medicalHistory: "",
    surgicalHistory: "",
    drugHistory: "",
    allergies: "",
    familyHistory: "",
  };

  const [formValues, setFormValues] =
    useState<PregnancyAdditionalHistoryFormValues>(initialValues);

  const handleFromSubmission = () => {};

  return (
    // <WrapperBox
    //   sx={{
    //     display: "flex",
    //     justifyContent: "end",
    //     flexDirection: "column",
    //     alignItems: "center",
    //     borderRadius: "1ch",
    //     marginTop: "20px",
    //     position: "relative", //added
    //   }}
    // >
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleFromSubmission}
      submitButtonText="Next"
    >
      <FormValuesListener getValues={setFormValues} />
      <FieldsContainer sx={{ alignItems: "flex" }}>
        <RadioGroupInput
          name={form.pidHistory.name}
          label={form.pidHistory.label}
          options={yesNoOptions}
        />
      </FieldsContainer>

      {formValues.pidHistory === "Yes" && (
        <TextInputField
          multiline
          rows={3}
          sx={{ m: 0, width: "100%" }}
          name={form.specifySti.name}
          label={form.specifySti.label}
          id={""}
        />
      )}
      <br />
      <TextInputField
        multiline
        rows={3}
        sx={{ m: 0, width: "100%" }}
        name={form.previousPelvicSurgery.name}
        label={form.previousPelvicSurgery.label}
        id={""}
      />
      <br />
      <br />
      <TextInputField
        multiline
        rows={3}
        sx={{ m: 0, width: "100%" }}
        name={form.contraceptiveHistory.name}
        label={form.contraceptiveHistory.label}
        id={""}
      />

      <br />

      <FormDatePicker
        name={"cervicalCancerDate"}
        label={"Date of Last Cervical Cancer Screening"}
      />

      <br />

      <TextInputField
        multiline
        rows={3}
        sx={{ m: 0, width: "100%" }}
        name={form.cervicalCancerResult.name}
        label={form.cervicalCancerResult.label}
        id={""}
      />

      <br />
      <TextInputField
        multiline
        rows={3}
        sx={{ m: 0, width: "100%" }}
        name={form.obstetricHistory.name}
        label={form.obstetricHistory.label}
        id={""}
      />
      <br />
      <TextInputField
        multiline
        rows={3}
        sx={{ m: 0, width: "100%" }}
        name={form.medicalHistory.name}
        label={form.medicalHistory.label}
        id={""}
      />
      <br />
      <TextInputField
        multiline
        rows={3}
        sx={{ m: 0, width: "100%" }}
        name={form.surgicalHistory.name}
        label={form.surgicalHistory.label}
        id={""}
      />
      <br />
      <TextInputField
        multiline
        rows={3}
        sx={{ m: 0, width: "100%" }}
        name={form.drugHistory.name}
        label={form.drugHistory.label}
        id={""}
      />
      <br />
      <TextInputField
        multiline
        rows={2}
        sx={{ m: 0, width: "100%" }}
        name={form.allergies.name}
        label={form.allergies.label}
        id={""}
      />
      <br />
      <TextInputField
        multiline
        rows={3}
        sx={{ m: 0, width: "100%" }}
        name={form.familyHistory.name}
        label={form.familyHistory.label}
        id={""}
      />
    </FormikInit>
    //</WrapperBox>
  );
};

export default PregnancyAdditionalHistoryForm;
