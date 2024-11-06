import { FormikInit, TextInputField, MainButton } from "@/components";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  ip_address: Yup.string()
    .required()
    .label("Link")
    .matches(
      /^http:\/\/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/,
      "Link must be in the format http://x.x.x.x:port, with a valid port number (0-65535)"
    ),
});

export const PrinterForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues: any;
  onSubmit: (values: any) => void;
}) => {
  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
      submitButton={false}
    >
      <TextInputField
        name="name"
        label="Name"
        id="Name"
        sx={{ width: "100%" }}
      />

      <TextInputField
        name="ip_address"
        label="Link"
        id="Link"
        sx={{ width: "100%" }}
      />

      <MainButton type="submit" title={"Submit"} onClick={() => {}} />
    </FormikInit>
  );
};
