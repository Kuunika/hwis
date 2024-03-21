import {
  FieldsContainer,
  FormikInit,
  MainButton,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "shared-ui/src";
import * as yup from "yup";

type props = {
  initialValues: any;
  onSubmit: (values: any, options: any) => void;
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



// Define a regular expression pattern to match alphabet letters and the ' symbol
const nameRegex = /^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/;

// Define the Yup schema
const schema = yup.object({
  [form.firstName.name]: yup
      .string()
      .matches(nameRegex, { message: 'Only alphabetic letters are allowed' })
      .required()
      .label(form.firstName.label),
  [form.lastName.name]: yup
      .string()
      .matches(nameRegex, { message: 'Only alphabetic letters are allowed' })
      .required()
      .label(form.lastName.label),
});

export const InitialRegistrationForm = ({ initialValues, onSubmit }: props) => {
  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
      submitButton={false}
    >
      <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
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
      </WrapperBox>
      <MainButton type="submit" title={"Submit"} onClick={() => {}} />
    </FormikInit>
  );
};
