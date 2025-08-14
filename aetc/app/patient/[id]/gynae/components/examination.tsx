"use client";

import {
  FieldsContainer,
  FormFieldContainerLayout,
  RadioGroupInput,
  TextInputField,
  WrapperBox,
  FormikInit,
  FormValuesListener,
} from "@/components";
import * as yup from "yup";
import { useState } from "react";
import DiagnosisForm from "../../consultation/components/diagnosisForm";
import { concepts } from "@/constants";

interface ExamForm {
  onSubmit: (values: any) => void;
}

const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const form = {
  bp: { name: "bp", label: "BP (mm/Hg)" },
  pr: { name: "pr", label: "PR (/min)" },
  temp: { name: "temp", label: "T (°C)" },
  rr: { name: "rr", label: "RR (/min)" },

  conjunctivaPallor: {
    name: "conjunctivaPallor",
    label: "Conjunctiva pallor?",
  },
  dehydration: { name: "dehydration", label: "Dehydration?" },
  crt: { name: "crt", label: "CRT" },

  vaginalSpeculum: {
    name: "vaginalSpeculum",
    label: "Vaginal Examination - Speculum",
  },
  digitalExam: { name: "digitalExam", label: "Digital Exam" },

  diagnosis: { name: "diagnosis", label: "Diagnosis" },
  diffDiagnosis: { name: "diffDiagnosis", label: "Differential Diagnosis" },

  urinePregnancyTest: {
    name: "urinePregnancyTest",
    label: "Urine Pregnancy Test",
  },

  haemoglobin: { name: "haemoglobin", label: "Haemoglobin (g/dl)" },
  bloodGroupRh: { name: "bloodGroupRh", label: "Blood group and Rh" },

  otherTests: { name: "otherTests", label: "Other tests" },
  uss: { name: "uss", label: "USS" },

  finalDiagnosis: { name: "finalDiagnosis", label: "Final Diagnosis" },

  plan: { name: "plan", label: "PLAN" },

  // Blood Count table inputs
  fbcWbc: { name: "fbcWbc", label: "WBC" },
  fbcHb: { name: "fbcHb", label: "HB" },
  fbcPlt: { name: "fbcPlt", label: "PLT" },
};

const schema = yup.object().shape({
  [form.bp.name]: yup.string().required("Required"),
  [form.pr.name]: yup.string().required("Required"),
  [form.temp.name]: yup.string().required("Required"),
  [form.rr.name]: yup.string().required("Required"),
  [form.conjunctivaPallor.name]: yup.string().required("Required"),
  [form.dehydration.name]: yup.string().required("Required"),
  [form.crt.name]: yup.string().required("Required"),
  [form.vaginalSpeculum.name]: yup.string().required("Required"),
  [form.digitalExam.name]: yup.string().required("Required"),
  [form.diagnosis.name]: yup.string().required("Required"),
  [form.diffDiagnosis.name]: yup.string().required("Required"),
  [form.urinePregnancyTest.name]: yup.string().required("Required"),
  [form.haemoglobin.name]: yup.string().required("Required"),
  [form.bloodGroupRh.name]: yup.string().required("Required"),
  [form.otherTests.name]: yup.string().required("Required"),
  [form.finalDiagnosis.name]: yup.string().required("Required"),
  [form.plan.name]: yup.string().required("Required"),
  [form.fbcWbc.name]: yup.string().required("Required"),
  [form.fbcHb.name]: yup.string().required("Required"),
  [form.fbcPlt.name]: yup.string().required("Required"),
  //[form.uss.name]: yup.string,
});

const initialValues = Object.keys(form).reduce(
  (acc, key) => {
    acc[key] = "";
    return acc;
  },
  {} as Record<string, string>
);

//const ExamForm = ({ onSubmit }: { onSubmit: (values: any) => void })

