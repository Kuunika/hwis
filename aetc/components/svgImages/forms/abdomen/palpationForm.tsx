import {
  FieldsContainer,
  FormikInit,
  FormValuesListener,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components/form";
import { concepts, NO, YES } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { getCachedConcept } from "@/helpers/data";

import { useState } from "react";
import * as yup from "yup";

const form = {
  hepatomegaly: {
    name: concepts.HEPATOMEGALY,
    label: "Hepatomegaly",
  },
  hepatomegalyDescription: {
    name: concepts.HEPATOMEGALY_DESCRIPTION,
    label: "Hepatomegaly Description",
  },
  splenomegaly: {
    name: concepts.SPLENOMEGALY,
    label: "Splenomegaly",
  },
  splenomegalyDescription: {
    name: concepts.SPLENOMEGALY_DESCRIPTION,
    label: "Splenomegaly Description",
  },
  // kidneyBallotable: {
  //   name: concepts.KIDNEYS_BALLOTABLE,
  //   label: "Kidney Ballotable",
  // },
  tenderness: {
    name: concepts.TENDERNESS,
    label: "Tenderness",
  },
  fullBladder: {
    name: concepts.FULL_BLADDER,
    label: "Full Bladder",
  },
  otherMasses: {
    name: concepts.OTHER_MASSES,
    label: "Other Masses",
  },
  otherMassesDescription: {
    name: concepts.OTHER_MASSES_DESCRIPTION,
    label: "Other Masses Description",
  },
  palpation: {
    name: concepts.PALPATION,
    label: "Palpation",
  },
  side: {
    name: concepts.SIDE,
    label: "Side",
  },
};

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];
const kidneyOptions = [
  { label: "Left", value: concepts.LEFT },
  { label: "Right", value: concepts.RIGHT },
];

const schema = yup.object().shape({
  [form.fullBladder.name]: yup.string().label(form.fullBladder.label),
  [form.hepatomegaly.name]: yup.string().label(form.hepatomegaly.label),
  [form.hepatomegalyDescription.name]: yup
    .string()
    .label(form.hepatomegalyDescription.label),
  [form.splenomegaly.name]: yup.string().label(form.splenomegaly.label),
  [form.splenomegalyDescription.name]: yup
    .string()
    .label(form.splenomegalyDescription.label),
  // [form.kidneyBallotable.name]: yup.string().label(form.kidneyBallotable.label),
  [form.tenderness.name]: yup.string().label(form.tenderness.label),
  [form.otherMasses.name]: yup.string().label(form.otherMasses.label),
  [form.otherMassesDescription.name]: yup
    .string()
    .label(form.otherMassesDescription.label),
  [form.palpation.name]: yup.array().label(form.palpation.label),
  [form.side.name]: yup.string().label(form.side.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};

const initialValues = getInitialValues(form);

const palpationOptions = [
  { label: "Light", id: concepts.LIGHT_PALPATION },
  { label: "Deep", id: concepts.DEEP_PALPATION },
];

export const PalpationForm = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState<any>({});

  const palpationCheck = (palpation: string) => {
    if (!Array.isArray(formValues[form.palpation.name])) return;

    return formValues[form.palpation.name]?.find(
      (op: any) => op.id == palpation
    );
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={(values) =>
        onSubmit(
          values,
          getFormLabels(form, palpationOptions, [
            ...radioOptions,
            ...kidneyOptions,
          ])
        )
      }
    >
      <FormValuesListener getValues={setFormValues} />

      <SearchComboBox
        options={palpationOptions}
        name={form.palpation.name}
        label={form.palpation.label}
      />
      <br />

      {palpationCheck(concepts.LIGHT_PALPATION) && (
        <>
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.tenderness.name}
            label={form.tenderness.label}
          />
        </>
      )}

      {palpationCheck(concepts.DEEP_PALPATION) && (
        <>
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.hepatomegaly.name}
            label={form.hepatomegaly.label}
          />
          {formValues[form.hepatomegaly.name] ==
            getCachedConcept(YES)?.uuid && (
            <TextInputField
              multiline
              rows={5}
              sx={{ width: "100%" }}
              id={form.hepatomegalyDescription.name}
              name={form.hepatomegalyDescription.name}
              label={form.hepatomegalyDescription.label}
            />
          )}
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.splenomegaly.name}
            label={form.splenomegaly.label}
          />
          {formValues[form.splenomegaly.name] ==
            getCachedConcept(YES)?.uuid && (
            <TextInputField
              multiline
              rows={5}
              sx={{ width: "100%" }}
              id={form.splenomegalyDescription.name}
              name={form.splenomegalyDescription.name}
              label={form.splenomegalyDescription.label}
            />
          )}
        </>
      )}

      {/* <RadioGroupInput
        row
        options={radioOptions}
        name={form.kidneyBallotable.name}
        label={form.kidneyBallotable.label}
        coded
      />
      {formValues[form.kidneyBallotable.name] ==
        getCachedConcept(YES)?.uuid && (
        <RadioGroupInput
          row
          name={form.side.name}
          label={form.side.label}
          options={kidneyOptions}
          coded
        />
      )} */}
      <RadioGroupInput
        row
        options={radioOptions}
        name={form.fullBladder.name}
        label={form.fullBladder.label}
        coded
      />

      <RadioGroupInput
        row
        options={radioOptions}
        name={form.otherMasses.name}
        label={form.otherMasses.label}
        coded
      />

      {formValues[form.otherMasses.name] == getCachedConcept(YES)?.uuid && (
        <TextInputField
          multiline
          rows={5}
          sx={{ width: "100%" }}
          id={form.otherMassesDescription.name}
          name={form.otherMassesDescription.name}
          label={form.otherMassesDescription.label}
        />
      )}
    </FormikInit>
  );
};
