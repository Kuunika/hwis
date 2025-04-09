import {
  CheckboxesGroup,
  FormDatePicker,
  FormFieldContainer,
  FormFieldContainerMultiple,
  FormikInit,
  SearchComboBox,
  TextInputField,
  UnitInputField,
  WrapperBox,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { getInitialValues, getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import {
  getActivePatientDetails,
  useNavigation,
  useSubmitEncounter,
} from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatient } from "@/services/patient";
import { Box, Button, Typography, Paper } from "@mui/material";
import * as Yup from "yup";
import { useState } from "react";
import { ErrorMessage, FieldArray } from "formik";
import DynamicFormList from "@/components/form/dynamicFormList";
import { GiMedicines } from "react-icons/gi";
import { IoTimeOutline } from "react-icons/io5";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import useFetchMedications from "@/hooks/useFetchMedications";
import { MedicationsForm } from "./medication";
import { MedicationsDispensationForm } from "./medicationsDispensation";

const form = {
  subjective: {
    name: concepts.SUBJECTIVE,
    label: "Subjective",
  },
  objective: {
    name: concepts.MEDICAL_RECORD_OBSERVATIONS,
    label: "General observation",
  },
  systolic: {
    name: concepts.SYSTOLIC_BLOOD_PRESSURE,
    label: "Systolic",
  },
  diastolic: {
    name: concepts.DIASTOLIC_BLOOD_PRESSURE,
    label: "Diastolic",
  },
  pulseRate: {
    name: concepts.PULSE_RATE,
    label: "Pulse Rate",
  },
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate",
  },
  spo: {
    name: concepts.SPO2,
    label: "SPO2",
  },
  temperature: {
    name: concepts.TEMPERATURE,
    label: "Temperature",
  },
  MRDT: {
    name: concepts.MRDT,
    label: "MRDT",
  },
  RBG: {
    name: concepts.BLOOD_GLUCOSE,
    label: "RBG",
  },
  PT: {
    name: concepts.INVESTIGATIONS_PT,
    label: "PT",
  },
  urineDipstick: {
    name: concepts.URINE_DIPSTICK_KETONES,
    label: "Urine Dipstick",
  },
  assessment: {
    name: concepts.ASSESSMENT,
    label: "Assessment",
  },
  plan: {
    name: concepts.PLAN,
    label: "Plan",
  },
  intervention: {
    name: concepts.INTERVENTION,
    label: "Intervention",
  },
  evaluation: {
    name: concepts.EVALUATION,
    label: "Evaluation",
  },
  replan: {
    name: concepts.REPLAN,
    label: "Replan",
  },
  implementation: {
    name: concepts.IMPLEMENTATION,
    label: "Implementation",
  },
};
const proceduresConfig = [
  { value: concepts.INTRAVENOUS_CANNULATION, label: "Intravenous Cannulation" },
  {
    value: concepts.CATHETERIZATION_URETHRAL,
    label: "Urethral Catheterization",
  },
  { value: concepts.SUCTIONING, label: "Suctioning" },
  {
    value: concepts.OROPHARYNGEAL_AIRWAY_INSERTION,
    label: "Oropharyngeal Airway Insertion",
  },
  {
    value: concepts.NASOPHARYNGEAL_AIRWAY_INSERTION,
    label: "Nasopharyngeal Airway Insertion",
  },
  {
    value: concepts.LARYNGEAL_MASK_AIRWAY_INSERTION,
    label: "Laryngeal Mask Airway Insertion",
  },
  {
    value: concepts.NASOGASTRIC_TUBE_INSERTION,
    label: "Nasogastric Tube Insertion",
  },
  { value: concepts.OTHER, label: "Other (Specify)" },
];

