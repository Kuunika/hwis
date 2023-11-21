import { FC } from "react";
import * as Yup from "yup";
import { FormikInit, SelectInputField } from "shared-ui/src";

const schema = Yup.object().shape({
  refereeMedicalFacility: Yup.string()
    .required()
    .label("Referee Medical Facility"),
});

type Props = {
  initialValues: any;
  onSubmit: () => void;
};
export const ReferralForm: FC<Props> = ({ onSubmit, initialValues }) => {
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
