import { FC } from "react";
import * as Yup from "yup";
import { FormikInit, SearchComboBox, SelectInputField } from "shared-ui/src";
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

const schema = Yup.object().shape({
  [concepts.REFERRED_FROM]: Yup.string()
    .label("Referee Medical Facility"),
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

  console.log({ encounterList });

  const referralEncounter = encounterList?.find(encounter => encounter.uuid == encounters.REFERRAL);

  return (
    <>
      <RegistrationMainHeader id="3">Referral</RegistrationMainHeader>
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
        </RegistrationCard>
      </FormikInit>
    </>
  );
};
