import { NO, YES, concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
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
  otherAbnormalities: {
    name: concepts.OTHER,
    label: "Specify Other Abnormalities",
  },
  description: {
    name: concepts.DESCRIPTION,
    label: "Description of Eyelid Injury",
  },
  sizeOfPupil: {
    name: concepts.PUPIL_SIZE,
    label: "Pupil Size",
  },
};

type Prop = {
  onSubmit: (values: any) => void;
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.array()
    .required()
    .label(form.abnormalities.label),
  [form.otherAbnormalities.name]: Yup.string().label(
    form.otherAbnormalities.label
  ),
  [form.description.name]: Yup.string().label(form.otherAbnormalities.label),
  [form.sizeOfPupil.name]: Yup.string().label(form.sizeOfPupil.label),
});

const initialsValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

const abnormalities = [
  { id: concepts.PALLOR, label: "Pallor" },
  { id: concepts.JAUNDICE, label: "Jaundice" },
  { id: concepts.RACCOON_EYES, label: "Racoon Eyes" },
  { id: concepts.HYPHEMA, label: "Hyphema" },
  { id: concepts.EYELID_INJURY, label: "Eyelid Injury" },
  { id: concepts.OTHER, label: "Other" },
];

export const EyeForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showOtherAbnormalities, setShowOtherAbnormalities] =
    useState<boolean>(false);
  const [showEyeInjury, setShowEyeInjury] = useState<boolean>(false);

  const handleValueChange = (values: Array<any>) => {
    setShowOtherAbnormalities(
      Boolean(values.find((v) => v.id == form.otherAbnormalities.name))
    );
    setShowEyeInjury(
      Boolean(values.find((v) => v.id == concepts.EYELID_INJURY))
    );
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={onSubmit}
    >  
      <Box>
        <FormValuesListener getValues={setFormValues} />
        <TextInputField
              sx={{ my: "1ch", width:"100%" }}
              id={form.sizeOfPupil.name}
              name={form.sizeOfPupil.name}
              label={form.sizeOfPupil.label}
            />
        <SearchComboBox
          getValue={handleValueChange}
          name={form.abnormalities.name}
          label={form.abnormalities.label}
          options={abnormalities}
        />

        {showOtherAbnormalities && (
          <>
            <TextInputField
              sx={{ my: "1ch",width:"100%" }}
              id={form.abnormalities.name}
              name={form.otherAbnormalities.name}
              label={form.otherAbnormalities.label}
            />
          </>
        )}

        {showEyeInjury && (
          <>
            <TextInputField
              sx={{ my: "1ch", width:"100%" }}
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
