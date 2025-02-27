import { useConditions, useNavigation } from "@/hooks";

import React, { useContext, useState } from "react";
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
import { getInitialValues, mapSubmissionToCodedArray, notify } from "@/helpers";
import { NO, YES, concepts } from "@/constants";
import { TriageContext, TriageContextType } from "@/contexts";

export const BloodFormConfig = {
  isCirculationAbnormal: {
    name: concepts.IS_CIRCULATION_ABNORMAL,
    label: "Is Circulation Abnormal",
    coded: true,
  },
  // heartRate: {
  //   name: concepts.HEART_RATE_50_120,
  //   label: "Heart Rate <50 >120 or Systolic Blood Pressure <70 >180",
  // },
  weakIrregularPulse: {
    name: concepts.WEAK_THREADY,
    label: "Weak, Thready, Bounding or regular/irregular pulse",
  },

  heartRate: {
    name: concepts.HEART_RATE,
    label: "Heart Rate",
  },
  pulseRate: {
    name: concepts.PULSE_RATE,
    label: "Pulse Rate",
  },
  reducedUrinaryOutput: {
    name: concepts.REDUCED_URINARY_OUTPUT,
    label: "Reduced urinary output < 30ml/hr",
    coded: true,
  },
  clammyPeripherals: {
    name: concepts.CAPILLARY_REFILL,
    label: "Cool clammy peripherals or cap refill > 4 seconds",
    coded: true,
  },
  hemorrhage: {
    name: concepts.HEMORRHAGE,
    label: "Hemorrhage",
    coded: true,
  },
  dehydration: {
    name: concepts.DEHYDRATION_SKIN,
    label: "Dehydration skin turgor, sunken eyes",
    coded: true,
  },
  // heartRate5060: {
  //   name: concepts.HEART_RATE_50,
  //   label: "Heart Rate <50, >60 or  100-110",
  // },
  // temperature3738: {
  //   name: concepts.TEMPERATURE,
  //   label: "Temperature 37-38C",
  // },
};

const schema = Yup.object().shape({
  [BloodFormConfig.isCirculationAbnormal.name]: Yup.string()
    .required()
    .label(BloodFormConfig.isCirculationAbnormal.label),
  [BloodFormConfig.heartRate.name]: Yup.string().label(
    BloodFormConfig.heartRate.label
  ),
  [BloodFormConfig.pulseRate.name]: Yup.string().label(
    BloodFormConfig.pulseRate.label
  ),
  [BloodFormConfig.weakIrregularPulse.name]: Yup.string().label(
    BloodFormConfig.weakIrregularPulse.label
  ),
  [BloodFormConfig.reducedUrinaryOutput.name]: Yup.string().label(
    BloodFormConfig.reducedUrinaryOutput.label
  ),
  [BloodFormConfig.clammyPeripherals.name]: Yup.string().label(
    BloodFormConfig.clammyPeripherals.label
  ),
  // [BloodFormConfig.temperature.name]: Yup.string().label(BloodFormConfig.temperature.label),
  [BloodFormConfig.hemorrhage.name]: Yup.string().label(
    BloodFormConfig.hemorrhage.label
  ),
  [BloodFormConfig.dehydration.name]: Yup.string().label(
    BloodFormConfig.dehydration.label
  ),
  // [BloodFormConfig.temperature3738.name]: Yup.string().label(BloodFormConfig.temperature3738.label),
  // [BloodFormConfig.heartRate5060.name]: Yup.string().label(BloodFormConfig.heartRate5060.label),
});

const initialValues = getInitialValues(BloodFormConfig);
type Prop = {
  onSubmit: (values: any) => void;
  setTriageResult: (triage: any, name: string) => void;
  triageResult: string;
  continueTriage: boolean;
  previous: () => void;
  getFormValues: (values: any) => void;
};

const options = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

