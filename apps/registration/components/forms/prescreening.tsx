import { FC, useState } from "react";
import * as Yup from "yup";
import { FormikInit, SearchComboBox, SelectInputField } from "shared-ui/src";
import { Box } from "@mui/material";

const schema = Yup.object().shape({
  referral: Yup.string().required().label("Referral"),
  facility: Yup.string().label("Facility"),
});

const initialValues = {
  referral: "",
  facility: "",
};
type Props = {
  onSubmit: (values: any) => void;
};
export const PrescreeningForm: FC<Props> = ({ onSubmit }) => {
  const [referral, setReferral] = useState("");
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="submit"
    >
      <Box my={1}>
        <SelectInputField
          name="referral"
          label="Referral"
          id="referral"
          getValue={(value: any) => setReferral(value)}
          selectItems={[
            { name: "Referral Emergency", value: "referralEmergency" },
            { name: "Non Referral Emergency", value: "nonReferralEmergency" },
            { name: "Primary Care", value: "primary" },
            { name: "Secondary Care", value: "secondary" },
          ]}
        />

        {(referral == "primary" || referral == "secondary") && (
          <SearchComboBox
            name="facility"
            label="Facility"
            options={[
              { id: "1", label: "Bwaila" },
              { id: "2", label: "Queens" },
            ]}
          />
        )}
      </Box>
    </FormikInit>
  );
};
