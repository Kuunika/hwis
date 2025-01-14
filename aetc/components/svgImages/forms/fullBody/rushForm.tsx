import {
  DashedContainer,
  FieldsContainer,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { Box, Button } from "@mui/material";
import { useState } from "react";

import * as Yup from "yup";

const form = {
  rush: {
    name: concepts.SKIN_RASH,
    label: "Is there Rash on this region?",
  },
  description: {
    name: concepts.DESCRIPTION,
    label: "Description of Rush",
  },
  notes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
  skinAbnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Are there Other Skin Abnormalities",
  },
  abnormalityDescription: {
    name: concepts.ABNORMALITY_DESCRIPTION,
    label: "Description of Other Skin Abnormalities",
  },
  injury: {
    name: concepts.INJURY,
    label: "is there an injury on this region?",
  },
  descriptionOfInjury: {
    name: concepts.DESCRIPTION_OF_INJURY,
    label: "Description of Injury",
  },
};

const schema = Yup.object().shape({
  [form.description.name]: Yup.array().label(form.description.label),
  [form.notes.name]: Yup.string().label(form.notes.label),
  [form.rush.name]: Yup.string().required().label(form.rush.label),
  [form.skinAbnormalities.name]: Yup.string()
    .required()
    .label(form.skinAbnormalities.label),
  [form.abnormalityDescription.name]: Yup.string().label(
    form.abnormalityDescription.label
  ),
  [form.injury.name]: Yup.string().required().label(form.injury.label),
  [form.descriptionOfInjury.name]: Yup.string().label(
    form.descriptionOfInjury.label
  ),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.BRUISE, label: "Bruise" },
  { id: concepts.PETECHIAE, label: "Petechiae" },
  { id: concepts.URTICARIA, label: "Urtcaria" },
  { id: concepts.BURNS, label: "Burns" },
  { id: concepts.BITE, label: "Bite" },
  { id: concepts.STING, label: "Sting" },
  { id: concepts.MACULE, label: "Macule" },
  { id: concepts.PAPULE, label: "Papule" },
  { id: concepts.VESICLE, label: "Vesicle" },
  { id: concepts.PUSTULE, label: "Pustule" },
  { id: concepts.SCALE, label: "Scale" },
];

const yesNoOptions = [
  { value: concepts.YES, label: "Yes" },
  { value: concepts.NO, label: "No" },
];

export const RushForm = (props: Props) => {
  const [showRush, setShowRush] = useState(false);
  const [showAbnormality, setShowAbnormality] = useState(false);
  const [showInjury, setShowInjury] = useState(false);

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={getInitialValues(form)}
      onSubmit={(values: any) =>
        props.onSubmit(values, getFormLabels(form, options, yesNoOptions))
      }
      submitButton={false}
      submitButtonText="next"
    >
      <RadioGroupInput
        options={yesNoOptions}
        name={form.rush.name}
        label={form.rush.label}
        getValue={(value) => setShowRush(value === concepts.YES)}
        row
      />

      {showRush && (
        <>
          <SearchComboBox
            name={form.description.name}
            label={form.description.label}
            options={options}
          />
          <TextInputField
            sx={{
              width: "100%",
              mt: "1ch",
            }}
            name={form.notes.name}
            label={form.notes.label}
            id={form.notes.name}
          />
          <br />
        </>
      )}
      <RadioGroupInput
        options={yesNoOptions}
        name={form.skinAbnormalities.name}
        label={form.skinAbnormalities.label}
        getValue={(value) => setShowAbnormality(value === concepts.YES)}
        row
      />
      {showAbnormality && (
        <>
          <TextInputField
            rows={3}
            multiline
            sx={{ width: "100%" }}
            name={form.abnormalityDescription.name}
            label={form.abnormalityDescription.label}
            id={""}
          />
        </>
      )}
      <RadioGroupInput
        options={yesNoOptions}
        name={form.injury.name}
        label={form.injury.label}
        getValue={(value) => setShowInjury(value === concepts.YES)}
        row
      />

      {showInjury && (
        <>
          <TextInputField
            rows={3}
            multiline
            sx={{ width: "100%" }}
            name={form.descriptionOfInjury.name}
            label={form.descriptionOfInjury.label}
            id={""}
          />
        </>
      )}

      <Box sx={{ display: "flex", gap: "0.2ch" }}>
        <Button
          type="submit"
          sx={{ borderRadius: "1px" }}
          variant="contained"
          fullWidth
        >
          Submit
        </Button>
        <Button sx={{ borderRadius: "1px" }} fullWidth onClick={props.onCancel}>
          Cancel
        </Button>
      </Box>
    </FormikInit>
  );
};