const ExamForm: React.FC<ExamForm> = ({ onSubmit }) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleFromSubmission = () => {};

  return (
    <WrapperBox
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "1ch",
        marginTop: "20px",
        position: "relative", //added
      }}
    >
      <FormikInit
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleFromSubmission}
        submitButtonText="Submit"
      >
        <FormValuesListener getValues={setFormValues} />

        <FieldsContainer sx={{ gap: 3 }}>
          <TextInputField
            name={form.bp.name}
            label={form.bp.label}
            id=""
            type="number"
          />
          <TextInputField
            name={form.pr.name}
            label={form.pr.label}
            id=""
            type="number"
          />
          <TextInputField
            name={form.temp.name}
            label={form.temp.label}
            id=""
            type="number"
          />
          <TextInputField
            name={form.rr.name}
            label={form.rr.label}
            id=""
            type="number"
          />
        </FieldsContainer>
        <br/>
        {/* Conjunctiva Pallor & Dehydration */}
        <FieldsContainer sx={{ gap: 5, alignItems: "center" }}>
          <RadioGroupInput
            name={form.conjunctivaPallor.name}
            label={form.conjunctivaPallor.label}
            options={yesNoOptions}
          />
          <RadioGroupInput
            name={form.dehydration.name}
            label={form.dehydration.label}
            options={yesNoOptions}
          />
        </FieldsContainer>
        <br/>
        <FieldsContainer sx={{ gap: 5, alignItems: "center" }}>
          <TextInputField
            name={form.crt.name}
            label={form.crt.label}
            id=""
            multiline
            rows={3}
            sx={{ m: 0, width: "100%" }}
          />
        </FieldsContainer>
        <br/>

        {/* Vaginal & Digital Exam */}
        <p>Vaginal Examination</p>
        <FieldsContainer sx={{ flexDirection: "column" }}>
          <TextInputField
            name={form.vaginalSpeculum.name}
            label={form.vaginalSpeculum.label}
            multiline
            rows={3}
            sx={{ m: 0, width: "100%" }}
            id=""
          />
          <br/>
          <TextInputField
            name={form.digitalExam.name}
            label={form.digitalExam.label}
            multiline
            rows={3}
            sx={{ m: 0, width: "100%" }}
            id=""
          />
        </FieldsContainer>
        <br/>

        {/* Diagnosis & Differential Diagnosis */}
        <FieldsContainer sx={{ gap: 3, flexDirection: "column" }}>
          <DiagnosisForm conceptType={"name"} />
          {/* <TextInputField
                name={form.diagnosis.name}
                label={form.diagnosis.label}
                multiline
                rows={1}
                id=""
              /> */}
          {/* <TextInputField
                name={form.diffDiagnosis.name}
                label={form.diffDiagnosis.label}
                multiline
                rows={1}
                id=""
              /> */}
          <DiagnosisForm conceptType={concepts.DIFFERENTIAL_DIAGNOSIS} />
        </FieldsContainer>
        <br/>

        {/* Investigations */}
        <FieldsContainer sx={{ gap: 3, flexDirection: "column" }}>
          <p>Investigations</p>
          {/* Urine Pregnancy Test */}
          <RadioGroupInput
            name={form.urinePregnancyTest.name}
            label={form.urinePregnancyTest.label}
            options={[
              { label: "Positive", value: "positive" },
              { label: "Negative", value: "negative" },
            ]}
          />

          <TextInputField
            name={form.haemoglobin.name}
            label={form.haemoglobin.label}
            multiline
            rows={2}
            id=""
          />
          <TextInputField
            name={form.bloodGroupRh.name}
            label={form.bloodGroupRh.label}
            multiline
            rows={2}
            id=""
          />
          <TextInputField
            name={form.otherTests.name}
            label={form.otherTests.label}
            multiline
            rows={2}
            id=""
          />
          <TextInputField
            name={form.uss.name}
            label={form.uss.label}
            multiline
            rows={2}
            id=""
          />
        </FieldsContainer>
        <br/>

        {/* FBC Table */}
        <p>FBC</p>
        <FieldsContainer sx={{ gap: 2, flexWrap: "nowrap" }}>
          <TextInputField
            name={form.fbcWbc.name}
            label={form.fbcWbc.label}
            id=""
            sx={{ width: "60px" }}
          />
          <TextInputField
            name={form.fbcHb.name}
            label={form.fbcHb.label}
            id=""
            sx={{ width: "60px" }}
          />
          <TextInputField
            name={form.fbcPlt.name}
            label={form.fbcPlt.label}
            id=""
            sx={{ width: "60px" }}
          />
        </FieldsContainer>
        <br/>

        {/* Final Diagnosis & Plan */}
        <FieldsContainer sx={{ gap: 3, flexDirection: "column" }}>
          <DiagnosisForm conceptType={concepts.FINAL_DIAGNOSIS} />
          {/* <TextInputField
                name={form.finalDiagnosis.name}
                label={form.finalDiagnosis.label}
                multiline
                rows={2}
                id=""
              /> */}

          <TextInputField
            name={form.plan.name}
            label={form.plan.label}
            sx={{ m: 0, width: "100%" }}
            multiline
            rows={4}
            id=""
          />
        </FieldsContainer>
      </FormikInit>
    </WrapperBox>
  );
};

export default ExamForm;
