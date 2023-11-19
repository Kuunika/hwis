import { useState } from "react";
import {
  BasePopover,
  FormikInit,
  MainButton,
  RadioGroupInput,
  SearchComboBox,
} from "shared-ui/src";
import * as yup from "yup";
import { InformationRow } from "./infoSelectionBox";

type props = {
  initialValues: any;
  onSubmit: (values: any) => void;
};

const form = {
  testType: {
    name: "testType",
    label: " Test Type",
  },
  testDescription: {
    name: "testDescription",
    label: "Test Description",
  },
  sample: {
    name: "sample",
    label: "Sample",
  },
  sampleType: {
    name: "sampleType",
    label: "Sample Type",
  },
  specimenSite: {
    name: "specimenSite",
    label: "Specimen Site",
  },
  other: {
    name: "other",
    label: "Other",
  },
  clinicalInfo: {
    name: "clinicalInfo",
    label: "Clinical Information",
  },
};

const schema = yup.object({
  [form.testType.name]: yup.string().required().label(form.testType.label),
  [form.testDescription.name]: yup.string().label(form.testDescription.label),
  [form.clinicalInfo.name]: yup.string().label(form.clinicalInfo.label),
  [form.sample.name]: yup.string().label(form.sample.label),
  [form.sampleType.name]: yup.string().label(form.sampleType.label),
  [form.specimenSite.name]: yup.string().label(form.specimenSite.label),
  [form.other.name]: yup.string().label(form.other.label),
});

const testTypes = [
  { label: "Bedside Test", value: "Bedside Test" },
  { label: "Lab Test", value: "Lab Test" },
  { label: "Radio Test", value: "Radio Test" },
];

const tests = [
  { id: "CBC", label: "Complete Blood Count (CBC)" },
  { id: "BMP", label: "Basic Metabolic Panel (BMP)" },
  { id: "CMP", label: "Comprehensive Metabolic Panel (CMP)" },
  { id: "Lipid", label: "Lipid Panel" },
  { id: "Thyroid", label: "Thyroid Function Tests" },
  { id: "Coagulation", label: "Blood Coagulation Tests" },
  { id: "Urinalysis", label: "Urinalysis" },
  { id: "HbA1c", label: "Hemoglobin A1c (HbA1c)" },
  { id: "CRP", label: "C-reactive Protein (CRP)" },
  { id: "VitaminD", label: "Vitamin D Levels" },
  { id: "IronStudies", label: "Iron Studies" },
  { id: "HormoneLevels", label: "Hormone Levels" },
  { id: "CancerMarkers", label: "Cancer Markers" },
];

export function InvestigationsForm({ initialValues, onSubmit }: props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <RadioGroupInput
        name={form.testType.name}
        label={form.testType.label}
        options={testTypes}
        row={true}
      />
      <br />
      <SearchComboBox
        name={form.testDescription.name}
        label={form.testDescription.label}
        options={tests}
        multiple={false}
      />
      <MainButton
        variant="secondary"
        title={"add notes"}
        onClick={handleClick}
      />
      <BasePopover onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <InformationRow />
      </BasePopover>
    </FormikInit>
  );
}
