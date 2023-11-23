
import React, {useState} from 'react'
import * as yup from "yup";
import { FormikInit, RadioGroupInput } from 'shared-ui/src';
import { Box } from "@mui/material";

    type Prop = {
      onSubmit: (values: any) => void;
    };
    const form = {
      asthmaInfo: {
        name: "asthmaInfo",
        label: "Asthma?",
      },
      hypertensionInfo: {
        name: "hypertensionInfo",
        label: "Hypertension?",
      },
      diabetesInfo: {
        name: "diabetesInfo",
        label: "Diabetes?",
      },
      renalDisease: {
        name: "renalDisease",
        label: "Renal Disease?",
      },
      fistulaRepair: {
        name: "fistulaRepair",
        label: "Fistula Repair",
      },
      LegSpineDeformity: {
        name: "LegSpineDeformity",
        label: "Leg/Spine deformity",
      },
      hivStatus:{
        name:"hivStatus",
        label:"HIV status of woman"
      },
    };

    const schema = yup.object({
      [form.asthmaInfo.name]: yup
        .string()
        .required()
        .label(form.asthmaInfo.label),
      [form.hypertensionInfo.name]: yup
        .string()
        .required()
        .label(form.hypertensionInfo.label),
      [form.diabetesInfo.name]: yup
        .string()
        .required()
        .label(form.diabetesInfo.label),
      [form.renalDisease.name]: yup
        .string()
        .required()
        .label(form.renalDisease.label),
      [form.fistulaRepair.name]: yup
        .string()
        .required()
        .label(form.fistulaRepair.label),
      [form.LegSpineDeformity.name]: yup
        .string()
        .required()
        .label(form.LegSpineDeformity.label),
        [form.hivStatus.name]:yup.string().required().label(form.hivStatus.label)
    });
    const initialValues = {
      asthmaInfo: "",
      hypertensionInfo: "",
      diabetesInfo: "",
      renalDisease: "",
      fistulaRepair: "",
      LegSpineDeformity: "",
      hivStatus:""
    };

const MedicalHistory = ({onSubmit}:Prop) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <Box>
        <RadioGroupInput
          name={form.asthmaInfo.name}
          label={form.asthmaInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.hypertensionInfo.name}
          label={form.hypertensionInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.diabetesInfo.name}
          label={form.diabetesInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.renalDisease.name}
          label={form.renalDisease.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.fistulaRepair.name}
          label={form.fistulaRepair.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.LegSpineDeformity.name}
          label={form.LegSpineDeformity.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.hivStatus.name}
          label={form.hivStatus.label}
          options={[
            { label: "Unknown", value: "Unknown" },
            { label: "Positive", value: "Positive" },
          ]}
        />
        {/* <TextInputField
          name={form.pressureInfo.name}
          label={form.pressureInfo.label}
          id={form.pressureInfo.name}
        /> */}
      </Box>
    </FormikInit>
  );
}

export default MedicalHistory
