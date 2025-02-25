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
import { getCachedConcept } from "@/helpers/data";
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
  scarDescription: {
    name: concepts.OTHER_MASSES_DESCRIPTION,
    label: "Scar description",
  },
  other: {
    name: concepts.OTHER,
    label: "Other",
  },
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.array()
    .required()
    .label(form.abnormalities.label),
  [form.burnsDescription.name]: Yup.string().label(form.burnsDescription.label),
  [form.scarDescription.name]: Yup.string().label(form.scarDescription.label),
  [form.other.name]: Yup.string().label(form.other.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.STAB_PUNCTURE, label: "Stab/Puncture" },
  { id: concepts.BRUISE, label: "Bruise" },
  { id: concepts.BURNS, label: "Burns" },
  { id: concepts.SCAR, label: "Scar" },
  { id: concepts.OTHER, label: "Other" },
];

const radioOptions = [
  { value: concepts.SUPERFICIAL, label: "Superficial" },
  { value: concepts.PARTIAL, label: "Partial Thickness" },
  { value: concepts.FULL_THICKNESS, label: "Full Thickness" },
];

export const SecondaryAbdomenPelvicForm = (props: Props) => {
  const [showBurns, setShowBurns] = useState<boolean>(false);
  const [showLaceration, setShowLaceration] = useState<boolean>(false);
  const [showScarDescription, setShowScarDescription] =
    useState<boolean>(false);
  const [showOther, setShowOther] = useState<boolean>(false);

  const handleValueChange = (values: Array<any>) => {
    setShowBurns(
      Boolean(
        values.find((v) => v.id == getCachedConcept(concepts.BURNS)?.uuid)
      )
    );
    setShowLaceration(
      Boolean(
        values.find((v) => v.id == getCachedConcept(concepts.LACERATION)?.uuid)
      )
    );
    setShowScarDescription(
      Boolean(values.find((v) => v.id == getCachedConcept(concepts.SCAR)?.uuid))
    );
    setShowOther(
      Boolean(
        values.find((v) => v.id == getCachedConcept(concepts.OTHER)?.uuid)
      )
    );
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={getInitialValues(form)}
      onSubmit={(values: any) =>
        props.onSubmit(values, getFormLabels(form, options, radioOptions))
      }
      submitButton={false}
      submitButtonText="next"
    >
      <SearchComboBox
        name={form.abnormalities.name}
        label={form.abnormalities.label}
        options={options}
        coded
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
              coded
              name={form.burnsDescription.name}
              label={form.burnsDescription.label}
            />
          </DashedContainer>
        </>
      )}
      {showScarDescription && (
        <>
          <br />
          <DashedContainer>
            <Typography variant="h6">Scar Description</Typography>
            <TextInputField
              sx={{ width: "100%" }}
              id={form.scarDescription.name}
              name={form.scarDescription.name}
              label={form.scarDescription.label}
            />
          </DashedContainer>
        </>
      )}
      {showOther && (
        <>
          <br />
          <DashedContainer>
            <Typography variant="h6">Other</Typography>
            <TextInputField
              sx={{ width: "100%" }}
              id={form.other.name}
              name={form.other.name}
              label={form.other.label}
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
