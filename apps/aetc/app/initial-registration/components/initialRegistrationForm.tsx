import {
  FieldsContainer,
  FormikInit,
  SearchComboBox,
  TextInputField,
} from "shared-ui/src";
import * as yup from "yup";

type props = {
  initialValues: any;
  onSubmit: (values: any) => void;
};

const form = {
  firstName: {
    name: "firstName",
    label: "First Name",
  },
  lastName: {
    name: "lastName",
    label: "Last Name",
  },
};

const schema = yup.object({
  [form.firstName.name]: yup.string().required().label(form.firstName.label),
  [form.lastName.name]: yup.string().required().label(form.lastName.label),
});

export const InitialRegistrationForm = ({ initialValues, onSubmit }: props) => {
  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      <TextInputField
        name={form.firstName.name}
        label={form.firstName.label}
        id={form.firstName.name}
      />
      <TextInputField
        name={form.lastName.name}
        label={form.lastName.label}
        id={form.lastName.name}
      />
    </FormikInit>
  );
};
