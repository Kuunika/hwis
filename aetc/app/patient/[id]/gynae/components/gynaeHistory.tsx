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


interface PregnancyAdditionalHistoryFormProps {
  onSubmit: (values: any) => void;
  initialValues?: Record<string, any>;

}
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
const PregnancyAdditionalHistoryForm: React.FC<PregnancyAdditionalHistoryFormProps> = ({ onSubmit, initialValues: prefill, }) => {

  const defaultInitialValues: PregnancyAdditionalHistoryFormValues = {
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
    useState<PregnancyAdditionalHistoryFormValues>({...defaultInitialValues,...(prefill || {}),});

  const handleFromSubmission = (values: any) => {
     console.log("Additional Gynae History Submitted:", values);
    onSubmit(values);
  };

  return (
    <FormikInit
      initialValues={{...defaultInitialValues,...(prefill || {})}}
      validationSchema={schema}
      onSubmit={handleFromSubmission}
      submitButtonText="Next"
    >
      <FormValuesListener
        getValues={(values: any) => {
          setFormValues(values);
          console.log("the values", values);
        }}
      />
      {/*setFormValues*/}
      <FieldsContainer
        sx={{ rowGap: 3, alignItems: "flex", flexDirection: "column" }}
      >
        <RadioGroupInput
          name={form.pidHistory.name}
          label={form.pidHistory.label}
          options={yesNoOptions}
        />
      </FieldsContainer>

      <FieldsContainer
        sx={{ rowGap: 3, alignItems: "flex", flexDirection: "column" }}
      >
        {formValues.pidHistory === "Yes" && (
          <TextInputField
            multiline
            rows={3}
            sx={{ m: 0, width: "100%" }}
            name={form.specifySti.name}
            label={form.specifySti.label}
            id={"specifySti"}
          />
        )}
        <TextInputField
          multiline
          rows={3}
          sx={{ m: 0, width: "100%" }}
          name={form.previousPelvicSurgery.name}
          label={form.previousPelvicSurgery.label}
          id={"previousPelvicSurgery"}
        />

        <TextInputField
          multiline
          rows={3}
          sx={{ m: 0, width: "100%" }}
          name={form.contraceptiveHistory.name}
          label={form.contraceptiveHistory.label}
          id={"contraceptiveHistory"}
        />

        <FormDatePicker
          name={"cervicalCancerDate"}
          label={"Date of Last Cervical Cancer Screening"}
        />
        <TextInputField
          multiline
          rows={3}
          sx={{ m: 0, width: "100%" }}
          name={form.cervicalCancerResult.name}
          label={form.cervicalCancerResult.label}
          id={"cervicalCancerResult"}
        />
        <TextInputField
          multiline
          rows={3}
          sx={{ m: 0, width: "100%" }}
          name={form.obstetricHistory.name}
          label={form.obstetricHistory.label}
          id={"obstetricHistory"}
        />
        <TextInputField
          multiline
          rows={3}
          sx={{ m: 0, width: "100%" }}
          name={form.medicalHistory.name}
          label={form.medicalHistory.label}
          id={"medicalHistory"}
        />
        <TextInputField
          multiline
          rows={3}
          sx={{ m: 0, width: "100%" }}
          name={form.surgicalHistory.name}
          label={form.surgicalHistory.label}
          id={"surgicalHistory"}
        />

        <TextInputField
          multiline
          rows={3}
          sx={{ m: 0, width: "100%" }}
          name={form.drugHistory.name}
          label={form.drugHistory.label}
          id={"drugHistory"}
        />

        <TextInputField
          multiline
          rows={2}
          sx={{ m: 0, width: "100%" }}
          name={form.allergies.name}
          label={form.allergies.label}
          id={"allergies"}
        />
        <TextInputField
          multiline
          rows={3}
          sx={{ m: 0, width: "100%" }}
          name={form.familyHistory.name}
          label={form.familyHistory.label}
          id={"familyHistory"}
        />
      </FieldsContainer>
    </FormikInit>
  );
};

export default PregnancyAdditionalHistoryForm;
