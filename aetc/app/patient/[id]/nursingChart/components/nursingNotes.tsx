import { useState } from "react";
import { TextInputField, MultlineInput, WrapperBox, FieldsContainer, MainButton, FormikInit, FormFieldContainerLayout, FormValuesListener } from "@/components";
import * as Yup from "yup";
import { concepts } from "@/constants";
type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

const nursingNotesFormConfig = {
    subjective: {
      name: concepts.SUBJECTIVE_DATA,
      label: "Subjective Data",
    },
    objective: {
      head: { name: `objective.${concepts.OBJECTIVE_DATA_HEAD}`, label: "Objective Data (Head)" },
      chest: { name: `objective.${concepts.OBJECTIVE_DATA_CHEST}`, label: "Objective Data (Chest)" },
      abdomen: { name: `objective.${concepts.OBJECTIVE_DATA_ABDOMEN}`, label: "Objective Data (Abdomen)" },
      extremities: { name: `objective.${concepts.OBJECTIVE_DATA_EXTREMITIES}`, label: "Objective Data (Extremities)" },
    },
    investigations: {
      MRDT: { name: `investigations.${concepts.MRDT}`, label: "MRDT" },
      RBG: { name: `investigations.${concepts.BLOOD_GLUCOSE}`, label: "RBG" },
      PT: { name: `investigations.${concepts.INVESTIGATIONS_PT}`, label: "PT" },
      FBC: { name: `investigations.${concepts.INVESTIGATIONS_FBC}`, label: "FBC" },
      urineDipstick: { name: `investigations.${concepts.URINE_DIPSTICK_KETONES}`, label: "Urine Dipstick" },
    },
    assessment: {
      name: concepts.ASSESSMENT_COMMENTS,
      label: "Assessment",
    },
    plan: {
      name: concepts.TREATMENT_PLAN,
      label: "Plan (Recommendations)",
    },
    interventions: {
      name: concepts.INTERVENTION_NOTES,
      label: "Interventions",
    },
  };

export const NursingNotesForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});

  const schema = Yup.object().shape({
    [nursingNotesFormConfig.subjective.name]: Yup.string(),
    objective: Yup.object().shape({
      [nursingNotesFormConfig.objective.head.name.split(".")[1]]: Yup.string(),
      [nursingNotesFormConfig.objective.chest.name.split(".")[1]]: Yup.string(),
      [nursingNotesFormConfig.objective.abdomen.name.split(".")[1]]: Yup.string(),
      [nursingNotesFormConfig.objective.extremities.name.split(".")[1]]: Yup.string(),
    }),
    investigations: Yup.object().shape({
      [nursingNotesFormConfig.investigations.MRDT.name.split(".")[1]]: Yup.string(),
      [nursingNotesFormConfig.investigations.RBG.name.split(".")[1]]: Yup.string(),
      [nursingNotesFormConfig.investigations.PT.name.split(".")[1]]: Yup.string(),
      [nursingNotesFormConfig.investigations.FBC.name.split(".")[1]]: Yup.string(),
      [nursingNotesFormConfig.investigations.urineDipstick.name.split(".")[1]]: Yup.string(),
    }),
    [nursingNotesFormConfig.assessment.name]: Yup.string(),
    [nursingNotesFormConfig.plan.name]: Yup.string(),
    [nursingNotesFormConfig.interventions.name]: Yup.string(),
  });


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
        <FormValuesListener getValues={setFormValues} />
      <WrapperBox>
      <FormFieldContainerLayout title="Subjective Data">
        <FieldsContainer>
          {/* Subjective Data */}
          <TextInputField
            id={nursingNotesFormConfig.subjective.name}
            name={nursingNotesFormConfig.subjective.name}
            label={nursingNotesFormConfig.subjective.label}
            multiline
            rows={5}
            sx={{ lineHeight: '250px' }}
          />
</FieldsContainer>
</FormFieldContainerLayout>
<FormFieldContainerLayout title="Objective Data">
<FieldsContainer>
          {/* Objective Data */}
          <TextInputField
            id={nursingNotesFormConfig.objective.head.name}
            name={nursingNotesFormConfig.objective.head.name}
            label="Head"
            multiline
            rows={5}
          />
          <TextInputField
            id={nursingNotesFormConfig.objective.chest.name}
            name={nursingNotesFormConfig.objective.chest.name}
            label="Chest"
            multiline
            rows={5}
          />
          </FieldsContainer>
          <FieldsContainer>
          <TextInputField
            id={nursingNotesFormConfig.objective.abdomen.name}
            name={nursingNotesFormConfig.objective.abdomen.name}
            label="Abdomen"
            multiline
            rows={5}
          />
          <TextInputField
            id={nursingNotesFormConfig.objective.extremities.name}
            name={nursingNotesFormConfig.objective.extremities.name}
            label="Extremities"
            multiline
            rows={5}
          />
</FieldsContainer>
</FormFieldContainerLayout>
<FormFieldContainerLayout title="Investigations">
<FieldsContainer>
          <TextInputField
            id={nursingNotesFormConfig.investigations.MRDT.name}
            name={nursingNotesFormConfig.investigations.MRDT.name}
            label={nursingNotesFormConfig.investigations.MRDT.label}
            multiline
            rows={5}
          />
          <TextInputField
            id={nursingNotesFormConfig.investigations.RBG.name}
            name={nursingNotesFormConfig.investigations.RBG.name}
            label={nursingNotesFormConfig.investigations.RBG.label}
            multiline
            rows={5}
          />
          </FieldsContainer>
          <FieldsContainer>
          <TextInputField
            id={nursingNotesFormConfig.investigations.PT.name}
            name={nursingNotesFormConfig.investigations.PT.name}
            label={nursingNotesFormConfig.investigations.PT.label}
            multiline
            rows={5}
          />
          <TextInputField
            id={nursingNotesFormConfig.investigations.FBC.name}
            name={nursingNotesFormConfig.investigations.FBC.name}
            label={nursingNotesFormConfig.investigations.FBC.label}
            multiline
            rows={5}
          />
          </FieldsContainer>
          <FieldsContainer>
          <TextInputField
            id={nursingNotesFormConfig.investigations.urineDipstick.name}
            name={nursingNotesFormConfig.investigations.urineDipstick.name}
            label={nursingNotesFormConfig.investigations.urineDipstick.label}
            multiline
            rows={5}
          />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Assessment">
        <FieldsContainer>
          {/* Assessment */}
          <TextInputField
            id={nursingNotesFormConfig.assessment.name}
            name={nursingNotesFormConfig.assessment.name}
            label={nursingNotesFormConfig.assessment.label}
            multiline
            rows={5}
          />
          </FieldsContainer>
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Plan">
          <FieldsContainer>
          {/* Plan */}
          <TextInputField
            id={nursingNotesFormConfig.plan.name}
            name={nursingNotesFormConfig.plan.name}
            label="Recommendation"
            multiline
            rows={5}
          />
            </FieldsContainer>
            </FormFieldContainerLayout>
            <FormFieldContainerLayout title="Interventions">
          <FieldsContainer>
          {/* Interventions */}
          <TextInputField
            id={nursingNotesFormConfig.interventions.name}
            name={nursingNotesFormConfig.interventions.name}
            label={nursingNotesFormConfig.interventions.label}
            multiline
            rows={5}
          />
        </FieldsContainer>
        </FormFieldContainerLayout>
        
      </WrapperBox>
      <MainButton sx={{ m: 0.5 }} title="Submit" type="submit" onClick={handleSubmit}/>
      <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
    </FormikInit>
  );
};