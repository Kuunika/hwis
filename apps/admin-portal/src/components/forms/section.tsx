"use client";
import { FC } from "react";
import {
  FormikInit,
  TextInputField,
  WrapperBox,
  SearchComboBox,
  defaultTheme,
  MainButton,
} from "shared-ui/src";
import * as Yup from "yup";

import { useDataElements } from "@/hooks";
type Prop = {
  onSubmit: (values: any, actions?: any) => void;
  initialValues?: any;
  onNextSection: () => void;
};

const schema = Yup.object().shape({
  fragmentName: Yup.string().required().label("Form Name"),
  dataElements: Yup.array().required().label("Data Elements"),
});

const initValues = {
  fragmentName: "",
  dataElements: "",
};

export const SectionForm: FC<Prop> = ({
  onSubmit,
  initialValues = initValues,
  onNextSection,
}) => {
  const { data: dataElements, isLoading } = useDataElements().getDataElements();

  return (
    <WrapperBox width={"50ch"}>
      <FormikInit
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={schema}
        submitButtonText="Add Section"
        submitVariant="text"
      >
        <TextInputField
          name="fragmentName"
          id="fragmentName"
          label="Section Name"
        />
        <SearchComboBox
          name="dataElements"
          options={
            dataElements
              ? dataElements.map((d) => ({ id: d.id, label: d.label }))
              : []
          }
          label="Data Elements"
        />
      </FormikInit>
      <MainButton sx={{ mt: "1ch" }} title="next" onClick={onNextSection} />
    </WrapperBox>
  );
};
