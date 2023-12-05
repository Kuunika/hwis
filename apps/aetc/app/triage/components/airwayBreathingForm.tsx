"use client";

import React, { useEffect, useState } from "react";
import {
  FieldsContainer,
  FormValuesListener,
  FormikInit,
  RadioGroupInput,
} from "shared-ui/src";
import * as Yup from "yup";
import { TriageContainer } from "./triageResultContainers";
import { useConditions } from "@/hooks";

const form = {
  airway: {
    name: "airway",
    label: "is Airway Compromised",
  },
  breathing: {
    name: "breathing",
    label: "is Breathing Normal",
  },
  oxygenStats: {
    name: "oxygenStats",
    label: "Oxygen Stats < 89",
  },
  respiratoryRate: {
    name: "respiratoryRate",
    label: "Respiratory Rate <8 or > 31",
  },
  respiratoryDysfunction: {
    name: "respiratoryDysfunction",
    label: "Severe Respiratory dysfunction or exhaustion ",
  },
  inabilityToSpeak: {
    name: "inabilityToSpeak",
    label: "Inability to speak in complete sentences ",
  },
  stridor: {
    name: "stridor",
    label: "Stridor ",
  },
  reducedLevelOfConsciousness: {
    name: "reducedLevelOfConsciousness",
    label: "Reduced Level of Consciousness due to low oxygen ",
  },
  oxygenSats9092: {
    name: "oxygenSats9092",
    label: "Oxygen Sats 90-92%",
  },
  respiratoryRate92130: {
    name: "respiratoryRate92130",
    label: "Respiratory Rate > 9 or 21-30",
  },
};

const schema = Yup.object().shape({
  [form.airway.name]: Yup.string().required().label(form.airway.label),
  [form.breathing.name]: Yup.string().required().label(form.breathing.label),
  [form.oxygenStats.name]: Yup.string().label(form.oxygenStats.label),
  [form.respiratoryRate.name]: Yup.string().label(form.respiratoryRate.label),
  [form.respiratoryDysfunction.name]: Yup.string().label(
    form.respiratoryDysfunction.label
  ),
  [form.stridor.name]: Yup.string().label(form.stridor.label),
  [form.reducedLevelOfConsciousness.name]: Yup.string().label(
    form.reducedLevelOfConsciousness.label
  ),
});
const initialValues = {
  airway: "",
  breathing: "",
};

type Prop = {
  onSubmit: (values: any) => void;
};

const radioOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

export const AirwayAndBreathingForm = ({ onSubmit }: Prop) => {
  const [isBreathingAbnormal, setIsBreathingAbnormal] = useState("false");
  const [triageMessage, setTriageMessage] = useState("");
  const [formValues, setFormValues] = useState<any>({});
  const {
    conditions,
    updateConditions,
    aggregateOrCondition,
    setTriageResult,
    triageResult,
  } = useConditions();

  const [finalCondition, setFinalCondition] = useState(false);

  useEffect(() => {
    const cond = !aggregateOrCondition && Object.keys(conditions).length == 6;
    setFinalCondition(cond);

    if (cond) {
      setTriageResult("yellow");
    }
  }, [conditions]);

  const handleIsAirWayCompromised = (value: string) => {
    if (value == "true") {
      setTriageResult("red");
      setTriageMessage("Interventions as necessary");
      return;
    }
    setTriageResult("");
  };

  const disableField = (formField: string) => {
    return triageResult === "red" && !Boolean(formValues[formField]);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      {triageResult && (
        <>
          <TriageContainer result={triageResult} message={triageMessage} />
          <br />
        </>
      )}
      <FormValuesListener getValues={setFormValues} />
      <FieldsContainer sx={{ width: "100%" }}>
        <RadioGroupInput
          name={form.airway.name}
          label={form.airway.label}
          getValue={handleIsAirWayCompromised}
          options={radioOptions}
          disabled={disableField(form.airway.name)}
        />

        <RadioGroupInput
          name={form.breathing.name}
          label={form.breathing.label}
          getValue={(value) => setIsBreathingAbnormal(value)}
          options={radioOptions}
          disabled={disableField(form.breathing.name)}
        />
      </FieldsContainer>

      {/* breathing abnormal yes */}

      {isBreathingAbnormal == "true" && (
        <>
          <FieldsContainer>
            <RadioGroupInput
              name={form.oxygenStats.name}
              label={form.oxygenStats.label}
              disabled={disableField(form.oxygenStats.name)}
              getValue={(value) => {
                updateConditions(form.oxygenStats.name, value);
              }}
              options={radioOptions}
            />
            <RadioGroupInput
              name={form.respiratoryRate.name}
              label={form.respiratoryRate.label}
              disabled={disableField(form.respiratoryRate.name)}
              getValue={(value) => {
                updateConditions(form.respiratoryRate.name, value);
              }}
              options={radioOptions}
            />
          </FieldsContainer>

          <FieldsContainer>
            <RadioGroupInput
              name={form.respiratoryDysfunction.name}
              disabled={disableField(form.respiratoryDysfunction.name)}
              label={form.respiratoryDysfunction.label}
              getValue={(value) => {
                updateConditions(form.respiratoryDysfunction.name, value);
              }}
              options={radioOptions}
            />
            <RadioGroupInput
              name={form.inabilityToSpeak.name}
              label={form.inabilityToSpeak.label}
              disabled={disableField(form.inabilityToSpeak.name)}
              options={radioOptions}
              getValue={(value) => {
                updateConditions(form.inabilityToSpeak.name, value);
              }}
            />
          </FieldsContainer>
          <FieldsContainer>
            <RadioGroupInput
              name={form.stridor.name}
              label={form.stridor.label}
              disabled={disableField(form.stridor.name)}
              options={radioOptions}
              getValue={(value) => {
                updateConditions(form.stridor.name, value);
              }}
            />
            <RadioGroupInput
              name={form.reducedLevelOfConsciousness.name}
              label={form.reducedLevelOfConsciousness.label}
              disabled={disableField(form.reducedLevelOfConsciousness.name)}
              getValue={(value) => {
                updateConditions(form.reducedLevelOfConsciousness.name, value);
              }}
              options={radioOptions}
            />
          </FieldsContainer>
        </>
      )}

      {finalCondition && (
        <FieldsContainer>
          <RadioGroupInput
            name={form.oxygenSats9092.name}
            label={form.oxygenSats9092.label}
            disabled={disableField(form.oxygenSats9092.name)}
            options={radioOptions}
          />
          <RadioGroupInput
            name={form.respiratoryRate92130.name}
            label={form.respiratoryRate92130.label}
            disabled={disableField(form.respiratoryRate92130.name)}
            options={radioOptions}
          />
        </FieldsContainer>
      )}

      <br />
    </FormikInit>
  );
};
