import { useNavigation } from "@/hooks";
import { useContext, useEffect, useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainButton,
  SearchComboBox,
  SelectInputField,
  TextInputField,
  UnitInputField,
  WrapperBox,
} from "@/components";
import * as Yup from "yup";
import { getInitialValues } from "@/helpers";
import { concepts } from "@/constants";
import { KeyValueContext, KeyValueContextType } from "@/contexts/keyValueContext";
import { LiaSyringeSolid } from "react-icons/lia";


type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

export const ObservationFormConfig = {
  oxygenSaturation: {
    name: concepts.SATURATION_RATE,
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
    name: concepts.BLOOD_GLUCOSE,
    label: "Random Blood Glucose (RBG)",
  },
  urineDipstickKetones: {
    name: concepts.URINE_DIPSTICK_KETONES,
    label: "Urine Dipstick - Ketones",
  },
  avpu: {
    name: concepts.AVPU,
    label: "AVPU Scale",
  },
  pefr: {
    name: concepts.PEAK_EXPIRATORY_FLOW_RATE,
    label: "Peak Expiratory Flow Rate (PEFR)",
  },
  triageScore: {
    name: concepts.TRIAGE_RESULT,
    label: "Triage Score",
  },
  units: {
    name: concepts.ADDITIONAL_NOTES, // change concept
    label: "Units",
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
  [ObservationFormConfig.units.name]: Yup.string().label(ObservationFormConfig.units.label),
});

const initialValues = getInitialValues(ObservationFormConfig);

