import { FC } from "react";
import * as Yup from "yup";
import { FormikInit, TextInputField } from "shared-ui/src";

const schema = Yup.object().shape({
  search: Yup.string().required().label("Patient's name"),
});

const initialValues = {
  search: "",
};
type Props = {
  onSubmit: (values: any) => void;
};
export const PatientSearchForm: FC<Props> = ({ onSubmit }) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="search"
    >
      <TextInputField name="search" id="search" label="Search" />
    </FormikInit>
  );
};
