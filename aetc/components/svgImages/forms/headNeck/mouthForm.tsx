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
  otherAbnormalities: {
    name: concepts.OTHER,
    label: "Specify Other Abnormalities",
  },
  description: {
    name: concepts.DESCRIPTION,
    label: "Description of Tongue Laceration",
  },
};

type Prop = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.array()
    .required()
    .label(form.abnormalities.label),
  [form.otherAbnormalities.name]: Yup.string().label(
    form.otherAbnormalities.label
  ),
  [form.description.name]: Yup.string().label(form.otherAbnormalities.label),
});

const initialsValues = getInitialValues(form);

const abnormalities = [
  { id: concepts.ORAL_THRUSH, label: "Oral Thrush" },
  { id: concepts.KAPOSI_SARCOMA_LESIONS, label: "Kaposi's Sarcoma lesions" },
  { id: concepts.TONGUE_LACERATION, label: "Tongue Laceration" },
  { id: concepts.LOOSE_TEETH, label: "Loose Teeth" },
  { id: concepts.OTHER, label: "Other" },
];

export const MouthForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showOtherAbnormalities, setShowOtherAbnormalities] =
    useState<boolean>(false);

  const [tongueLaceration, setTongueLaceration] = useState<boolean>(false);

  const handleValueChange = (values: Array<any>) => {
    setShowOtherAbnormalities(
      Boolean(values.find((v) => v.id == form.otherAbnormalities.name))
    );
    setTongueLaceration(
      Boolean(values.find((v) => v.id == concepts.TONGUE_LACERATION))
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

        {tongueLaceration && (
          <>
            <TextInputField
              sx={{ my: "1ch", width: "100%" }}
              id={form.description.name}
              name={form.description.name}
              label={form.description.label}
            />
          </>
        )}
      </Box>
    </FormikInit>
  );
};
