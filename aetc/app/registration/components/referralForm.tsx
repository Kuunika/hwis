import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import {
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  SelectInputField,
  TextInputField,
} from "@/components";
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
import { getConceptSetMembers } from "@/hooks/labOrder";
import { Box, Button, Typography } from "@mui/material";

const schema = Yup.object().shape({
  [concepts.REFERRED_FROM]: Yup.string().label("Referee Medical Facility"),
  [concepts.ADDITIONAL_NOTES]: Yup.string().label("Additional Notes"),
  [concepts.DIAGNOSIS]: Yup.array().label("Diagnosis"),
});

type Props = {
  initialValues: any;
  onSubmit: (values: any) => void;
  setContext: (context: any) => void;
  onSkip?: () => void;
};
export const ReferralForm: FC<Props> = ({
  onSubmit,
  initialValues,
  setContext,
  onSkip,
}) => {
  const { data, isLoading } = getFacilities();
  const { params } = useParameters();
  const { data: encounterList, isLoading: loadingEncounters } =
    getPatientsEncounters(params?.id as string);
  const [isAvailable, setIsAvailable] = useState("yes");
  const [selectedValue, setSelectedValue] = useState("");
  const {
    data: diagnosis,
    isLoading: loadingDiagnosis,
    refetch: reloadDiagnosis,
    isRefetching: reloadingDiagnosis,
  } = getConceptSetMembers("b9af45fa-8d80-11d8-abbb-0024217bb78e");

  const referralEncounter = encounterList?.find(
    (encounter) =>
      encounter.encounter_type.uuid == encounters.SCREENING_ENCOUNTER
  );
  const referred = getObservationValue(
    referralEncounter?.obs,
    concepts.IS_PATIENT_REFERRED
  );

  useEffect(() => {
    reloadDiagnosis();
  }, []);

  return (
    <>
      <RegistrationMainHeader id="3">Referral</RegistrationMainHeader>
      <RegistrationDescriptionText>
        The Referral section is mainly responsible for capturing the health
        facility from which the patient was referred from.
      </RegistrationDescriptionText>
      <FormikInit
        validationSchema={schema}
        initialValues={{
          [concepts.ADDITIONAL_NOTES]: "yes",
          [concepts.REFERRED_FROM]: "",
          [concepts.DIAGNOSIS]: "",
          ...initialValues,
        }}
        onSubmit={onSubmit}
        submitButton={false}
        submitButtonText="next"
      >
        <TrackFormikContext setFormContext={setContext} />
        <RegistrationCard>
          <RegistrationCardTitle>Health Facilities</RegistrationCardTitle>

          {referred == "No" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1">
                Patient Was not referred
              </Typography>
              <Button
                onClick={() => {
                  onSubmit({
                    [concepts.ADDITIONAL_NOTES]: "N/A",
                    [concepts.REFERRED_FROM]: "N/A",
                    [concepts.DIAGNOSIS]: "",
                  });
                  if (onSkip) onSkip();
                }}
              >
                skip step
              </Button>
            </Box>
          )}
          {isLoading ? (
            <>loading facilities...</>
          ) : (
            <SearchComboBox
              label="Referral Medical Facility"
              name={concepts.REFERRED_FROM}
              multiple={false}
              getValue={setSelectedValue}
              disabled={isAvailable == "no" || referred == "No"}
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
              disabled={referred == "No"}
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
          <SearchComboBox
            sx={{ mt: "1ch" }}
            options={
              diagnosis?.map((d) => {
                return {
                  id: d?.names[0]?.uuid as string,
                  label: d?.names[0]?.name as string,
                };
              }) ?? []
            }
            label="Diagnosis"
            disabled={referred == "No"}
            name={concepts.DIAGNOSIS}
          />
        </RegistrationCard>
      </FormikInit>
    </>
  );
};
