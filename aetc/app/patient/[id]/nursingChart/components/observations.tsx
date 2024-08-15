import { useConditions, useNavigation } from "@/hooks";
import React, { useContext, useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainButton,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "@/components";
import * as Yup from "yup";
import { getInitialValues } from "@/helpers";
import { concepts } from "@/constants";
import { TriageContext, TriageContextType } from "@/contexts";


type Prop = {
  onSubmit: (values: any) => void;
};

export const ObservationFormConfig = {
  oxygenSaturation: {
    name: concepts.OXYGEN_SATURATION,
    label: "Oxygen Saturation (O2 Sat)",
  },
  heartRate: {
    name: concepts.HEART_RATE,
    label: "Heart Rate (HR)",
  },
  bloodPressureSystolic: {
    name: concepts.BLOOD_PRESSURE_SYSTOLIC,
    label: "Blood Pressure Systolic",
  },
  bloodPressureDiastolic: {
    name: concepts.BLOOD_PRESSURE_DIASTOLIC,
    label: "Blood Pressure Diastolic",
  },
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate (RR)",
  },
  temperature: {
    name: concepts.TEMPERATURE,
    label: "Temperature (Temp)",
  },
  randomBloodGlucose: {
    name: "RANDOM_BLOOD_GLUCOSE",
    label: "Random Blood Glucose (RBG)",
  },
  urineDipstickKetones: {
    name: "URINE_DIPSTICK_KETONES",
    label: "Urine Dipstick - Ketones",
  },
  avpu: {
    name: concepts.AVPU,
    label: "AVPU Scale",
  },
  pefr: {
    name: "PEFR",
    label: "Peak Expiratory Flow Rate (PEFR)",
  },
  triageScore: {
    name: "TRIAGE_SCORE",
    label: "Triage Score",
  },
};


const schema = Yup.object().shape({
  [ObservationFormConfig.oxygenSaturation.name]: Yup.string().label(ObservationFormConfig.oxygenSaturation.label),
  [ObservationFormConfig.heartRate.name]: Yup.string().label(ObservationFormConfig.heartRate.label),
  [ObservationFormConfig.bloodPressureSystolic.name]: Yup.string().label(ObservationFormConfig.bloodPressureSystolic.label),
  [ObservationFormConfig.bloodPressureDiastolic.name]: Yup.string().label(ObservationFormConfig.bloodPressureDiastolic.label),
  [ObservationFormConfig.respiratoryRate.name]: Yup.string().label(ObservationFormConfig.respiratoryRate.label),
  [ObservationFormConfig.temperature.name]: Yup.string().label(ObservationFormConfig.temperature.label),
  [ObservationFormConfig.randomBloodGlucose.name]: Yup.string().label(ObservationFormConfig.randomBloodGlucose.label),
  [ObservationFormConfig.urineDipstickKetones.name]: Yup.string().label(ObservationFormConfig.urineDipstickKetones.label),
  [ObservationFormConfig.avpu.name]: Yup.string().label(ObservationFormConfig.avpu.label),
  [ObservationFormConfig.pefr.name]: Yup.string().label(ObservationFormConfig.pefr.label),
  [ObservationFormConfig.triageScore.name]: Yup.string().label(ObservationFormConfig.triageScore.label),
});

const initialValues = getInitialValues(ObservationFormConfig);

