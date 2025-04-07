import {
  FormFieldContainerMultiple,
  FormikInit,
  TextInputField,
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

  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
      submitButton={false}
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
  );
};
