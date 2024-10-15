import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts } from "@/constants";
import { Box, Button } from "@mui/material";
import { useState } from "react";

import * as Yup from "yup";

const schema = Yup.object().shape({
  [concepts.ABNORMALITIES]: Yup.array()
    .required()
    .label("Description of Abnormality"),
});

type Props = {
  onSubmit: (values: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.HYPERRESONANT, label: "Hyperresonant" },
  { id: concepts.DULL, label: "Dull" },
  { id: concepts.STONY_DULL, label: "Stony Dull" },
];

export const PercussionChestLungForm = (props: Props) => {
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
        label={"Description of Abnormality"}
        options={options}
      />
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