export const ObservationsForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const { updateConditions } = useConditions();
  const { navigateTo } = useNavigation();
  const { flow } = useContext(TriageContext) as TriageContextType;

  const handleSubmit = (values: any) => {
    const triageScore = calculateTriageScore(values);
    // Add the triage score to the form values
    values[ObservationFormConfig.triageScore.name] = triageScore;

    // Call the onSubmit handler with updated values
    onSubmit(values);
  };

  const avpuLists = [
    { id: "Alert", label: "Alert" },
    { id: "Verbal", label: "Verbal" },
    { id: "Pain", label: "Pain" },
    { id: "Unresponsive", label: "Unresponsive" },
  ];

  const calculateTriageScore = (values: any) => {
    let score = "";
  
    // Parse numerical values
    const oxygenSaturation = parseFloat(values[ObservationFormConfig.oxygenSaturation.name]) || 0;
    const heartRate = parseFloat(values[ObservationFormConfig.heartRate.name]) || 0;
    const bloodPressureSystolic = parseFloat(values[ObservationFormConfig.bloodPressureSystolic.name]) || 0;
    const bloodPressureDiastolic = parseFloat(values[ObservationFormConfig.bloodPressureDiastolic.name]) || 0;
    const respiratoryRate = parseFloat(values[ObservationFormConfig.respiratoryRate.name]) || 0;
    const temperature = parseFloat(values[ObservationFormConfig.temperature.name]) || 0;
    const randomBloodGlucose = parseFloat(values[ObservationFormConfig.randomBloodGlucose.name]) || 0;
    const avpu = values[ObservationFormConfig.avpu.name] || '';
  
    // Emergency Criteria
    if (
      heartRate < 40 || heartRate > 130 ||
      bloodPressureSystolic < 80 || bloodPressureDiastolic < 40 ||
      temperature > 40 ||
      respiratoryRate < 10 || respiratoryRate > 24 ||
      avpu === "Pain" || avpu === "Unresponsive" ||
      randomBloodGlucose < 2 || randomBloodGlucose > 20 ||
      oxygenSaturation < 90
    ) {
      score = "Emergency";
    }
    // Priority Criteria
    else if (
      heartRate < 50 || heartRate > 110 ||
      bloodPressureSystolic < 90 || bloodPressureDiastolic < 50 ||
      temperature > 38 ||
      respiratoryRate < 9 || respiratoryRate > 20 ||
      avpu === "Pain" ||
      randomBloodGlucose < 4 || randomBloodGlucose > 10 ||
      oxygenSaturation < 93
    ) {
      score = "Priority";
    }
    // Queue Criteria
    else if (
      heartRate >= 60 && heartRate <= 100 &&
      bloodPressureSystolic >= 90 && bloodPressureDiastolic >= 60 &&
      temperature >= 36.5 && temperature <= 37.5 &&
      respiratoryRate >= 12 && respiratoryRate <= 20 &&
      avpu === "Alert" &&
      randomBloodGlucose >= 4 && randomBloodGlucose <= 7 &&
      oxygenSaturation >= 95
    ) {
      score = "Queue";
    }
    else {
      score = "No score";
    }
  
    return score;
  };
  

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      submitButtonText="Submit"
      submitButton={false}
    >
      <FormValuesListener getValues={setFormValues} />

      <FormFieldContainerLayout title="Observations">
        <FieldsContainer>
          <TextInputField
            name={ObservationFormConfig.oxygenSaturation.name}
            label={ObservationFormConfig.oxygenSaturation.label}
            id={ObservationFormConfig.oxygenSaturation.name}
            unitOfMeasure="%"
          />
          <TextInputField
            name={ObservationFormConfig.respiratoryRate.name}
            label={ObservationFormConfig.respiratoryRate.label}
            id={ObservationFormConfig.respiratoryRate.name}
            unitOfMeasure="bs/m"
          />
        </FieldsContainer>
        <FieldsContainer>
          <TextInputField
            name={ObservationFormConfig.heartRate.name}
            label={ObservationFormConfig.heartRate.label}
            id={ObservationFormConfig.heartRate.name}
          />
          <TextInputField
            name={ObservationFormConfig.bloodPressureSystolic.name}
            label={ObservationFormConfig.bloodPressureSystolic.label}
            id={ObservationFormConfig.bloodPressureSystolic.name}
          />
          <TextInputField
            name={ObservationFormConfig.bloodPressureDiastolic.name}
            label={ObservationFormConfig.bloodPressureDiastolic.label}
            id={ObservationFormConfig.bloodPressureDiastolic.name}
          />
          <TextInputField
            name={ObservationFormConfig.temperature.name}
            label={ObservationFormConfig.temperature.label}
            id={ObservationFormConfig.temperature.name}
          />
          <TextInputField
            name={ObservationFormConfig.randomBloodGlucose.name}
            label={ObservationFormConfig.randomBloodGlucose.label}
            id={ObservationFormConfig.randomBloodGlucose.name}
          />
          <TextInputField
            name={ObservationFormConfig.urineDipstickKetones.name}
            label={ObservationFormConfig.urineDipstickKetones.label}
            id={ObservationFormConfig.urineDipstickKetones.name}
          />
          <SearchComboBox
            name={ObservationFormConfig.avpu.name}
            options={avpuLists}
            label={ObservationFormConfig.avpu.label}
            sx={{ my: "1ch" }}
            multiple={false}
            disabled={false}
          />
          <TextInputField
            name={ObservationFormConfig.pefr.name}
            label={ObservationFormConfig.pefr.label}
            id={ObservationFormConfig.pefr.name}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>

      <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" />
      </WrapperBox>
    </FormikInit>
  );
};