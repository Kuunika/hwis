import * as Yup from "yup";
import { FormikInit, TextInputField } from "shared-ui/src/form";

type Prop = {
  onSubmit: (values: any) => void;
};

const validationSchema = Yup.object().shape({
  label: Yup.string().required().label("Data Element"),
  description: Yup.string(),
});

export const OptionSetForm = ({ onSubmit }: Prop) => {
  return (
    <FormikInit
      initialValues={{ label: "", description: "" }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <TextInputField name="label" id="label" label="Option Set" />
      <TextInputField name="description" id="description" label="Description" />
    </FormikInit>
  );
};
