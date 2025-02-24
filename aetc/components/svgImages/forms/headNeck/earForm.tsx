import { NO, YES, concepts } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import * as Yup from "yup";
import React from "react";
import { Box } from "@mui/material";

const form = {
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Abnormalities",
  },
  otoscopyDone: {
    name: concepts.OTOSCOPY,
    label: "Otoscopy Done",
  },
  lacerationLength: {
    name: concepts.LACERATION_LENGTH,
    label: "Laceration Length",
  },
  lacerationDepth: {
    name: concepts.LACERATION_DEPTH,
    label: "Laceration Depth",
  },
  lacerationOther: {
    name: concepts.OTHER,
    label: "Laceration Other Descriptors",
  },
  otocopyFindings: {
    name: concepts.OTOSCOPY_FINDINGS,
    label: "Otoscopty Findings",
  },
};

type Prop = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.array()
    .required()
    .label(form.abnormalities.label),
  [form.otoscopyDone.name]: Yup.string()
    .required()
    .label(form.otoscopyDone.label),

  [form.otocopyFindings.name]: Yup.string().label(form.otocopyFindings.label),

  [form.lacerationDepth.name]: Yup.string().label(form.lacerationDepth.label),
  [form.lacerationOther.name]: Yup.string().label(form.lacerationOther.label),
  [form.lacerationLength.name]: Yup.string().label(form.lacerationLength.label),
});

const initialsValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

const abnormalities = [
  { id: concepts.BLEEDING_FROM_EAR, label: "Bleeding From The Ear" },
  { id: concepts.OTORRHOEA, label: "Otorrhoea" },
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.OTHER, label: "Other" },
];

export const EarForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showLaceration, setShowLaceration] = useState<boolean>(false);

  const handleValueChange = (values: Array<any>) => {
    setShowLaceration(Boolean(values.find((v) => v.id == concepts.LACERATION)));
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={(values: any) =>
        onSubmit(values, getFormLabels(form, abnormalities, radioOptions))
      }
    >
      <Box>
        <FormValuesListener getValues={setFormValues} />
        <SearchComboBox
          getValue={handleValueChange}
          name={form.abnormalities.name}
          label={form.abnormalities.label}
          options={abnormalities}
          coded
        />

        {showLaceration && (
          <>
            <TextInputField
              sx={{ my: "1ch", width: "100%" }}
              id={form.lacerationLength.name}
              name={form.lacerationLength.name}
              label={form.lacerationLength.label}
            />
            <TextInputField
              sx={{ my: "1ch", width: "100%" }}
              id={form.lacerationDepth.name}
              name={form.lacerationDepth.name}
              label={form.lacerationDepth.label}
            />
            <TextInputField
              sx={{ my: "1ch", width: "100%" }}
              id={form.lacerationOther.name}
              name={form.lacerationOther.name}
              label={form.lacerationOther.label}
            />
          </>
        )}

        <RadioGroupInput
          name={form.otoscopyDone.name}
          options={radioOptions}
          label={form.otoscopyDone.label}
        />
        {formValues[form.otoscopyDone.name] == concepts.YES && (
          <>
            <TextInputField
              sx={{ my: "1ch", width: "100%" }}
              id={form.otocopyFindings.name}
              name={form.otocopyFindings.name}
              label={form.otocopyFindings.label}
            />
          </>
        )}
      </Box>
    </FormikInit>
  );
};
