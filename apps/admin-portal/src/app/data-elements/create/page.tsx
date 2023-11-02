"use client";
import {
  FormikInit,
  MainPaper,
  MainTypography,
  TextInputField,
  WrapperBox,
} from "shared-ui/src";

import { useEffect } from "react";
import * as Yup from "yup";

import { TitleWithBack } from "@/components/common";
import { useRouter } from "next/navigation";
import { useDataElements } from "@/hooks";

const validationSchema = Yup.object().shape({
  label: Yup.string().required().label("Data Element"),
  description: Yup.string(),
});

export default function () {
  const { mutate, isLoading, isSuccess } =
    useDataElements().useAddDataElement();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const data = await mutate(values);
    // router.back();
  };

  useEffect(() => {
    if (isSuccess) {
      router.back();
    }
  }, [isSuccess]);

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
          loading={isLoading}
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