const supportiveCareConfig = [
  { value: concepts.WOUND_DRESSING, label: "Wound Dressing" },
  { value: concepts.PATIENT_EDUCATION, label: "Patient Education" },
  { value: concepts.COUNSELLING, label: "Counselling" },
  { value: concepts.FEEDING, label: "Feeding" },
  { value: concepts.OXYGENATION, label: "Oxygenation" },
  { value: concepts.TAPID_SPONGING, label: "Tapid Sponging" },
  {
    value: concepts.ELECTROCARDIOGRAPHY_MONITORING,
    label: "Electrocardiography (ECG) Monitoring",
  },
  { value: concepts.TURNING_PATIENTS, label: "Turning Patients" },
  { value: concepts.ORAL_CARE, label: "Oral Care" },
  { value: concepts.OTHER, label: "Other (Specify)" },
];
const validationSchema = Yup.object().shape({
  [form.subjective.name]: Yup.string().required(form.subjective.label),
  [form.objective.name]: Yup.string().required(form.objective.label),
  [form.assessment.name]: Yup.string().required(form.assessment.label),
  [form.plan.name]: Yup.string().required(form.plan.label),
  [form.intervention.name]: Yup.string().required(form.intervention.label),
  [form.evaluation.name]: Yup.string().required(form.evaluation.label),
  [form.replan.name]: Yup.string().required(form.replan.label),
  [form.implementation.name]: Yup.string().required(form.implementation.label),
  [form.spo.name]: Yup.number()
    .min(0)
    .max(100)
    .required()
    .label(form.spo.label),
  [form.respiratoryRate.name]: Yup.number()
    .min(0)
    .max(90)
    .required()
    .label(form.respiratoryRate.label),
  [form.systolic.name]: Yup.number()
    .min(0)
    .max(300)
    .required()
    .label(form.systolic.label),
  [form.diastolic.name]: Yup.number()
    .min(0)
    .max(300)
    .required()
    .label(form.diastolic.label),
  [form.temperature.name]: Yup.number()
    .min(20)
    .max(45)
    .required()
    .label(form.temperature.label),
  [form.pulseRate.name]: Yup.number()
    .min(60)
    .max(100)
    .label(form.pulseRate.label),
});

const initialValues = getInitialValues(form);

