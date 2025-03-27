import {
  FormikInit,
  FormDatePicker,
  FormTimePicker,
  FormFieldContainerMultiple,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import * as Yup from "yup";

const form = {
  cardiacArrest: {
    name: concepts.CARDIAC_ARREST,
    label: "Witnessed Cardiac Arrest",
  },
  site: {
    name: concepts.SITE,
    label: "SITE",
  },
  specify: {
    name: concepts.SPECIFY,
    label: "Specify",
  },
  reversibleCauses: {
    name: concepts.REVERSIBLE_CAUSES,
    label: "Reversible Causes",
  },
  reasonsCprStopped: {
    name: concepts.REASON_CPR_STOPPED,
    label: "Reason CPR Stopped",
  },
  otherReason: {
    name: concepts.OTHER,
    label: "Other Reason",
  },
  dispositionAfterCpr: {
    name: concepts.DISPOSITION_AFTER_CPR,
    label: "Disposition After CPR",
  },
  spo: {
    name: concepts.SPO2,
    label: "SPO2",
  },
  oxygen: {
    name: concepts.OXYGEN_GIVEN,
    label: "Oxygen",
  },
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate",
  },
  systolic: {
    name: concepts.SYSTOLIC_BLOOD_PRESSURE,
    label: "Systolic",
  },
  diastolic: {
    name: concepts.DIASTOLIC_BLOOD_PRESSURE,
    label: "Diastolic",
  },
  // gcs: {
  //   name: concepts.GCS,
  //   label: "Glasgow Coma Scale",
  // },
  pulseRate: {
    name: concepts.PULSE_RATE,
    label: "Pulse Rate",
  },
  temperature: {
    name: concepts.TEMPERATURE,
    label: "Temperature",
  },
  motorResponse: {
    name: concepts.MOTOR_RESPONSE,
    label: "Motor Response",
  },
  eyeOpeningResponse: {
    name: concepts.EYE_OPENING_RESPONSE,
    label: "Eye Opening Response",
  },
  verbalResponse: {
    name: concepts.VERBAL_RESPONSE,
    label: "Verbal Response",
  },
  teamLeader: {
    name: concepts.TEAM_LEADER,
    label: "Team Leader",
  },
  teamMembers: {
    name: concepts.TEAM_MEMBERS,
    label: "Team Members",
  },
  time: {
    name: concepts.TIME,
    label: "Time of Call",
  },

  date: {
    name: concepts.DATE_OF_CPR,
    label: "Date of Call",
  },
  cause: {
    name: concepts.CAUSE,
    label: "Likely or known cause of cardiac arrest",
  },
  timeStopped: {
    name: concepts.CPR_TIME_STOPPED,
    label: "CPR Time Stopped",
  },
};
const sites = [
  { label: "Rescitation", value: concepts.RESUSCITATION },
  { label: "SSW", value: concepts.SSW },
  { label: "Priority", value: concepts.PRIORITY },
  { label: "Other", value: concepts.OTHER },
];

const radioOptions = [
  { label: "Yes", value: concepts.YES },
  { label: "No", value: concepts.NO },
];

const initialValues = getInitialValues(form);

const BasicDetailsValidationSchema = Yup.object().shape({
  [form.cardiacArrest.name]: Yup.string()
    .required()
    .label(form.cardiacArrest.label),
  [form.site.name]: Yup.string().required().label(form.site.label),
  [form.specify.name]: Yup.string().when(form.site.name, {
    is: (value: any) => value === concepts.OTHER,
    then: (schema) => schema.required().label(form.specify.label),
  }),
  [form.reversibleCauses.name]: Yup.array()
    .required()
    .label(form.reversibleCauses.label),
});

export const BasicDetailsForm = ({
  onSubmit,
}: {
  onSubmit: (values: any) => void;
}) => {
  return (
    <FormikInit
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={BasicDetailsValidationSchema}
    >
      {({ values, setFieldValue }) => (
        <>
          <FormDatePicker
            width={"100%"}
            name={form.date.name}
            label={form.date.label}
          />

          <FormTimePicker
            sx={{ my: "1ch" }}
            name={form.time.name}
            label={form.time.label}
          />
          {/* <FieldsContainer></FieldsContainer> */}
          <FormFieldContainerMultiple>
            <RadioGroupInput
              options={radioOptions}
              label={form.cardiacArrest.label}
              name={form.cardiacArrest.name}
              row
            />
            <RadioGroupInput
              //   sx={{ backgroundColor: "red" }}
              name={form.site.name}
              label={form.site.label}
              options={sites}
              row
            />
          </FormFieldContainerMultiple>
          {values[form.site.name] == concepts.OTHER && (
            <TextInputField
              size="small"
              name={form.specify.name}
              label={form.specify.label}
              id={form.specify.name}
              sx={{ width: "100%" }}
            />
          )}
        </>
      )}
    </FormikInit>
  );
};
