import { FC } from "react";
import * as Yup from "yup";
import { FormikInit, SelectInputField } from "shared-ui/src";
import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
  RegistrationCardTitle,
} from "./common";

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
    <>
      <RegistrationMainHeader>Referral</RegistrationMainHeader>
      <RegistrationDescriptionText>
        The Referral section is mainly responsible for capturing the health
        facility from which the patient was referred from.
      </RegistrationDescriptionText>
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitButton={false}
        submitButtonText="next"
      >
        <RegistrationCard>
          <RegistrationCardTitle>Marital Status</RegistrationCardTitle>
          <SelectInputField
            label="Referee Medical Facility"
            id="refereeMedicalFacility"
            name="refereeMedicalFacility"
            selectItems={[{ name: "Bwaila", value: "Bwaila" }]}
          />
        </RegistrationCard>
      </FormikInit>
    </>
  );
};
