import {
  DashedContainer,
  FieldsContainer,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

import * as Yup from "yup";

const form = {
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Abnormalities",
  },
  burnsDescription: {
    name: concepts.DESCRIPTION,
    label: "Burns description",
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
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.array()
    .required()
    .label(form.abnormalities.label),
  [form.burnsDescription.name]: Yup.string().label(form.burnsDescription.label),
});

type Props = {
  onSubmit: (values: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.STAB_PUNCTURE, label: "Stab/Puncture" },
  { id: concepts.BRUISE, label: "Bruise" },
  { id: concepts.BURNS, label: "Burns" },
  { id: concepts.SCAR, label: "Scar" },
];

const radioOptions = [
  { value: concepts.SUPERFICIAL, label: "Superficial" },
  { value: concepts.PARTIAL, label: "Partial" },
  { value: concepts.THICKNESS, label: "Thickness" },
  { value: concepts.FULL_THICKNESS, label: "Full Thickness" },
  { value: concepts.SCAR, label: "Scar" },
];

export const SecondaryAbdomenPelvicForm = (props: Props) => {
  const [showBurns, setShowBurns] = useState<boolean>(false);
  const [showLaceration, setShowLaceration] = useState<boolean>(false);

  const handleValueChange = (values: Array<any>) => {
    setShowBurns(Boolean(values.find((v) => v.id == concepts.BURNS)));
    setShowLaceration(Boolean(values.find((v) => v.id == concepts.LACERATION)));
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{ description: "", notes: "" }}
      onSubmit={props.onSubmit}
      submitButton={false}
      submitButtonText="next"
    >
      <SearchComboBox
        name={form.abnormalities.name}
        label={form.abnormalities.label}
        options={options}
        getValue={handleValueChange}
      />
      {showLaceration && (
        <>
          <br />
          <DashedContainer>
            <Typography variant="subtitle2">Laceration</Typography>
            <FieldsContainer mr="2px">
              <TextInputField
                sx={{ width: "100%" }}
                id={form.lacerationLength.name}
                name={form.lacerationLength.name}
                label={form.lacerationLength.label}
              />
              <TextInputField
                sx={{ width: "100%" }}
                id={form.lacerationDepth.name}
                name={form.lacerationDepth.name}
                label={form.lacerationDepth.label}
              />
            </FieldsContainer>
            <TextInputField
              sx={{ width: "100%" }}
              id={form.lacerationOther.name}
              name={form.lacerationOther.name}
              label={form.lacerationOther.label}
            />
          </DashedContainer>
        </>
      )}

      {showBurns && (
        <>
          <br />
          <DashedContainer>
            <Typography variant="h6">Burns</Typography>
            <RadioGroupInput
              row
              options={radioOptions}
              name={form.burnsDescription.name}
              label={form.burnsDescription.label}
            />
          </DashedContainer>
        </>
      )}
      <br />
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