export const BloodCirculationForm = ({
  onSubmit,
  triageResult,
  continueTriage,
  previous,
  setTriageResult,
  getFormValues,
}: Prop) => {
  const [isCirculationAbnormal, setIsCirculationAbnormal] = useState("");
  const [formValues, setFormValues] = useState<any>({});
  const { updateConditions, aggregateOrCondition, conditions } =
    useConditions();

  const { flow } = useContext(TriageContext) as TriageContextType;
  const { navigateTo } = useNavigation();

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

  const circulationCondition =
    flow["heart"] == "yellow" ||
    flow["heart"] == "red" ||
    flow["diastolic"] == "yellow" ||
    flow["diastolic"] == "red" ||
    flow["systolic"] == "yellow" ||
    flow["systolic"] == "red";

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{
        ...initialValues,
        [BloodFormConfig.isCirculationAbnormal.name]: circulationCondition
          ? YES
          : NO,
      }}
      enableReinitialize={true}
      submitButtonText="next"
      submitButton={false}
      onSubmit={(values) =>
        onSubmit(mapSubmissionToCodedArray(BloodFormConfig, values))
      }
      getFormValues={(value) =>
        getFormValues(mapSubmissionToCodedArray(BloodFormConfig, value))
      }
    >
      <FormValuesListener getValues={setFormValues} />

      <FormFieldContainerLayout
        last={isCirculationAbnormal != YES}
        title="Circulation"
      >
        <RadioGroupInput
          name={BloodFormConfig.isCirculationAbnormal.name}
          label={BloodFormConfig.isCirculationAbnormal.label}
          options={options}
          getValue={(value) => setIsCirculationAbnormal(value)}
          disabled={disableField(BloodFormConfig.isCirculationAbnormal.name)}
        />
      </FormFieldContainerLayout>
      <br />
      {isCirculationAbnormal == YES && (
        <>
          <FormFieldContainerLayout title="Heart Rate and Pulse">
            <FieldsContainer>
              {/* <RadioGroupInput
                name={BloodFormConfig.heartRate.name}
                label={BloodFormConfig.heartRate.label}
                options={options}
                disabled={disableField(BloodFormConfig.heartRate.name)}
                getValue={(value) =>
                  updateConditions(BloodFormConfig.heartRate.name, value)
                }
              /> */}
              <RadioGroupInput
                name={BloodFormConfig.heartRate.name}
                label={BloodFormConfig.heartRate.label}
                options={[
                  { label: "Weak/Thready", value: "Weak/Thready" },
                  { label: "Strong", value: "Strong" },
                ]}
                disabled={disableField(BloodFormConfig.heartRate.name)}
                getValue={(value) =>
                  updateConditions(BloodFormConfig.heartRate.name, value)
                }
              />
              <RadioGroupInput
                name={BloodFormConfig.pulseRate.name}
                label={BloodFormConfig.pulseRate.label}
                options={[
                  { label: "Irregular", value: "Irregular" },
                  { label: "Regular", value: "Regular" },
                ]}
                disabled={disableField(BloodFormConfig.pulseRate.name)}
                getValue={(value) =>
                  updateConditions(BloodFormConfig.pulseRate.name, value)
                }
              />
            </FieldsContainer>
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Reduced Urinary and Clammy Peripherals">
            <FieldsContainer>
              <RadioGroupInput
                disabled={disableField(
                  BloodFormConfig.reducedUrinaryOutput.name
                )}
                name={BloodFormConfig.reducedUrinaryOutput.name}
                label={BloodFormConfig.reducedUrinaryOutput.label}
                options={options}
                getValue={(value) => {
                  updateConditions(
                    BloodFormConfig.reducedUrinaryOutput.name,
                    value
                  );
                  handleTriage(
                    BloodFormConfig.reducedUrinaryOutput.name,
                    value
                  );
                }}
              />
              <RadioGroupInput
                disabled={disableField(BloodFormConfig.clammyPeripherals.name)}
                name={BloodFormConfig.clammyPeripherals.name}
                label={BloodFormConfig.clammyPeripherals.label}
                options={options}
                getValue={(value) => {
                  updateConditions(
                    BloodFormConfig.clammyPeripherals.name,
                    value
                  );
                  handleTriage(BloodFormConfig.clammyPeripherals.name, value);
                }}
              />
            </FieldsContainer>
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Hemorrhage and Skin Turgor">
            <FieldsContainer>
              {/* <RadioGroupInput
              disabled={disableField(BloodFormConfig.temperature.name)}
              name={BloodFormConfig.temperature.name}
              label={BloodFormConfig.temperature.label}
              options={options}
              getValue={(value) =>
                updateConditions(BloodFormConfig.temperature.name, value)
              }
            /> */}
              <RadioGroupInput
                disabled={disableField(BloodFormConfig.hemorrhage.name)}
                name={BloodFormConfig.hemorrhage.name}
                label={BloodFormConfig.hemorrhage.label}
                options={options}
                getValue={(value) => {
                  updateConditions(BloodFormConfig.hemorrhage.name, value);
                  handleTriage(BloodFormConfig.hemorrhage.name, value);
                }}
              />
              <RadioGroupInput
                disabled={disableField(BloodFormConfig.dehydration.name)}
                name={BloodFormConfig.dehydration.name}
                label={BloodFormConfig.dehydration.label}
                getValue={(value) => {
                  updateConditions(BloodFormConfig.dehydration.name, value);
                  handleTriage(BloodFormConfig.dehydration.name, value);
                }}
                options={options}
              />
            </FieldsContainer>
          </FormFieldContainerLayout>
          {!aggregateOrCondition && Object.keys(conditions).length == 6 && (
            <>
              {/* <FormFieldContainerLayout
                last={true}
                title="Heart Rate and Temperature"
              >
                <FieldsContainer>
                  <RadioGroupInput
                    disabled={disableField(BloodFormConfig.heartRate5060.name)}
                    name={BloodFormConfig.heartRate5060.name}
                    label={BloodFormConfig.heartRate5060.label}
                    options={options}
                  />
                  <RadioGroupInput
                    disabled={disableField(BloodFormConfig.temperature3738.name)}
                    name={BloodFormConfig.temperature3738.name}
                    label={BloodFormConfig.temperature3738.label}
                    options={options}
                  />
                </FieldsContainer>
              </FormFieldContainerLayout> */}
            </>
          )}
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
