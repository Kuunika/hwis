import { useState } from "react";
import { TextInputField, MultlineInput, WrapperBox, FieldsContainer, MainButton, FormikInit, FormFieldContainerLayout } from "@/components";
import * as Yup from "yup";
type Prop = {
  onSubmit: (values: any) => void;
};

const nursingNotesFormConfig = {
    subjective: {
      name: "subjective",
      label: "Subjective Data",
    },
    objective: {
      head: { name: "objective.head", label: "Objective Data (Head)" },
      chest: { name: "objective.chest", label: "Objective Data (Chest)" },
      abdomen: { name: "objective.abdomen", label: "Objective Data (Abdomen)" },
      extremities: { name: "objective.extremities", label: "Objective Data (Extremities)" },
    },
    investigations: {
      MRDT: { name: "investigations.MRDT", label: "MRDT" },
      RBG: { name: "investigations.RBG", label: "RBG" },
      PT: { name: "investigations.PT", label: "PT" },
      FBC: { name: "investigations.FBC", label: "FBC" },
      urineDipstick: { name: "investigations.urineDipstick", label: "Urine Dipstick" },
    },
    assessment: {
      name: "assessment",
      label: "Assessment",
    },
    plan: {
      name: "plan",
      label: "Plan (Recommendations)",
    },
    interventions: {
      name: "interventions",
      label: "Interventions",
    },
  };

