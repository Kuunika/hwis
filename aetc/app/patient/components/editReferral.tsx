import { FC, useState } from "react";
import * as Yup from "yup";
import {
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";

import { getFacilities } from "@/hooks";

import { concepts } from "@/constants";

import {
  RegistrationCard,
  RegistrationCardTitle,
} from "@/app/registration/components/common";
import { TrackFormikContext } from "@/app/registration/components";

const schema = Yup.object().shape({
  [concepts.REFERRED_FROM]: Yup.string().label("Referee Medical Facility"),
  [concepts.ADDITIONAL_NOTES]: Yup.string(),
});

type Props = {
  onSubmit: (values: any) => void;
  setContext?: (context: any) => void;
  submitButton?: boolean;
};
export const EditReferralForm: FC<Props> = ({
  onSubmit,
  submitButton = true,
  setContext = (values) => {},
}) => {
  const { data, isLoading } = getFacilities();
  const [isAvailable, setIsAvailable] = useState("yes");
  const [selectedValue, setSelectedValue] = useState("");

  return (
    <>
      <FormikInit
        validationSchema={schema}
        initialValues={{
          [concepts.REFERRED_FROM]: "",
          [concepts.ADDITIONAL_NOTES]: "yes",
        }}
        onSubmit={onSubmit}
        submitButtonText="submit"
        submitButton={submitButton}
      >
        <TrackFormikContext setFormContext={setContext} />
        <RegistrationCardTitle>Health Facilities</RegistrationCardTitle>
        {isLoading ? (
          <>loading facilities...</>
        ) : (
          <SearchComboBox
            label="Referral Medical Facility"
            name={concepts.REFERRED_FROM}
            getValue={setSelectedValue}
            multiple={false}
            disabled={isAvailable == "no"}
            options={
              data
                ? data.map((d: any) => ({
                    id: d.facility_name,
                    label: d.facility_name,
                  }))
                : []
            }
          />
        )}
        {selectedValue == "" && (
          <RadioGroupInput
            name={concepts.ADDITIONAL_NOTES}
            getValue={(value: any) => {
              setIsAvailable(value);
            }}
            label={"Is the facility you are looking for available?"}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        )}
        {isAvailable == "no" && (
          <TextInputField
            name={concepts.REFERRED_FROM}
            label="Other Facility"
            id={concepts.REFERRED_FROM}
          />
        )}
      </FormikInit>
    </>
  );
};
