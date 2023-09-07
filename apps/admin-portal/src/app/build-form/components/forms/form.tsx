import { FC } from "react";
import { FormikInit, TextInputField, WrapperBox } from "shared-ui/src";
import * as Yup from "yup";
type Prop = {
  onSubmit: (values: any) => void;
  initialValues?: any;
};

const schema = Yup.object().shape({
  name: Yup.string().required().label("Form Name"),
});

const initValues = {
  name: "",
};
export const Form: FC<Prop> = ({ onSubmit, initialValues = initValues }) => {
  return (
    <WrapperBox width={"50ch"}>
      <FormikInit
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={schema}
      >
        <TextInputField name="name" id="name" label="Form Name" />
      </FormikInit>
    </WrapperBox>
  );
};
