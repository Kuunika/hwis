import React from "react";
import {
  FormikInit,
  WrapperBox,
  TextInputField,
  MainButton,
} from "shared-ui/src";
import * as Yup from "yup";

import { getInitialValues, notify } from "@/helpers";
import { districts, traditionalAuthorities } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
  init?: any;
};
const form = {
  npid: {
    name: "npid",
    label: "NPID",
  },
};

const schema = Yup.object().shape({
  [form.npid.name]: Yup.string().required().label(form.npid.label),
});

const initialValues = getInitialValues(form);

export const SearchNPIDForm = ({ onSubmit, init }: Prop) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{ ...initialValues, ...init }}
      onSubmit={onSubmit}
      submitButton={false}
    >
      <WrapperBox>
        <TextInputField
          sx={{ width: "100%", my: 0 }}
          name={form.npid.name}
          id={form.npid.name}
          size="small"
          label={form.npid.label}
        />
        <br />
        <br />

        <MainButton
          sx={{ width: "100%", height: "5ch", borderRadius: "10px" }}
          type="submit"
          onClick={() => {}}
          title={"search"}
        />
      </WrapperBox>
    </FormikInit>
  );
};
