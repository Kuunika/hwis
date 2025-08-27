import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainButton,
  RadioGroupInput,
  TextInputField,
  WrapperBox,
} from "@/components";
import * as Yup from "yup";

import { getInitialValues, mapSubmissionToCodedArray } from "@/helpers";
import { NO, YES, concepts } from "@/constants";
import { TriageContext, TriageContextType } from "@/contexts";

type Prop = {
  onSubmit: (values: any) => void;
  setTriageResult: (triage: any, name: string) => void;
  triageResult: string;
  continueTriage: boolean;
  previous: () => void;
  getFormValues: (values: any) => void;
};
export const ConsciousnessFormConfig = {
  consciousness: {
    name: concepts.DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS,
    label: "Does the patient have a reduced Level of consciousness",
    coded: true,
  },

  bloodGlucose: {
    name: concepts.BLOOD_GLUCOSE,
    label: "Blood Glucose",
  },
  gcs: {
    name: concepts.GCS,
    label: "GCS",
  },
};

const schema = Yup.object().shape({
  [ConsciousnessFormConfig.consciousness.name]: Yup.string()
    .required()
    .label(ConsciousnessFormConfig.consciousness.label),
  [ConsciousnessFormConfig.bloodGlucose.name]: Yup.string().label(
    ConsciousnessFormConfig.bloodGlucose.label
  ),
  [ConsciousnessFormConfig.gcs.name]: Yup.string().label(
    ConsciousnessFormConfig.gcs.label
  ),
});

const options = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

const initialValues = getInitialValues(ConsciousnessFormConfig);

export const ConsciousnessForm = ({
  onSubmit,
  triageResult,
  setTriageResult,
  continueTriage,
  previous,
  getFormValues,
}: Prop) => {
  const { flow } = useContext(TriageContext) as TriageContextType;
  const [consciousness, setConsciousness] = useState();
  const [formValues, setFormValues] = useState<any>({});

  const checkGcs = (value: number) => {
    if (!value) {
      setTriageResult("", ConsciousnessFormConfig.gcs.name);
      return;
    }

    if (value < 10) {
      setTriageResult("red", ConsciousnessFormConfig.gcs.name);
    }

    if (value >= 10 && value <= 14) {
      setTriageResult("yellow", ConsciousnessFormConfig.gcs.name);
    }
  };

  const disableField = (formField: string) => {
    return (
      triageResult === "red" &&
      !Boolean(formValues[formField]) &&
      !continueTriage
    );
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{
        ...initialValues,
        [ConsciousnessFormConfig.consciousness.name]:
          flow["gsc"] < 15 ? YES : NO,
        [ConsciousnessFormConfig.gcs.name]: flow["gsc"],
        [ConsciousnessFormConfig.bloodGlucose.name]: flow["glucose"],
      }}
      enableReinitialize={true}
      onSubmit={(values) =>
        onSubmit(mapSubmissionToCodedArray(ConsciousnessFormConfig, values))
      }
      getFormValues={(value) =>
        getFormValues(mapSubmissionToCodedArray(ConsciousnessFormConfig, value))
      }
      submitButtonText="next"
      submitButton={false}
    >
      <FormValuesListener getValues={setFormValues} />

      <FormFieldContainerLayout
        last={consciousness != YES}
        title="Consciousness"
      >
        <RadioGroupInput
          name={ConsciousnessFormConfig.consciousness.name}
          label={ConsciousnessFormConfig.consciousness.label}
          options={options}
          getValue={(value) => setConsciousness(value)}
          disabled={disableField(ConsciousnessFormConfig.consciousness.name)}
        />
      </FormFieldContainerLayout>

      {consciousness == YES && (
        <>
          <FormFieldContainerLayout last={true} title="Blood Glucose and GCS">
            <FieldsContainer mr="1ch">
              <TextInputField
                sx={{ width: "100%" }}
                name={ConsciousnessFormConfig.bloodGlucose.name}
                label={ConsciousnessFormConfig.bloodGlucose.label}
                id={ConsciousnessFormConfig.bloodGlucose.name}
                disabled={true}
                // disabled={disableField(ConsciousnessFormConfig.bloodGlucose.name)}
              />
              <TextInputField
                sx={{ width: "100%" }}
                name={ConsciousnessFormConfig.gcs.name}
                label={ConsciousnessFormConfig.gcs.label}
                id={ConsciousnessFormConfig.gcs.name}
                getValue={checkGcs}
                disabled={true}
                // disabled={disableField(ConsciousnessFormConfig.gcs.name)}
              />
            </FieldsContainer>
          </FormFieldContainerLayout>
        </>
      )}

      <WrapperBox>
        <MainButton
          sx={{ m: 0.5 }}
          title={"previous"}
          variant="secondary"
          type="button"
          onClick={previous}
        />
        <MainButton
          sx={{ m: 0.5 }}
          title={"next"}
          type="submit"
          onClick={() => {}}
        />
      </WrapperBox>
    </FormikInit>
  );
};
