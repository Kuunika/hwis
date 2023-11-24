
import React, {useState} from 'react'
import * as yup from "yup";
import { FieldsContainer, FormikInit, RadioGroupInput,TextInputField } from 'shared-ui/src';
import { Box } from "@mui/material";

    type Props = {
      onSubmit: () => void;
      initialValues: any
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
      epilepsyInfo:{
        name:"epilepsyInfo",
        label:"Epilepsy?"
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
      artInfo:{
        name:"artInfo",
        label:"Is the woman on ART?"
      },
      startArt:{
        name:"startArt",
        label:"When did she start ART?"
      },
      artRegistration:{
        name:"artRegistration",
        label:"ART registration"
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
        [form.epilepsyInfo.name]: yup.string().required().label(form.epilepsyInfo.label),
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
        [form.hivStatus.name]:yup.string().required().label(form.hivStatus.label),
        [form.artInfo.name]:yup.string().required().label(form.artInfo.label),
        [form.startArt.name]:yup.string().required().label(form.artInfo.label),
        [form.artRegistration.name]:yup.string().required().label(form.artRegistration.label)
    });

  const MedicalHistory = ({ onSubmit,initialValues }: Props) => {
  const [isPositive, setIsPositive] = useState(false);
  const [isArt, setArt] = useState(false);

  const [showAdditionalRadio, setShowAdditionalRadio] = useState(false);
  const [showAdditionalRadio1, setAdditionalRadio1] = useState(false);

  const handleRadioChange = (fieldName: string, value: string) => {
    if (fieldName === form.hivStatus.name && value === "Positive") {
      setIsPositive(true);
      setShowAdditionalRadio(true);
    } else {
      setIsPositive(false);
      setShowAdditionalRadio(false);
    }
  };
  const handleArtChange = (fieldName: string, value: string) => {
    if (fieldName === form.artInfo.name && value === "yes") {
      setArt(true);
      setAdditionalRadio1(true);
    } else {
      setArt(false);
      setAdditionalRadio1(false);
    }
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <FieldsContainer>
        <RadioGroupInput
          name={form.asthmaInfo.name}
          label={form.asthmaInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.hypertensionInfo.name}
          label={form.hypertensionInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.diabetesInfo.name}
          label={form.diabetesInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.epilepsyInfo.name}
          label={form.epilepsyInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.renalDisease.name}
          label={form.renalDisease.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.fistulaRepair.name}
          label={form.fistulaRepair.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.LegSpineDeformity.name}
          label={form.LegSpineDeformity.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.hivStatus.name}
          label={form.hivStatus.label}
          options={[
            { label: "Unknown", value: "Unknown" },
            { label: "Positive", value: "Positive" },
          ]}
          getValue={(value) => handleRadioChange(form.hivStatus.name, value)}
        />
        {showAdditionalRadio && (
          <RadioGroupInput
            name={form.artInfo.name}
            label={form.artInfo.label}
            options={[
              { label: "Yes", value: "yes" },
              { label: "NO", value: "no" },
            ]}
            getValue={(value) => handleArtChange(form.artInfo.name, value)}
          />
        )}
        {showAdditionalRadio1 && (
          <RadioGroupInput
            name={form.startArt.name}
            label={form.startArt.label}
            options={[
              { label: "Before pregnancy", value: "Beofore pregnancy" },
              {
                label: "1st or 2nd trimester (0-27 weeks)",
                value: "1st or 2nd trimester (0-27 weeks)",
              },
              { label: "3rd trimester", value: "3rd trimester" },
            ]}
          />
        )}
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.artRegistration.name}
          label={form.artRegistration.label}
          id={form.artRegistration.name}
        />
      </FieldsContainer>
    </FormikInit>
  );
};

export default MedicalHistory
