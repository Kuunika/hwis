import { useState } from "react";
import {
  BasePopover,
  FieldsContainer,
  FormikInit,
  MainButton,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
  WrapperBox,
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

const labSamples = [
  { id: "Blood", label: "Blood Sample" },
  { id: "Urine", label: "Urine Sample" },
  { id: "Stool", label: "Stool Sample" },
  { id: "Saliva", label: "Saliva Sample" },
  { id: "TissueBiopsy", label: "Tissue Biopsy" },
  { id: "CSF", label: "Cerebrospinal Fluid (CSF)" },
  { id: "SynovialFluid", label: "Synovial Fluid" },
  { id: "Sputum", label: "Sputum Sample" },
  { id: "Hair", label: "Hair Sample" },
  { id: "Swab", label: "Swab Sample" },
  { id: "BoneMarrow", label: "Bone Marrow Aspiration" },
  { id: "SkinBiopsy", label: "Skin Biopsy" },
];

const sampleTypes = [
  { id: "Blood", label: "Blood" },
  { id: "Urine", label: "Urine" },
  { id: "Stool", label: "Stool" },
  { id: "Saliva", label: "Saliva" },
  { id: "Tissue", label: "Tissue" },
  { id: "CerebrospinalFluid", label: "Cerebrospinal Fluid (CSF)" },
  { id: "SynovialFluid", label: "Synovial Fluid" },
  { id: "Sputum", label: "Sputum" },
  { id: "Hair", label: "Hair" },
  { id: "Swab", label: "Swab" },
  { id: "BoneMarrow", label: "Bone Marrow" },
  { id: "SkinBiopsy", label: "Skin Biopsy" },
];

const specimenSites = [
  { id: "Venipuncture", label: "Venipuncture (Vein)" },
  { id: "Fingerstick", label: "Fingerstick" },
  { id: "Clean-Catch Urine", label: "Clean-Catch Urine" },
  { id: "Midstream Urine", label: "Midstream Urine" },
  { id: "Stool", label: "Stool" },
  { id: "Saliva", label: "Saliva" },
  { id: "Tissue Biopsy", label: "Tissue Biopsy" },
  { id: "Lumbar Puncture", label: "Lumbar Puncture" },
  { id: "Joint Aspiration", label: "Joint Aspiration" },
  { id: "Sputum", label: "Sputum" },
  { id: "Hair Follicle", label: "Hair Follicle" },
  { id: "Nasopharyngeal Swab", label: "Nasopharyngeal Swab" },
  { id: "Bone Marrow Aspiration", label: "Bone Marrow Aspiration" },
  { id: "Skin Lesion", label: "Skin Lesion" },
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
      <br />

      <SearchComboBox
        name={form.testDescription.name}
        label={form.testDescription.label}
        options={tests}
        multiple={false}
      />
      <br />
      <MainButton
        variant="secondary"
        title={"add notes"}
        onClick={handleClick}
      />
      <br />
      <br />
      <BasePopover onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <InformationRow />
      </BasePopover>

      <FieldsContainer>
        <SearchComboBox
          name={form.sample.name}
          label={form.sample.label}
          options={labSamples}
          multiple={false}
          sx={{ mr: "1ch" }}
        />
        <SearchComboBox
          name={form.sampleType.name}
          label={form.sampleType.label}
          options={sampleTypes}
          multiple={false}
        />
      </FieldsContainer>
      <br />
      <FieldsContainer>
        <SearchComboBox
          name={form.specimenSite.name}
          label={form.specimenSite.label}
          options={specimenSites}
          multiple={false}
          sx={{ mr: "1ch" }}
        />
        <TextInputField
          name={form.other.name}
          label={form.other.label}
          id={form.other.name}
        />
      </FieldsContainer>
    </FormikInit>
  );
}
