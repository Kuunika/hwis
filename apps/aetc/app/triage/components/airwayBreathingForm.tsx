"use client";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldsContainer, FormikInit, RadioGroupInput } from "shared-ui/src";
import * as Yup from "yup";
import { TriageContainer } from "./triageResultContainers";

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
  const [triageResult, setTriageResult] = useState<"" | "yellow" | "red">("");
  const [triageMessage, setTriageMessage] = useState("");
  const [breathingAbnormalConditions, setBreathingAbnormalConditions] =
    useState<any>({});
  const [finalCondition, setFinalCondition] = useState(false);

  const updateAbnormalConditions = (prop: string, formValue: string) => {
    if (formValue == undefined) {
      return;
    }
    setBreathingAbnormalConditions((values: any) => {
      return { ...values, [prop]: formValue == "true" };
    });
  };

  useEffect(() => {
    const conditions = Object.keys(breathingAbnormalConditions);

    const breathingNormalFalseCondition = conditions.reduce(
      (acc, currentValue) => {
        return acc || breathingAbnormalConditions[currentValue];
      },
      false
    );
    if (breathingNormalFalseCondition) {
      setTriageResult("red");
      setTriageMessage("Interventions as necessary");
    } else {
      setTriageResult("");
    }

    const cond = !breathingNormalFalseCondition && conditions.length == 6;
    setFinalCondition(cond);

    if (cond) {
      setTriageResult("yellow");
    }
  }, [breathingAbnormalConditions]);

  const handleIsAirWayCompromised = (value: string) => {
    if (value == "true") {
      setTriageResult("red");
      setTriageMessage("Interventions as necessary");
      return;
    }
    setTriageResult("");
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
      <FieldsContainer sx={{ width: "100%" }}>
        <RadioGroupInput
          name={form.airway.name}
          label={form.airway.label}
          getValue={handleIsAirWayCompromised}
          options={radioOptions}
        />

        <RadioGroupInput
          name={form.breathing.name}
          label={form.breathing.label}
          getValue={(value) => setIsBreathingAbnormal(value)}
          options={radioOptions}
        />
      </FieldsContainer>

      {/* breathing abnormal yes */}

      {isBreathingAbnormal == "true" && (
        <>
          <FieldsContainer>
            <RadioGroupInput
              name={form.oxygenStats.name}
              label={form.oxygenStats.label}
              getValue={(value) => {
                updateAbnormalConditions(form.oxygenStats.name, value);
              }}
              options={radioOptions}
            />
            <RadioGroupInput
              name={form.respiratoryRate.name}
              label={form.respiratoryRate.label}
              getValue={(value) => {
                updateAbnormalConditions(form.respiratoryRate.name, value);
              }}
              options={radioOptions}
            />
          </FieldsContainer>

          <FieldsContainer>
            <RadioGroupInput
              name={form.respiratoryDysfunction.name}
              label={form.respiratoryDysfunction.label}
              getValue={(value) => {
                updateAbnormalConditions(
                  form.respiratoryDysfunction.name,
                  value
                );
              }}
              options={radioOptions}
            />
            <RadioGroupInput
              name={form.inabilityToSpeak.name}
              label={form.inabilityToSpeak.label}
              options={radioOptions}
              getValue={(value) => {
                updateAbnormalConditions(form.inabilityToSpeak.name, value);
              }}
            />
          </FieldsContainer>
          <FieldsContainer>
            <RadioGroupInput
              name={form.stridor.name}
              label={form.stridor.label}
              options={radioOptions}
              getValue={(value) => {
                updateAbnormalConditions(form.stridor.name, value);
              }}
            />
            <RadioGroupInput
              name={form.reducedLevelOfConsciousness.name}
              label={form.reducedLevelOfConsciousness.label}
              getValue={(value) => {
                updateAbnormalConditions(
                  form.reducedLevelOfConsciousness.name,
                  value
                );
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
            options={radioOptions}
          />
          <RadioGroupInput
            name={form.respiratoryRate92130.name}
            label={form.respiratoryRate92130.label}
            options={radioOptions}
          />
        </FieldsContainer>
      )}

      <br />
    </FormikInit>
  );
};
