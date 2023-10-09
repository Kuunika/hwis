"use client";
import {
  FormikInit,
  MainPaper,
  MainTypography,
  TextInputField,
  WrapperBox,
} from "shared-ui/src";
import * as Yup from "yup";
import * as UUID from "uuid";
import { TitleWithBack } from "@/components/common";

const validationSchema = Yup.object().shape({
  label: Yup.string().required().label("Data Element"),
  description: Yup.string(),
});

export default function () {
  const handleSubmit = (values: any) => {
    fetch("http://localhost:3000/data-elements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, id: UUID.v4() }),
    }).then((response) => {
      console.log(response.json());
    });
  };

  return (
    <WrapperBox
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <MainPaper sx={{ p: 2, width: "40ch" }}>
        <TitleWithBack title="Create Data Element" />
        <br />
        <FormikInit
          initialValues={{ label: "", description: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <TextInputField name="label" id="label" label="Data Element" />
          <TextInputField
            name="description"
            id="description"
            label="Description"
          />
        </FormikInit>
      </MainPaper>
    </WrapperBox>
  );
}
