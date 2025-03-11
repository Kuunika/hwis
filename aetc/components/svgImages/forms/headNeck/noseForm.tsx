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
import { getCachedConcept } from "@/helpers/data";

const form = {
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Abnormalities",
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
    name: concepts.LACERATION_OTHER,
    label: "Laceration Other Descriptors",
  },
  otherAbnormalities: {
    name: concepts.OTHER,
    label: "Other Abnormalities",
  },
};

type Prop = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.array()
    .required()
    .label(form.abnormalities.label),
  [form.lacerationDepth.name]: Yup.string().label(form.lacerationDepth.label),
  [form.lacerationOther.name]: Yup.string().label(form.lacerationOther.label),
  [form.lacerationLength.name]: Yup.string().label(form.lacerationLength.label),
});

const initialsValues = getInitialValues(form);

const abnormalities = [
  { id: concepts.BLEEDING_FROM_INSIDE_NOSE, label: "Bleeding from the nose" },
  { id: concepts.RHINORRHOEA, label: "Rhinorrhea" },
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.OTHER, label: "Other" },
];

export const NoseForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showOtherAbnormalities, setShowOtherAbnormalities] =
    useState<boolean>(false);
  const [showLaceration, setShowLaceration] = useState<boolean>(false);

  const handleValueChange = (values: Array<any>) => {
    setShowLaceration(
      Boolean(
        values.find((v) => v.id == getCachedConcept(concepts.LACERATION)?.uuid)
      )
    );
    setShowOtherAbnormalities(
      Boolean(
        values.find((v) => v.id == getCachedConcept(concepts.OTHER)?.uuid)
      )
    );
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={(values: any) =>
        onSubmit(values, getFormLabels(form, abnormalities, []))
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
        {showOtherAbnormalities && (
          <>
            <TextInputField
              sx={{ my: "1ch", width: "100%" }}
              id={form.abnormalities.name}
              name={form.otherAbnormalities.name}
              label={form.otherAbnormalities.label}
            />
          </>
        )}

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
      </Box>
    </FormikInit>
  );
};
