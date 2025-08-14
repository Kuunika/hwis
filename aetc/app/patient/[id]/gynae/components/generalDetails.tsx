"use client";
import {
  DatePickerInput,
  FieldsContainer,
  FormDatePicker,
  FormFieldContainerLayout,
  FormikInit,
  FormValuesListener,
  RadioGroupInput,
  TextInputField,
  WrapperBox,
} from "@/components";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { concepts, NO, YES } from "@/constants";
import { Label } from "@mui/icons-material";
import { useState } from "react";
import * as yup from "yup";

interface GeneralDetailsFormProps {
  onSubmit: (values: any) => void;
}

const form = {
  lmp: { name: "lmp", label: "LMP" },
  ga: { name: "ga", label: "GA" },
  hivStatus: { name: "hivStatus", label: "HIV Status" },
  vdrl: { name: "vdrl", label: "VDRL" },
  location: { name: "location", label: "Location" },
  gravida: { name: "gravida", label: "Gravida" },
  para: { name: "para", label: "Para" },
  previousEctopic: { name: "previousEctopic", label: "Previous Ectopic" },
  HIVSTATUS: { name: "HIV_STATUS", label: "HIV Status:" },
  VDRL: { name: "vdrl", label: "VDRL:" },
  previousMiscarriages: {
    name: "previousMiscarriages",
    label: "Previous Miscarriages",
  },
  previousMolar: { name: "previousMolar", label: "Previous Molar" },
};

const schema = yup.object().shape({
  [form.lmp.name]: yup.string().required("Required"),
  [form.ga.name]: yup.string().required("Required"),
  [form.hivStatus.name]: yup.string().required("Required"),
  [form.vdrl.name]: yup.string().required("Required"),
  [form.location.name]: yup.string().required("Required"),
  [form.gravida.name]: yup.number().required("Required"),
  [form.para.name]: yup.number().required("Required"),
  [form.previousEctopic.name]: yup.string().required("Required"),
  [form.previousMiscarriages.name]: yup.string().required("Required"),
  [form.previousMolar.name]: yup.string().required("Required"),
});

// Initial form values
const initialValues = Object.keys(form).reduce((acc, key) => {
  acc[key] = "";
  return acc;
}, {} as any);

// HIV Status & VDRL options
const hivStatusOptions = [
  { label: "NR", value: "NR" },
  { label: "R", value: "R" },
  { label: "U", value: "U" },
  { label: "On ART", value: "On ART" },
];

const vdrlOptions = [
  { label: "Neg", value: "Neg" },
  { label: "Pos", value: "Pos" },
  { label: "UN", value: "UN" },
];

// const GeneralDetailsForm = ({
//   onSubmit,
// }: {
//   onSubmit: (values: any) => void;
// })

const GeneralDetailsForm: React.FC<GeneralDetailsFormProps> = ({
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState();

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
        rowGap:20,
        position: "relative", //added
      }}
    >
      <FormikInit
        onSubmit={handleFromSubmission}
        validationSchema={schema}
        initialValues={initialValues}
        submitButtonText="Next"
      >
        <FormValuesListener getValues={setFormValues} />


          <FieldsContainer sx={{ alignItems: "flex" }}>
            {/* <TextInputField
              name={form.lmp.name}
              label={form.lmp.label}
              id={""}
            /> */}
            <FormDatePicker name={form.lmp.name} label={form.lmp.label} />
            <FormDatePicker name={form.ga.name} label={form.ga.label} />

            {/* <TextInputField name={form.ga.name} label={form.ga.label} id={""} /> */}
          </FieldsContainer>

          <FieldsContainer sx={{ alignItems: "flex" }}>
            <RadioGroupInput
              name={form.hivStatus.name}
              label={form.hivStatus.label}
              options={hivStatusOptions}
            />
            <RadioGroupInput
              name={form.vdrl.name}
              label={form.vdrl.label}
              options={vdrlOptions}
            />
          </FieldsContainer>
          <FieldsContainer sx={{ alignItems: "flex" }}>
            <TextInputField
              id=""
              name={form.location.name}
              label={form.location.label}
            />
            <TextInputField
              id=""
              name={form.gravida.name}
              label={form.gravida.label}
            />
          </FieldsContainer>
          <FieldsContainer sx={{ alignItems: "flex" }}>
            <TextInputField
              id=""
              name={form.para.name}
              label={form.para.label}
            />
            <TextInputField
              id=""
              name={form.previousEctopic.name}
              label={form.previousEctopic.label}
            />
          </FieldsContainer>

          <FieldsContainer sx={{ alignItems: "flex" }}>
            <TextInputField
              id=""
              name={form.previousMiscarriages.name}
              label={form.previousMiscarriages.label}
            />

            <TextInputField
              id=""
              name={form.previousMolar.name}
              label={form.previousMolar.label}
            />
          </FieldsContainer>
      </FormikInit>
    </WrapperBox>
  );
};

export default GeneralDetailsForm;
