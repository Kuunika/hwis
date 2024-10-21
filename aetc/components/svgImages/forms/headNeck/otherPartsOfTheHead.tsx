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
  descriptionOfBruises: {
    name: concepts.DESCRIPTION,
    label: "Description Of Bruise",
  },
 
};

type Prop = {
  onSubmit: (values: any) => void;
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.array()
    .required()
    .label(form.abnormalities.label),
  [form.lacerationDepth.name]: Yup.string()
    .label(form.lacerationDepth.label),
  [form.lacerationOther.name]: Yup.string()
    .label(form.lacerationOther.label),
  [form.lacerationLength.name]: Yup.string()
    .label(form.lacerationLength.label),
  [form.descriptionOfBruises.name]: Yup.string()
    .label(form.descriptionOfBruises.label),
 
});

const initialsValues = getInitialValues(form);


const abnormalities = [
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.BRUISE, label: "Bruise" },
  { id: concepts.HAEMATOMA, label: "Haematoma" },
  { id: concepts.FRACTURE, label: "Fracture" },
//   { id: concepts.OTHER, label: "Other" },
];

export const OtherPartsOfTheHeadForm = ({ onSubmit }: Prop) => {

  const [formValues, setFormValues] = useState<any>({});
  const [showBruiseDescription, setShowBruiseDescription] =
  useState<boolean>(false);
  const [showLaceration, setShowLaceration] =
    useState<boolean>(false);

  const handleValueChange = (values: Array<any>) => {
    console.log( Boolean(values.find((v) => v.id == concepts.BRUISE)));
    setShowLaceration(
      Boolean(values.find((v) => v.id == concepts.LACERATION))
    );
    setShowBruiseDescription(
      Boolean(values.find((v) => v.id == concepts.BRUISE))
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
        <SearchComboBox
          getValue={handleValueChange}
          name={form.abnormalities.name}
          label={form.abnormalities.label}
          options={abnormalities}
        />
          {showBruiseDescription && (
          <>
            <TextInputField
              sx={{ my: "1ch",width:"100%" }}
              id={form.descriptionOfBruises.name}
              name={form.descriptionOfBruises.name}
              label={form.descriptionOfBruises.label}
            />
          </>
        )}


        {showLaceration && (
          <>
            <TextInputField
              sx={{ my: "1ch",width:"100%" }}
              id={form.lacerationLength.name}
              name={form.lacerationLength.name}
              label={form.lacerationLength.label}
            />
            <TextInputField
              sx={{ my: "1ch",width:"100%" }}
              id={form.lacerationDepth.name}
              name={form.lacerationDepth.name}
              label={form.lacerationDepth.label}
            />
            <TextInputField
              sx={{ my: "1ch",width:"100%" }}
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
