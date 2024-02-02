import { FC } from "react";
import * as Yup from "yup";
import { FormikInit, SelectInputField } from "shared-ui/src";
import {} from "../../hooks";

const schema = Yup.object().shape({
  refereeMedicalFacility: Yup.string()
    .required()
    .label("Referee Medical Facility"),
});

const initialValues = {
  refereeMedicalFacility: "",
};
type Props = {
  onSubmit: () => void;
};
export const ReferralForm: FC<Props> = ({ onSubmit }) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <SelectInputField
        label="Referee Medical Facility"
        id="refereeMedicalFacility"
        name="refereeMedicalFacility"
        selectItems={[{ name: "Bwaila", value: "Bwaila" }]}
      />
    </FormikInit>
  );
};
