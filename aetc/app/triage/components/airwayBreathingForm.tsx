"use client";

import React, { useEffect, useState } from "react";
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

import { useConditions } from "@/hooks";
import { getInitialValues } from "@/helpers";
import { NO, YES, concepts } from "@/constants";

export const AirwayBreathingForm = {
  airway: {
    name: concepts.IS_AIRWAY_COMPROMISED,
    label: "is Airway Compromised",
  },
  breathing: {
    name: concepts.IS_BREATHING_ABNORMAL,
    label: "is Breathing Abnormal",
  },
  respiratoryDysfunction: {
    name: concepts.SEVERE_RESPIRATORY,
    label: "Severe Respiratory dysfunction or exhaustion ",
  },
  inabilityToSpeak: {
    name: concepts.INABILITY_TO_SPEAK,
    label: "Inability to speak in complete sentences ",
  },
  stridor: {
    name: concepts.STRIDOR,
    label: "Stridor",
  },
  reducedLevelOfConsciousness: {
    name: concepts.REDUCED_LEVEL_CONSCIOUSNESS,
    label: "Reduced Level of Consciousness due to low oxygen ",
  },
};

const schema = Yup.object().shape({
  [AirwayBreathingForm.airway.name]: Yup.string()
    .required()
    .label(AirwayBreathingForm.airway.label),
  [AirwayBreathingForm.breathing.name]: Yup.string()
    .required()
    .label(AirwayBreathingForm.breathing.label),
  [AirwayBreathingForm.respiratoryDysfunction.name]: Yup.string().label(
    AirwayBreathingForm.respiratoryDysfunction.label
  ),
  [AirwayBreathingForm.stridor.name]: Yup.string().label(
    AirwayBreathingForm.stridor.label
  ),
  [AirwayBreathingForm.reducedLevelOfConsciousness.name]: Yup.string().label(
    AirwayBreathingForm.reducedLevelOfConsciousness.label
  ),
});
const initialValues = getInitialValues(AirwayBreathingForm);

type Prop = {
  onSubmit: (values: any) => void;
  setTriageResult: (triage: any, name: string) => void;
  triageResult: string;
  continueTriage: boolean;
  previous: () => void;
  getFormValues: (values: any) => void;
};

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

