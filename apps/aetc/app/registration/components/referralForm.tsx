import { FC, useState } from "react";
import * as Yup from "yup";
import { FormikInit, RadioGroupInput, SearchComboBox, SelectInputField, TextInputField } from "shared-ui/src";
import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
  RegistrationCardTitle,
} from "./common";
import { getFacilities, useParameters } from "@/hooks";
import { TrackFormikContext } from ".";
import { concepts, encounters } from "@/constants";
import { getPatientEncounters } from "@/services/encounter";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getObservationValue } from "@/helpers/emr";

const schema = Yup.object().shape({
  [concepts.REFERRED_FROM]: Yup.string()
    .label("Referee Medical Facility"),
  [concepts.ADDITIONAL_NOTES]: Yup.string()
});

type Props = {
  initialValues: any;
  onSubmit: (values: any) => void;
  setContext: (context: any) => void;
};
export const ReferralForm: FC<Props> = ({
  onSubmit,
  initialValues,
  setContext,
}) => {
  const { data, isLoading } = getFacilities();
  const { params } = useParameters();
  const { data: encounterList, isLoading: loadingEncounters } = getPatientsEncounters(params?.id as string);
  const [isAvailable, setIsAvailable] = useState('yes')



  const referralEncounter = encounterList?.find(encounter => encounter.uuid == encounters.REFERRAL);
  const referred = getObservationValue(referralEncounter?.obs, concepts.IS_PATIENT_REFERRED);



  return (
    <>
      <RegistrationMainHeader id="3">Referral</RegistrationMainHeader>
      <RegistrationDescriptionText>
        The Referral section is mainly responsible for capturing the health
        facility from which the patient was referred from.
      </RegistrationDescriptionText>
      <FormikInit
        validationSchema={schema}
        initialValues={{ ...initialValues, [concepts.ADDITIONAL_NOTES]: "yes" }}
        onSubmit={onSubmit}
        submitButton={false}
        submitButtonText="next"
      >
        <TrackFormikContext setFormContext={setContext} />
        <RegistrationCard>
          <RegistrationCardTitle>Health Facilities</RegistrationCardTitle>
          {isLoading ? (
            <>loading facilities...</>
          ) : (
            <SearchComboBox
              label="Referral Medical Facility"
              name={concepts.REFERRED_FROM}
              multiple={false}
              disabled={isAvailable == 'no'}
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
          <RadioGroupInput
            name={concepts.ADDITIONAL_NOTES}
            getValue={(value: any) => { setIsAvailable(value) }}
            label={"Is the facility you are looking for available?"}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />


          {isAvailable == "no" && <TextInputField name={concepts.REFERRED_FROM} label="Other Facility" id={concepts.REFERRED_FROM} />}
        </RegistrationCard>
      </FormikInit>
    </>
  );
};
