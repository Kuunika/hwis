import { NO, YES, concepts } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { useState } from "react";
import {
  FieldsContainer,
  FormValuesListener,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import * as Yup from "yup";
import React from "react";
import { Box, Typography } from "@mui/material";

const form = {
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Abnormalities",
  },
  trachea: {
    name: concepts.TRACHEA,
    label: "Trachea",
  },
  tracheaDeviated: {
    name: concepts.TRACHEA_DEVIATED,
    label: "Deviated",
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
  heamatoma: {
    name: concepts.HAEMATOMA,
    label: "Heamatoma",
  },
  lymphNodes: {
    name: concepts.LYMPH_NODES,
    label: "Lymph Nodes",
  },
  lymphNodesSize: {
    name: concepts.SIZE,
    label: "Size",
  },
  lymphNodeLocation: {
    name: concepts.LOCATION,
    label: "Location",
  },
  lymphNodeMobility: {
    name: concepts.MOBILITY,
    label: "Mobility",
  },
  lymphNodeTenderness: {
    name: concepts.TENDERNESS,
    label: "Tenderness",
  },
  raisedHeight: {
    name: concepts.RAISED_HEIGHT,
    label: "Height",
  },
  enlargedThyroidDescription: {
    name: concepts.DESCRIPTION,
    label: "Enlarged Thyroid Description",
  },
  haemotoma: {
    name: concepts.HAEMATOMA,
    label: "Haematoma",
  },
  additionalNotes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Notes",
  },
};

type Prop = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.array()
    .required()
    .label(form.abnormalities.label),
  [form.trachea.name]: Yup.string().label(form.trachea.label),
  [form.lacerationDepth.name]: Yup.string().label(form.lacerationDepth.label),
  [form.lacerationOther.name]: Yup.string().label(form.lacerationOther.label),
  [form.lacerationLength.name]: Yup.string().label(form.lacerationLength.label),
  [form.enlargedThyroidDescription.name]: Yup.string().label(
    form.enlargedThyroidDescription.label
  ),
  [form.raisedHeight.name]: Yup.number()
    .min(4)
    .max(10)
    .label(form.raisedHeight.label),
  [form.lymphNodeLocation.name]: Yup.string().label(
    form.lymphNodeLocation.label
  ),
  [form.lymphNodeMobility.name]: Yup.string().label(
    form.lymphNodeMobility.label
  ),
  [form.lymphNodeTenderness.name]: Yup.string().label(
    form.lymphNodeTenderness.label
  ),
  [form.lymphNodesSize.name]: Yup.string().label(form.lymphNodesSize.label),
  [form.heamatoma.name]: Yup.string().label(form.haemotoma.label),
  [form.additionalNotes.name]: Yup.string().label(form.additionalNotes.label),
});

const initialsValues = getInitialValues(form);

const abnormalities = [
  { id: concepts.JUGULAR_VENOUS_PRESSURE, label: "Jugular Venous Pressure" },
  { id: concepts.RAISED, label: "Raised jugular venous pressure" },
  // { id: concepts.RHINORRHOEA, label: "Rhinorrhea" },
  { id: concepts.ENLARGED_THYROID, label: "Enlarged Thyroid" },
  { id: concepts.LYMPH_NODES, label: "Lymph Nodes" },
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.BRUISE, label: "Bruise" },
];

const tracheaOptions = [
  { label: "Central", value: "Central" },
  { label: "Deviated", value: "Deviated" },
];
const deviatedSide = [
  { label: "Left", value: "Left" },
  { label: "Right", value: "Right" },
];

