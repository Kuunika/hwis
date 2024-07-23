import { useConditions, useNavigation } from "@/hooks";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainButton,
  RadioGroupInput,
  WrapperBox,
} from "@/components";
import * as Yup from "yup";
import { TriageContainer } from ".";
import { getInitialValues, notify, successDialog } from "@/helpers";
import { NO, YES, concepts } from "@/constants";

export const PersistentFormConfig = {
  activeSeizures: {
    name: concepts.ACTIVE_SEIZURES,
    label: "Active Seizures",
  },
  focalNeurological: {
    name: concepts.FOCAL_NEUROLOGICAL,
    label: "focal neurologic findings",
  },
  headache: {
    name: concepts.HEADACHE,
    label: "Headache",
  },
  weakness: {
    name: concepts.WEAKNESS,
    label: "Weakness",
  },
  confusion: {
    name: concepts.CONFUSION,
    label: "Confusion",
  },
  severePain: {
    name: concepts.SEVERE_PAIN,
    label: "Severe Pain",
  },
  moderatePain: {
    name: concepts.MODERATE_PAIN,
    label: "moderate pain or a reason to be seen in under four hours",
  },
};

type Prop = {
  onSubmit: (values: any) => void;
  setTriageResult: (rre: any, name: string) => void;
  triageResult: string,
  continueTriage: boolean,
  previous: () => void,
  getFormValues: (values:any)=>void
};

const schema = Yup.object().shape({
  [PersistentFormConfig.activeSeizures.name]: Yup.string()
    .required()
    .label(PersistentFormConfig.activeSeizures.label),
  [PersistentFormConfig.confusion.name]: Yup.string().required().label(PersistentFormConfig.confusion.label),
  [PersistentFormConfig.headache.name]: Yup.string().required().label(PersistentFormConfig.headache.label),
  [PersistentFormConfig.moderatePain.name]: Yup.string()
    .required()
    .label(PersistentFormConfig.moderatePain.label),
  [PersistentFormConfig.severePain.name]: Yup.string().required().label(PersistentFormConfig.severePain.label),
  [PersistentFormConfig.weakness.name]: Yup.string().required().label(PersistentFormConfig.weakness.label),
  [PersistentFormConfig.focalNeurological.name]: Yup.string()
    .required()
    .label(PersistentFormConfig.focalNeurological.label),
});

const initialsValues = getInitialValues(PersistentFormConfig);
const options = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];
export const PersistentPainForm = ({ onSubmit, triageResult, continueTriage, previous, setTriageResult, getFormValues }: Prop) => {
  const { updateConditions } = useConditions();
  const [formValues, setFormValues] = useState<any>({});

  const disableField = (formField: string) => {
    return (triageResult === "red" && !Boolean(formValues[formField])) && !continueTriage;
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={onSubmit}
      submitButton={false}
      getFormValues={getFormValues}
    >

      <FormValuesListener getValues={setFormValues} />

      <FormFieldContainerLayout title="Seizures and Focal Neurologic">
        <FieldsContainer>
          <RadioGroupInput
            name={PersistentFormConfig.activeSeizures.name}
            label={PersistentFormConfig.activeSeizures.label}
            options={options}
            disabled={disableField(PersistentFormConfig.activeSeizures.name)}
            getValue={(value) => {
              updateConditions(PersistentFormConfig.activeSeizures.name, value)

              if (value == YES) {

                setTriageResult('red', PersistentFormConfig.activeSeizures.name)
              } else {
                setTriageResult('green', PersistentFormConfig.activeSeizures.name)
              }
            }
            }
          />
          <RadioGroupInput
            name={PersistentFormConfig.focalNeurological.name}
            label={PersistentFormConfig.focalNeurological.label}
            options={options}
            disabled={disableField(PersistentFormConfig.focalNeurological.name)}
            getValue={(value) => {
              updateConditions(PersistentFormConfig.focalNeurological.name, value);
              if (value == YES) {
                setTriageResult('red', PersistentFormConfig.focalNeurological.name)
              } else {
                setTriageResult('green', PersistentFormConfig.focalNeurological.name)
              }
            }
            }
          />
        </FieldsContainer>
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Headache and Weakness">
        <FieldsContainer>
          <RadioGroupInput
            name={PersistentFormConfig.headache.name}
            disabled={disableField(PersistentFormConfig.headache.name)}
            label={PersistentFormConfig.headache.label}
            options={options}
            getValue={(value) => {

              if (value == YES) {
                setTriageResult('yellow', PersistentFormConfig.headache.name)
              } else {
                setTriageResult('green', PersistentFormConfig.headache.name)
              }

              updateConditions(PersistentFormConfig.headache.name, value)
            }
            }
          />
          <RadioGroupInput
            name={PersistentFormConfig.weakness.name}
            disabled={disableField(PersistentFormConfig.weakness.name)}
            label={PersistentFormConfig.weakness.label}
            options={options}
            getValue={(value) => {
              updateConditions(PersistentFormConfig.weakness.name, value);
              if (value == YES) {
                setTriageResult('yellow', PersistentFormConfig.weakness.name)
              } else {
                setTriageResult('green', PersistentFormConfig.weakness.name)
              }
            }}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>
      <FormFieldContainerLayout last={true} title="Severe Pain and Confusion">
        <FieldsContainer>
          <RadioGroupInput
            name={PersistentFormConfig.severePain.name}
            disabled={disableField(PersistentFormConfig.severePain.name)}
            label={PersistentFormConfig.severePain.label}
            options={options}
            getValue={(value) => {
              updateConditions(PersistentFormConfig.severePain.name, value);
              if (value == YES) {
                setTriageResult('red', PersistentFormConfig.severePain.name)
              } else {
                setTriageResult('green', PersistentFormConfig.severePain.name)
              }
            }}
          />
          <RadioGroupInput
            name={PersistentFormConfig.confusion.name}
            disabled={disableField(PersistentFormConfig.confusion.name)}
            label={PersistentFormConfig.confusion.label}
            options={options}
            getValue={(value) => {

              updateConditions(PersistentFormConfig.confusion.name, value)
              if (value == YES) {
                setTriageResult('yellow', PersistentFormConfig.confusion.name)
              } else {
                setTriageResult('green', PersistentFormConfig.confusion.name)
              }
            }}
          />
        </FieldsContainer>
        <FieldsContainer>
          <RadioGroupInput
            disabled={disableField(PersistentFormConfig.moderatePain.name)}
            name={PersistentFormConfig.moderatePain.name}
            label={PersistentFormConfig.moderatePain.label}
            options={options}
            getValue={(value) => {
              if (value == YES) {
                setTriageResult('yellow', PersistentFormConfig.moderatePain.name)
              } else {
                setTriageResult('green', PersistentFormConfig.moderatePain.name)
              }
            }}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>
      <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"previous"} variant="secondary" type="button" onClick={previous} />
        <MainButton sx={{ m: 0.5 }} title={"submit"} type="submit" onClick={() => { }} />
      </WrapperBox>
    </FormikInit>
  );
};