export const ObservationsForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const { navigateTo } = useNavigation();
  const { flow, addKeyToFlow} = useContext(KeyValueContext) as KeyValueContextType;
  const [caseType, setCaseType] = useState<string>("Default");


  const handleSubmit = (values: any) => {
    const triageScore = caseType;
    formValues[ObservationFormConfig.triageScore.name] = triageScore;
    onSubmit(formValues);
  };

  const avpuLists = [
    { id: "Alert", label: "Alert" },
    { id: "Verbal", label: "Verbal" },
    { id: "Pain", label: "Pain" },
    { id: "Unresponsive", label: "Unresponsive" },
  ];

  const traigeScores =[
    "Emergency", "Priority", "Queue"
  ]

  const rules = {
    [ObservationFormConfig.temperature.name]: [
      { operator: "<", value: 34, result: traigeScores[0], bound: 0 },
      {
        operator: ">",
        value: 39.9,
        result: traigeScores[0],
        bound: 100,
      },
      {
        operator: "combined",
        operator1: ">=",
        value: 37.5,
        operator2: "<=",
        value2: 39.9,
        result: traigeScores[1],
        bound: 0,
      },
      {
        operator: "combined",
        operator1: ">=",
        value: 34.1,
        operator2: "<=",
        value2: 35.4,
        result: traigeScores[1],
        bound: 0,
      },
      {
        operator: "combined",
        operator1: ">=",
        value: 35.5,
        operator2: "<=",
        value2: 37.4,
        result: traigeScores[2],
        bound: 0,
      }],[ObservationFormConfig.respiratoryRate.name]:[
        { operator: ">", value: 30, result: traigeScores[0], bound: 100 },
        { operator: "<", value: 8, result: traigeScores[0], bound: 0 },
        {
          operator: "combined",
          operator1: ">=",
          value: 21,
          operator2: "<=",
          value2: 30,
          result: traigeScores[1],
          bound: 0,
        },
        {
          operator: "combined",
          operator1: ">=",
          value: 8,
          operator2: "<=",
          value2: 11,
          result: traigeScores[1],
          bound: 0,
        },
        {
          operator: "combined",
          operator1: ">=",
          value: 12,
          operator2: "<=",
          value2: 20,
          result:  traigeScores[2],
          bound: 0,
        },
      ]};



  
  const calculateTriageScore = (value: any, type: string) => {
    let score = traigeScores[2];
  
    // Parse numerical value
    const numericalValue = parseFloat(value) || 0;
    switch (type) {
      case ObservationFormConfig.oxygenSaturation.name:
        if (numericalValue < 90) {
          score = traigeScores[0];
        } 
        if (numericalValue >= 90 && numericalValue  < 94) {
          score = traigeScores[1];
        } 
        if (numericalValue >= 94) {
          score = traigeScores[2];
        }
        break;
  
      case ObservationFormConfig.heartRate.name:
        if (numericalValue < 40 || numericalValue > 129) {
          score = traigeScores[0];
        } 
        if ((numericalValue >= 40 && numericalValue <= 59) || (numericalValue >= 101 && numericalValue <= 129)) {
          score = traigeScores[1];
        } 
        if (numericalValue >= 60 && numericalValue <= 100){
          score = traigeScores[2];
        } 
        break;
  
      case ObservationFormConfig.bloodPressureSystolic.name:
        if (numericalValue > 200 || numericalValue < 80) {
          return score = traigeScores[0];
        } 
        if ((numericalValue >= 80 && numericalValue <= 89) || (numericalValue >= 150 && numericalValue <= 200)) {
          return score = traigeScores[1];
        } 
        if (numericalValue >= 90 || (numericalValue > 89 && numericalValue <= 149)){
          return score = traigeScores[2];
        }
        break;
  
      case ObservationFormConfig.bloodPressureDiastolic.name:
        if (numericalValue > 119) {
          score = traigeScores[0];
        } 
        if (numericalValue >= 100 && numericalValue <= 119) {
          score = traigeScores[1];
        } 
        if (numericalValue < 100) {
          score = traigeScores[2];
        } 
        break;
  
      case ObservationFormConfig.respiratoryRate.name:
      for (const bound of rules[ObservationFormConfig.respiratoryRate.name]) {
        if (bound.operator === ">" && numericalValue > bound.value) {
            score = bound.result;
            break;
        }

        if (bound.operator === "<" && numericalValue < bound.value) {
            score = bound.result;
            break;
        }

        if (
            bound.operator === "combined" &&
            typeof bound.value2 !== "undefined" && 
            numericalValue >= bound.value &&
            numericalValue <= bound.value2
        ) {
            score = bound.result;
            break;
        }
    }
    break;
  
      case ObservationFormConfig.temperature.name:
        for (const bound of rules[ObservationFormConfig.temperature.name]) {
          if (bound.operator === ">" && numericalValue > bound.value) {
              score = bound.result;
              break;
          }
  
          if (bound.operator === "<" && numericalValue < bound.value) {
              score = bound.result;
              break;
          }
  
          if (
              bound.operator === "combined" &&
              typeof bound.value2 !== "undefined" && 
              numericalValue >= bound.value &&
              numericalValue <= bound.value2
          ) {
              score = bound.result;
              break;
          }
      }
      break;
  
      case ObservationFormConfig.randomBloodGlucose.name:
        const m = 18.018; //multiplicationFactor
        const units = formValues[ObservationFormConfig.units.name];
        if(units)
        {
        if (units == "mg/dl") {
        if (numericalValue < 3 * m || numericalValue > 30 * m) {
          score = traigeScores[0];
        } else if ((numericalValue >= 3.1 * m && numericalValue <= 3.8 * m) || (numericalValue > 11.1 * m && numericalValue <= 29.9 * m)) {
          score = traigeScores[1];
        } else if (numericalValue >= 3.9 * m && numericalValue <= 11.1 * m) {
          score = traigeScores[2];
        } }
        if (units == "mmol/l") {
          if (numericalValue < 3 || numericalValue > 30) {
            score = traigeScores[0];
                }
          if ((numericalValue >= 3.1 && numericalValue <= 3.8) || (numericalValue > 11.1 && numericalValue <= 29.9)) {
            score = traigeScores[1];
                }
          if (numericalValue >= 3.9 && numericalValue <= 11.1) {
            score = traigeScores[2];
                }
              }
        }
        break;
  
      default:
        score = "Green";
    }
  
    return score;
  };
  
  
  

  const getBackgroundColor = (caseType: string) => {
    switch (caseType) {
      case traigeScores[0]:
        return "#FECDCA";
      case traigeScores[1]:
        return "#FEDF89";
      case traigeScores[2]:
        return "#DDEEDD";
      default:
        return "#FFFFFF"; // Default color
    }
  };

  useEffect(() => {
    let maxScore = "No Score"; // Initialize with the default value
    let newScores: Record<string, string> = {};

    Object.keys(flow).forEach((key) => {
      const value = flow[key];
      if (value) {
        const score = calculateTriageScore(value, key);
        newScores[key] = score;
        maxScore = score;
      }

      for (const key in newScores) {
        if (newScores.hasOwnProperty(key)) {
          if(newScores[key] == traigeScores[0])
            maxScore = traigeScores[0]

          if(newScores[key] == traigeScores[1] && maxScore !== traigeScores[0])
            maxScore = traigeScores[1]

        }}

        
    });
    setCaseType(maxScore);
  }, [flow]);

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
      <div style={{
          width: "100%",
          height: "20px",
          marginTop: "20px",
          marginBottom: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "#000",
        }}>
        <p>Triage Score</p>
      <div
        style={{
          backgroundColor: getBackgroundColor(caseType),
          width: "100%",
          height: "50px",
          marginLeft: "300px",
          marginRight: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
          
        }}
      >
        {caseType.charAt(0).toUpperCase() + caseType.slice(1)}
      </div>
      </div>

        <FieldsContainer >
          <TextInputField
            name={ObservationFormConfig.oxygenSaturation.name}
            label={ObservationFormConfig.oxygenSaturation.label}
            id={ObservationFormConfig.oxygenSaturation.name}
            unitOfMeasure="%"
            handleBlurEvent={(value) => addKeyToFlow({ [ObservationFormConfig.oxygenSaturation.name]: value })}
          />
          <TextInputField
            name={ObservationFormConfig.respiratoryRate.name}
            label={ObservationFormConfig.respiratoryRate.label}
            id={ObservationFormConfig.respiratoryRate.name}
            unitOfMeasure="bs/m"
            handleBlurEvent={(value) => addKeyToFlow({ [ObservationFormConfig.respiratoryRate.name]: value })}
          />
        </FieldsContainer>
          <TextInputField
            name={ObservationFormConfig.heartRate.name}
            label={ObservationFormConfig.heartRate.label}
            id={ObservationFormConfig.heartRate.name}
            handleBlurEvent={(value) => addKeyToFlow({ [ObservationFormConfig.heartRate.name]: value })}
            unitOfMeasure="bpm"
          />

          <FieldsContainer sx={{mt:"2ch"}}>
          <TextInputField
            name={ObservationFormConfig.bloodPressureSystolic.name}
            label={ObservationFormConfig.bloodPressureSystolic.label}
            id={ObservationFormConfig.bloodPressureSystolic.name}
            handleBlurEvent={(value) => addKeyToFlow({ [ObservationFormConfig.bloodPressureSystolic.name]: value })}
            unitOfMeasure="mmHg"
          />
          <TextInputField
            name={ObservationFormConfig.bloodPressureDiastolic.name}
            label={ObservationFormConfig.bloodPressureDiastolic.label}
            id={ObservationFormConfig.bloodPressureDiastolic.name}
            handleBlurEvent={(value) => addKeyToFlow({ [ObservationFormConfig.bloodPressureDiastolic.name]: value })}
            unitOfMeasure="mmHg"
          />
          </FieldsContainer>

          <TextInputField
            name={ObservationFormConfig.temperature.name}
            label={ObservationFormConfig.temperature.label}
            id={ObservationFormConfig.temperature.name}
            handleBlurEvent={(value) => addKeyToFlow({ [ObservationFormConfig.temperature.name]: value })}
            unitOfMeasure="°C"
          />
          
          <FieldsContainer>
   
          <UnitInputField unitOptions={[
               "mmol/l", 
              "mg/dl"
            ]}
            id={ObservationFormConfig.randomBloodGlucose.name}
            label={ObservationFormConfig.randomBloodGlucose.label}
            name={ObservationFormConfig.randomBloodGlucose.name}
            unitName={ObservationFormConfig.units.name}
            placeholder="e.g., 50"
            sx={{ width: "320px" }}
            inputIcon={<LiaSyringeSolid />}
            />
          </FieldsContainer>
          <TextInputField
            name={ObservationFormConfig.urineDipstickKetones.name}
            label={ObservationFormConfig.urineDipstickKetones.label}
            id={ObservationFormConfig.urineDipstickKetones.name}
            handleBlurEvent={(value) => addKeyToFlow({ [ObservationFormConfig.urineDipstickKetones.name]: value })}
          />
          <SearchComboBox
            name={ObservationFormConfig.avpu.name}
            options={avpuLists}
            label={ObservationFormConfig.avpu.label}
            sx={{ my: "1ch" }}
            multiple={false}
            disabled={false}
            getValue={(value) => addKeyToFlow({ [ObservationFormConfig.avpu.name]: value })}
          />
          <TextInputField
            name={ObservationFormConfig.pefr.name}
            label={ObservationFormConfig.pefr.label}
            id={ObservationFormConfig.pefr.name}
            handleBlurEvent={(value) => addKeyToFlow({ [ObservationFormConfig.pefr.name]: value })}
            unitOfMeasure="L/min"
          />
        
  

      <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit}/>
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
      </WrapperBox>
    </FormikInit>
  );
};