export const AirwayAndBreathingForm = ({
  onSubmit,
  triageResult,
  setTriageResult,
  continueTriage,
  previous,
  getFormValues,
}: Prop) => {
  const [isBreathingAbnormal, setIsBreathingAbnormal] = useState("false");

  const [formValues, setFormValues] = useState<any>({});

  const { conditions, updateConditions, aggregateOrCondition } =
    useConditions();

  const [finalCondition, setFinalCondition] = useState(false);

  useEffect(() => {
    const cond = !aggregateOrCondition && Object.keys(conditions).length == 4;

    setFinalCondition(cond);
  }, [conditions]);

  const handleIsAirWayCompromised = (value: string) => {
    if (value == YES) {
      setTriageResult("red", AirwayBreathingForm.airway.name);
      return;
    }
    setTriageResult("", AirwayBreathingForm.airway.name);
  };

  const disableField = (formField: string) => {
    return (
      triageResult === "red" &&
      !Boolean(formValues[formField]) &&
      !continueTriage
    );
  };

  const handleTriage = (name: string, value: string) => {
    // setTriageResult(value==YES? "red": "",name);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
      submitButton={false}
      getFormValues={getFormValues}
    >
      <FormValuesListener getValues={setFormValues} />

      <FormFieldContainerLayout
        last={isBreathingAbnormal != YES}
        title="Airway and Breathing"
      >
        <FieldsContainer sx={{ width: "100%" }}>
          <RadioGroupInput
            name={AirwayBreathingForm.airway.name}
            label={AirwayBreathingForm.airway.label}
            getValue={handleIsAirWayCompromised}
            options={radioOptions}
            disabled={disableField(AirwayBreathingForm.airway.name)}
          />

          <RadioGroupInput
            name={AirwayBreathingForm.breathing.name}
            label={AirwayBreathingForm.breathing.label}
            getValue={(value) => setIsBreathingAbnormal(value)}
            options={radioOptions}
            disabled={disableField(AirwayBreathingForm.breathing.name)}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>

      {/* breathing abnormal yes */}

      {isBreathingAbnormal == YES && (
        <>
          {/* <FormFieldContainerLayout title="Oxygen and Respiratory">
            <FieldsContainer>
              <RadioGroupInput
                name={AirwayBreathingForm.oxygenStats.name}
                label={AirwayBreathingForm.oxygenStats.label}
                disabled={disableField(AirwayBreathingForm.oxygenStats.name)}
                getValue={(value) => {
                  updateConditions(AirwayBreathingForm.oxygenStats.name, value);
                }}
                options={radioOptions}
              />
              <RadioGroupInput
                name={AirwayBreathingForm.respiratoryRate.name}
                label={AirwayBreathingForm.respiratoryRate.label}
                disabled={disableField(AirwayBreathingForm.respiratoryRate.name)}
                getValue={(value) => {
                  updateConditions(AirwayBreathingForm.respiratoryRate.name, value);
                }}
                options={radioOptions}
              />
            </FieldsContainer>
          </FormFieldContainerLayout> */}

          <FormFieldContainerLayout title="Exhaustion and Inability to Speak">
            <FieldsContainer>
              <RadioGroupInput
                name={AirwayBreathingForm.respiratoryDysfunction.name}
                disabled={disableField(
                  AirwayBreathingForm.respiratoryDysfunction.name
                )}
                label={AirwayBreathingForm.respiratoryDysfunction.label}
                getValue={(value) => {
                  updateConditions(
                    AirwayBreathingForm.respiratoryDysfunction.name,
                    value
                  );
                  handleTriage(
                    AirwayBreathingForm.respiratoryDysfunction.name,
                    value
                  );
                }}
                options={radioOptions}
              />
              <RadioGroupInput
                name={AirwayBreathingForm.inabilityToSpeak.name}
                label={AirwayBreathingForm.inabilityToSpeak.label}
                disabled={disableField(
                  AirwayBreathingForm.inabilityToSpeak.name
                )}
                options={radioOptions}
                getValue={(value) => {
                  updateConditions(
                    AirwayBreathingForm.inabilityToSpeak.name,
                    value
                  );
                  handleTriage(
                    AirwayBreathingForm.inabilityToSpeak.name,
                    value
                  );
                }}
              />
            </FieldsContainer>
          </FormFieldContainerLayout>

          <FormFieldContainerLayout title="Stridor and Reduced Consciousness">
            <FieldsContainer>
              <RadioGroupInput
                name={AirwayBreathingForm.stridor.name}
                label={AirwayBreathingForm.stridor.label}
                disabled={disableField(AirwayBreathingForm.stridor.name)}
                options={radioOptions}
                getValue={(value) => {
                  updateConditions(AirwayBreathingForm.stridor.name, value);
                  handleTriage(AirwayBreathingForm.stridor.name, value);
                }}
              />
              <RadioGroupInput
                name={AirwayBreathingForm.reducedLevelOfConsciousness.name}
                label={AirwayBreathingForm.reducedLevelOfConsciousness.label}
                disabled={disableField(
                  AirwayBreathingForm.reducedLevelOfConsciousness.name
                )}
                getValue={(value) => {
                  updateConditions(
                    AirwayBreathingForm.reducedLevelOfConsciousness.name,
                    value
                  );
                  handleTriage(
                    AirwayBreathingForm.reducedLevelOfConsciousness.name,
                    value
                  );
                }}
                options={radioOptions}
              />
            </FieldsContainer>
          </FormFieldContainerLayout>
        </>
      )}

      {/* {finalCondition && (
        <FormFieldContainerLayout
          last={true}
          title="Oxygen Stats & Respiratory"
        >
          <FieldsContainer>
            <RadioGroupInput
              name={AirwayBreathingForm.oxygenSats9092.name}
              label={AirwayBreathingForm.oxygenSats9092.label}
              disabled={disableField(AirwayBreathingForm.oxygenSats9092.name)}
              options={radioOptions}
            />
            <RadioGroupInput
              name={AirwayBreathingForm.respiratoryRate92130.name}
              label={AirwayBreathingForm.respiratoryRate92130.label}
              disabled={disableField(AirwayBreathingForm.respiratoryRate92130.name)}
              options={radioOptions}
            />
          </FieldsContainer>
        </FormFieldContainerLayout>
      )} */}
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