// Inside your NeckForm component
export const NeckForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showOtherAbnormalities, setShowOtherAbnormalities] =
    useState<boolean>(false);
  const [showLaceration, setShowLaceration] = useState<boolean>(false);
  const [showRaised, setShowRaised] = useState<boolean>(false);
  const [showEnlargedThyroid, setShowEnlargedThyroid] =
    useState<boolean>(false);
  const [showLymph, setShowLymph] = useState<boolean>(false);

  const handleValueChange = (values: Array<any>) => {
    setShowLaceration(Boolean(values.find((v) => v.id == concepts.LACERATION)));
    setShowOtherAbnormalities(
      Boolean(values.find((v) => v.id == concepts.OTHER))
    );
    setShowRaised(Boolean(values.find((v) => v.id == concepts.RAISED)));
    setShowEnlargedThyroid(
      Boolean(values.find((v) => v.id == concepts.ENLARGED_THYROID))
    );
    setShowLymph(Boolean(values.find((v) => v.id == concepts.LYMPH_NODES)));
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={(values: any) =>
        onSubmit(
          values,
          getFormLabels(form, abnormalities, [
            ...tracheaOptions,
            ...deviatedSide,
          ])
        )
      }
    >
      <Box
        sx={{
          maxHeight: "50vh",
          overflow: "auto",
          padding: "1rem",
          backgroundColor: "white",
        }}
      >
        <FormValuesListener getValues={setFormValues} />

        <FieldsContainer>
          <RadioGroupInput
            row
            name={form.trachea.name}
            options={tracheaOptions}
            label={form.trachea.label}
          />
          {formValues[form.trachea.name] == "Deviated" && (
            <>
              <RadioGroupInput
                row
                name={form.tracheaDeviated.name}
                options={deviatedSide}
                label={form.tracheaDeviated.label}
              />
            </>
          )}
        </FieldsContainer>

        <SearchComboBox
          getValue={handleValueChange}
          name={form.abnormalities.name}
          label={form.abnormalities.label}
          options={abnormalities}
        />
        <br />
        {showRaised && (
          <>
            <Typography mt={"0.5ch"} variant="subtitle2">
              Raised Abnormality
            </Typography>
            <TextInputField
              sx={{ width: "100%" }}
              id={form.raisedHeight.name}
              name={form.raisedHeight.name}
              label={form.raisedHeight.label}
            />
          </>
        )}
        {showLymph && (
          <>
            <Typography mt={"0.5ch"} variant="subtitle2">
              Lymph Node Abnormality
            </Typography>
            <FieldsContainer mr="0.5ch" sx={{ mt: "0.5ch" }}>
              <TextInputField
                sx={{ width: "100%" }}
                id={form.lymphNodeLocation.name}
                name={form.lymphNodeLocation.name}
                label={form.lymphNodeLocation.label}
              />
              <TextInputField
                sx={{ width: "100%" }}
                id={form.lymphNodesSize.name}
                name={form.lymphNodesSize.name}
                label={form.lymphNodesSize.label}
              />
            </FieldsContainer>
            <FieldsContainer mr="0.5ch">
              <TextInputField
                sx={{ width: "100%" }}
                id={form.lymphNodeMobility.name}
                name={form.lymphNodeMobility.name}
                label={form.lymphNodeMobility.label}
              />
              <TextInputField
                sx={{ width: "100%" }}
                id={form.lymphNodeTenderness.name}
                name={form.lymphNodeTenderness.name}
                label={form.lymphNodeTenderness.label}
              />
            </FieldsContainer>
          </>
        )}
        {showEnlargedThyroid && (
          <>
            <Typography variant="subtitle2">Enlarged Thyroid</Typography>
            <TextInputField
              sx={{ my: "1ch", width: "100%" }}
              id={form.enlargedThyroidDescription.name}
              name={form.enlargedThyroidDescription.name}
              label={form.enlargedThyroidDescription.label}
            />
          </>
        )}

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
            <Typography variant="subtitle2">Laceration</Typography>
            <FieldsContainer mr="0.5ch">
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
              multiline
              rows={2}
              id={form.lacerationOther.name}
              name={form.lacerationOther.name}
              label={form.lacerationOther.label}
            />
          </>
        )}

        <>
          <TextInputField
            sx={{ width: "100%" }}
            id={form.haemotoma.name}
            name={form.haemotoma.name}
            label={form.haemotoma.label}
          />
          <TextInputField
            sx={{ width: "100%" }}
            id={form.additionalNotes.name}
            name={form.additionalNotes.name}
            label={form.additionalNotes.label}
          />
        </>
      </Box>
    </FormikInit>
  );
};
