import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts } from "@/constants";
import { Box, Button } from "@mui/material";
import { useState } from "react";

import * as Yup from "yup";

const schema = Yup.object().shape({
  [concepts.ABNORMALITIES]: Yup.array()
    .required()
    .label("Description of Abnormality"),
    [concepts.DESCRIPTION]: Yup.string().label('specify')
});

type Props = {
  onSubmit: (values: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.ABSENT, label: "Absent" },
  { id: concepts.REDUCED, label: "Reduced" },
  { id: concepts.ADDED, label: "Added" },
  { id: concepts.CRACKLES, label: "Crackles" },
  { id: concepts.WHEEZES, label: "Wheezes" },
  { id: concepts.BRONCHIAL, label: "Bronchial" },
  { id: concepts.OTHER, label: "Others" },
];

export const BreathingSoundsChestLungForm = (props: Props) => {
  const [showOther,setOther]=useState(false)
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{ description: "", notes: "" }}
      onSubmit={props.onSubmit}
      submitButton={false}
      submitButtonText="next"
    >
      <br />
      <SearchComboBox
        multiple={false}
        name={concepts.ABNORMALITIES}
        getValue={(values) => {
          if (values)
            setOther(Boolean(values==concepts.OTHER))
      }}
        label={"Description of Abnormality"}
        options={options}
      />
      <br />
      {showOther && <TextInputField name={concepts.DESCRIPTION} label="Specify" id="Specify" />}
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