export const SoapForm = () => {
  const {
    mutate,
    isPending: addingDrugs,
    isSuccess,
  } = fetchConceptAndCreateEncounter();
  const [formValues, setFormValues] = useState<any>({ medications: [] });
  const { medicationOptions, loadingDrugs } = useFetchMedications();
  const [showTextFields, setShowTextFields] = useState({
    otherProcedure: false,
    otherSupportiveCare: false,
  });
  const { navigateBack } = useNavigation();
  const { handleSubmit } = useSubmitEncounter(
    encounters.NURSING_CARE_NOTES,
    () => ""
  );

  const handleSubmitForm = (values: any) => {
    console.log(
      "🚀 ~ handleSubmitForm ~ getObservations(values, getDateTime()):",
      getObservations(values, getDateTime())
    );
    handleSubmit(getObservations(values, getDateTime()));
  };
  const handleMedicationsSubmit = (values: any) => {
    console.log("Medications:", values);
  };
  const handleSkip = () => {
    console.log("handleSkip");
  };

  return (
    <ContainerLoaderOverlay loading={addingDrugs || loadingDrugs}>
      <FormikInit
        // initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
        submitButton={false}
        // validationSchema={schema}
        initialValues={{
          procedures: [],
          supportiveCare: [],
          otherProcedureSpecify: "",
          otherSupportiveCareSpecify: "",
        }}
        // onSubmit={handleSubmit}
      >
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{form.subjective.label}</Typography>
            <TextInputField
              label=""
              name={form.subjective.name}
              multiline
              id={form.subjective.name}
              rows={3}
              sx={{ width: "100%", mt: 0 }}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Objective</Typography>
            <div style={{ marginLeft: "50px" }}>
              <Typography>{form.objective.label}</Typography>
              <TextInputField
                label=""
                name={form.objective.name}
                multiline
                id={form.objective.name}
                rows={3}
                sx={{ width: "100%" }}
              />
              <Typography>Vital signs</Typography>
              <FormFieldContainerMultiple>
                <TextInputField
                  name={form.spo.name}
                  label={form.spo.label}
                  id={form.spo.name}
                  sx={{ width: "100%" }}
                  unitOfMeasure="%"
                />

                <TextInputField
                  name={form.systolic.name}
                  label={form.systolic.label}
                  id={form.systolic.name}
                  sx={{ width: "100%" }}
                  unitOfMeasure="mmHg"
                />
                <TextInputField
                  name={form.diastolic.name}
                  label={form.diastolic.label}
                  id={form.diastolic.name}
                  sx={{ width: "100%" }}
                  unitOfMeasure="mmHg"
                />
                <TextInputField
                  name={form.respiratoryRate.name}
                  label={form.respiratoryRate.label}
                  id={form.respiratoryRate.name}
                  sx={{ width: "100%" }}
                  unitOfMeasure="BPM"
                />
                <TextInputField
                  name={form.pulseRate.name}
                  label={form.pulseRate.label}
                  id={form.pulseRate.name}
                  sx={{ width: "100%" }}
                  unitOfMeasure="BPM"
                />
                <TextInputField
                  name={form.temperature.name}
                  label={form.temperature.label}
                  id={form.temperature.name}
                  sx={{ width: "100%" }}
                  unitOfMeasure="°C"
                />
              </FormFieldContainerMultiple>
              <Typography>Bed side investigations</Typography>
              <FormFieldContainerMultiple>
                <TextInputField
                  id={form.MRDT.name}
                  name={form.MRDT.name}
                  label={form.MRDT.label}
                />
                <TextInputField
                  id={form.RBG.name}
                  name={form.RBG.name}
                  label={form.RBG.label}
                />
                <TextInputField
                  id={form.PT.name}
                  name={form.PT.name}
                  label={form.PT.label}
                />

                <TextInputField
                  id={form.urineDipstick.name}
                  name={form.urineDipstick.name}
                  label={form.urineDipstick.label}
                />
              </FormFieldContainerMultiple>
            </div>
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{form.assessment.label}</Typography>
            <TextInputField
              label=""
              name={form.assessment.name}
              multiline
              id={form.assessment.name}
              rows={3}
              sx={{ width: "100%" }}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{form.plan.label}</Typography>
            <TextInputField
              label=""
              name={form.plan.name}
              multiline
              id={form.plan.name}
              rows={3}
              sx={{ width: "100%" }}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{form.intervention.label}</Typography>
            <FormFieldContainer direction="row">
              <WrapperBox
                sx={{
                  bgcolor: "white",
                  padding: "2ch",
                  mb: "2ch",
                  width: "100%",
                }}
              >
                <h4>Procedures</h4>
                <CheckboxesGroup
                  name="procedures"
                  allowFilter={false}
                  options={proceduresConfig}
                  getValue={(values) =>
                    setShowTextFields((prev) => ({
                      ...prev,
                      otherProcedure: values.some(
                        (val: any) => val.key === concepts.OTHER && val.value
                      ),
                    }))
                  }
                />
                {showTextFields.otherProcedure && (
                  <TextInputField
                    id="otherProcedureSpecify"
                    label="Specify Other Procedure"
                    name="otherProcedureSpecify"
                    placeholder="Specify the procedure"
                  />
                )}
              </WrapperBox>
              <WrapperBox
                sx={{
                  bgcolor: "white",
                  padding: "2ch",
                  mb: "2ch",
                  width: "100%",
                }}
              >
                <h4>Supportive Care</h4>
                <CheckboxesGroup
                  name="supportiveCare"
                  allowFilter={false}
                  options={supportiveCareConfig}
                  getValue={(values) =>
                    setShowTextFields((prev) => ({
                      ...prev,
                      otherSupportiveCare: values.some(
                        (val: any) => val.key === concepts.OTHER && val.value
                      ),
                    }))
                  }
                />
                {showTextFields.otherSupportiveCare && (
                  <TextInputField
                    id="otherSupportiveCareSpecify"
                    label="Specify Other Supportive Care"
                    name="otherSupportiveCareSpecify"
                    placeholder="Specify the care"
                  />
                )}
              </WrapperBox>
            </FormFieldContainer>
            <MedicationsForm onSkip={() => {}} onSubmit={() => {}} />
            <MedicationsDispensationForm
              onSubmit={handleMedicationsSubmit}
              onSkip={handleSkip}
            />
            <TextInputField
              label=""
              name={form.intervention.name}
              multiline
              id={form.intervention.name}
              rows={3}
              sx={{ width: "100%" }}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{form.evaluation.label}</Typography>
            <TextInputField
              label=""
              name={form.evaluation.name}
              multiline
              id={form.evaluation.name}
              rows={3}
              sx={{ width: "100%" }}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{form.replan.label}</Typography>
            <TextInputField
              label=""
              name={form.replan.name}
              multiline
              id={form.replan.name}
              rows={3}
              sx={{ width: "100%" }}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{form.implementation.label}</Typography>
            <TextInputField
              label=""
              name={form.implementation.name}
              multiline
              id={form.implementation.name}
              rows={3}
              sx={{ width: "100%" }}
            />
          </Paper>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