export const NursingNotesForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState({
    subjective: "",
    objective: {
      head: "",
      chest: "",
      abdomen: "",
      extremities: "",
    },
    investigations: {
      MRDT: "",
      RBG: "",
      PT: "",
      FBC: "",
      urineDipstick: "",
    },
    assessment: "",
    plan: "",
    interventions: "",
  });

  const schema = Yup.object().shape({
    [nursingNotesFormConfig.subjective.name]: Yup.string().required(`${nursingNotesFormConfig.subjective.label} is required`),
    objective: Yup.object().shape({
      [nursingNotesFormConfig.objective.head.name.split(".")[1]]: Yup.string().required(`${nursingNotesFormConfig.objective.head.label} is required`),
      [nursingNotesFormConfig.objective.chest.name.split(".")[1]]: Yup.string().required(`${nursingNotesFormConfig.objective.chest.label} is required`),
      [nursingNotesFormConfig.objective.abdomen.name.split(".")[1]]: Yup.string().required(`${nursingNotesFormConfig.objective.abdomen.label} is required`),
      [nursingNotesFormConfig.objective.extremities.name.split(".")[1]]: Yup.string().required(`${nursingNotesFormConfig.objective.extremities.label} is required`),
    }),
    investigations: Yup.object().shape({
      [nursingNotesFormConfig.investigations.MRDT.name.split(".")[1]]: Yup.string().required(`${nursingNotesFormConfig.investigations.MRDT.label} is required`),
      [nursingNotesFormConfig.investigations.RBG.name.split(".")[1]]: Yup.string().required(`${nursingNotesFormConfig.investigations.RBG.label} is required`),
      [nursingNotesFormConfig.investigations.PT.name.split(".")[1]]: Yup.string().required(`${nursingNotesFormConfig.investigations.PT.label} is required`),
      [nursingNotesFormConfig.investigations.FBC.name.split(".")[1]]: Yup.string().required(`${nursingNotesFormConfig.investigations.FBC.label} is required`),
      [nursingNotesFormConfig.investigations.urineDipstick.name.split(".")[1]]: Yup.string().required(`${nursingNotesFormConfig.investigations.urineDipstick.label} is required`),
    }),
    [nursingNotesFormConfig.assessment.name]: Yup.string().required(`${nursingNotesFormConfig.assessment.label} is required`),
    [nursingNotesFormConfig.plan.name]: Yup.string().required(`${nursingNotesFormConfig.plan.label} is required`),
    [nursingNotesFormConfig.interventions.name]: Yup.string().required(`${nursingNotesFormConfig.interventions.label} is required`),
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === "objective" || section === "investigations") {
      setFormValues((prevValues) => ({
        ...prevValues,
        [section]: { ...prevValues[section], [field]: value },
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [section]: value,
      }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={formValues}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      submitButtonText="Submit"
      submitButton={false}
    >
      <WrapperBox>
      <FormFieldContainerLayout title="Subjective Data">
        <FieldsContainer>
          {/* Subjective Data */}
          <MultlineInput
            id={nursingNotesFormConfig.subjective.name}
            name={nursingNotesFormConfig.subjective.name}
            label={nursingNotesFormConfig.subjective.label}
            maxRows={5}
          />
</FieldsContainer>
</FormFieldContainerLayout>
<FormFieldContainerLayout title="Objective Data">
<FieldsContainer>
          {/* Objective Data */}
          <MultlineInput
            id={nursingNotesFormConfig.objective.head.name}
            name={nursingNotesFormConfig.objective.head.name}
            label={nursingNotesFormConfig.objective.head.label}
            maxRows={5}
          />
          <MultlineInput
            id={nursingNotesFormConfig.objective.chest.name}
            name={nursingNotesFormConfig.objective.chest.name}
            label={nursingNotesFormConfig.objective.chest.label}
            maxRows={5}
          />
          <MultlineInput
            id={nursingNotesFormConfig.objective.abdomen.name}
            name={nursingNotesFormConfig.objective.abdomen.name}
            label={nursingNotesFormConfig.objective.abdomen.label}
            maxRows={5}
          />
          <MultlineInput
            id={nursingNotesFormConfig.objective.extremities.name}
            name={nursingNotesFormConfig.objective.extremities.name}
            label={nursingNotesFormConfig.objective.extremities.label}
            maxRows={5}
          />
</FieldsContainer>
</FormFieldContainerLayout>
<FormFieldContainerLayout title="Investigations">
<FieldsContainer>
          {/* Investigations */}
          <MultlineInput
            id={nursingNotesFormConfig.investigations.MRDT.name}
            name={nursingNotesFormConfig.investigations.MRDT.name}
            label={nursingNotesFormConfig.investigations.MRDT.label}
            maxRows={5}
          />
          <MultlineInput
            id={nursingNotesFormConfig.investigations.RBG.name}
            name={nursingNotesFormConfig.investigations.RBG.name}
            label={nursingNotesFormConfig.investigations.RBG.label}
            maxRows={5}
          />
          <MultlineInput
            id={nursingNotesFormConfig.investigations.PT.name}
            name={nursingNotesFormConfig.investigations.PT.name}
            label={nursingNotesFormConfig.investigations.PT.label}
            maxRows={5}
          />
          <MultlineInput
            id={nursingNotesFormConfig.investigations.FBC.name}
            name={nursingNotesFormConfig.investigations.FBC.name}
            label={nursingNotesFormConfig.investigations.FBC.label}
            maxRows={5}
          />
          <MultlineInput
            id={nursingNotesFormConfig.investigations.urineDipstick.name}
            name={nursingNotesFormConfig.investigations.urineDipstick.name}
            label={nursingNotesFormConfig.investigations.urineDipstick.label}
            maxRows={5}
          />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Assessment">
        <FieldsContainer>
          {/* Assessment */}
          <MultlineInput
            id={nursingNotesFormConfig.assessment.name}
            name={nursingNotesFormConfig.assessment.name}
            label={nursingNotesFormConfig.assessment.label}
            maxRows={5}
          />
          </FieldsContainer>
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Plan">
          <FieldsContainer>
          {/* Plan */}
          <MultlineInput
            id={nursingNotesFormConfig.plan.name}
            name={nursingNotesFormConfig.plan.name}
            label={nursingNotesFormConfig.plan.label}
            maxRows={5}
          />
            </FieldsContainer>
            </FormFieldContainerLayout>
            <FormFieldContainerLayout title="Interventions">
          <FieldsContainer>
          {/* Interventions */}
          <MultlineInput
            id={nursingNotesFormConfig.interventions.name}
            name={nursingNotesFormConfig.interventions.name}
            label={nursingNotesFormConfig.interventions.label}
            maxRows={5}
          />
        </FieldsContainer>
        </FormFieldContainerLayout>
        
      </WrapperBox>
      <MainButton title="Submit" type="submit" />
    </FormikInit>
  );
};