import {
  FormikInit,
  FormFieldContainerMultiple,
  RadioGroupInput,
  TextInputField,
  FormTimePickerNow,
  FormDatePickerToday,
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

  time: {
    name: concepts.TIME,
    label: "Time of Call",
  },

  date: {
    name: concepts.DATE_OF_CPR,
    label: "Date of Call",
  },
};
const sites = [
  { label: "Rescitation", value: concepts.RESUSCITATION },
  { label: "Short Stay", value: concepts.SHORT_STAY },
  { label: "Gynae Bench", value: concepts.GYNAE_BENCH },
  { label: "Isolation Room", value: concepts.ISOLATION },
  { label: "Trauma", value: concepts.TRAUMA },
  { label: "Medical Bench", value: concepts.MEDICAL_BENCH },
  { label: "Surgical Bench", value: concepts.SURGICAL_BENCH  },
  { label: "SSW", value: concepts.SSW },
  { label: "Priority Area", value: concepts.PRIORITY },
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
});

export const BasicDetailsForm = ({
  onSubmit,
  formRef,
}: {
  onSubmit: (values: any) => void;
  formRef: any;
}) => {
  return (
    <>
      <FormikInit
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={BasicDetailsValidationSchema}
        submitButton={false}
        ref={formRef}
      >
        {({ values, setFieldValue }) => (
          <>
            <FormDatePickerToday
              width={"100%"}
              name={form.date.name}
              label={form.date.label}
            />
            {/* <FormTimePicker name={form.time.name} label={form.time.label} /> */}

            <FormTimePickerNow
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
    </>
  );
};
