"use client";
import React, { useEffect, useState } from "react";
import {
  FormikInit,
  WrapperBox,
  FormFieldContainer,
  CheckboxesGroup,
  FormFieldContainerLayout,
  TextInputField,
} from "@/components";
import * as Yup from "yup";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useFormikContext } from "formik";
import { useServerTime } from "@/contexts/serverTimeContext";

// Family History options
const familyHistoryOptions = [
  { value: concepts.FAMILY_HISTORY_ASTHMA, label: "Asthma" },
  { value: concepts.FAMILY_HISTORY_DIABETES_MELLITUS, label: "Diabetes" },
  { value: concepts.FAMILY_HISTORY_EPILEPSY, label: "Epilepsy" },
  { value: concepts.FAMILY_HISTORY_HYPERTENSION, label: "Hypertension" },
  { value: concepts.FAMILY_HISTORY_CANCER, label: "Cancer" },
];

const schema = Yup.object().shape({
  familyHistory: Yup.array().min(1, "Please select at least one option"),
  cancerType: Yup.string().when("familyHistory", {
    is: (values: any[]) =>
      values?.some(
        (item: { key: string; value: any }) =>
          item.key === concepts.FAMILY_HISTORY_CANCER && item.value
      ),
    then: (schema) => schema.required("Please specify the type of cancer"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

export const FamilyHistoryForm = ({ onSubmit, onSkip }: Prop) => {
  const { params } = useParameters();
  const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
  const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
  const { data: patientVisits } = getPatientVisitTypes(params.id as string);
  const { init, ServerTime } = useServerTime();

  useEffect(() => {
    if (patientVisits) {
      const active = patientVisits.find((visit) => !visit.date_stopped);
      if (active) {
        setActiveVisit(active as unknown as Visit);
      }
    }
  }, [patientVisits]);

  const handleSubmit = async (values: any) => {
    const currentDateTime = ServerTime.getServerTimeString();
    const selectedFamilyOptions = (values.familyHistory || [])
      .filter((item: any) => item.value)
      .map((item: any) => item.key);

    // Create observations array but exclude cancer if it's selected (we'll handle it separately)
    let obs = selectedFamilyOptions
      .filter(
        (optionKey: string) => optionKey !== concepts.FAMILY_HISTORY_CANCER
      )
      .map((optionKey: string) => {
        // Find the corresponding option to get its label
        const option = familyHistoryOptions.find(
          (opt) => opt.value === optionKey
        );
        const label = option ? option.label : "Unknown";

        return {
          concept: optionKey,
          value: label,
          obsDatetime: currentDateTime,
        };
      });

    // Add cancer observation with the cancer type as value
    const hasCancer = selectedFamilyOptions.includes(
      concepts.FAMILY_HISTORY_CANCER
    );
    if (hasCancer && values.cancerType) {
      obs.push({
        concept: concepts.FAMILY_HISTORY_CANCER,
        value: values.cancerType, // Use the cancer type directly
        obsDatetime: currentDateTime,
      });
    }

    const payload = {
      encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: currentDateTime,
      obs,
    };

    try {
      await submitEncounter(payload);
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting Family History:", error);
    }
  };

  const CancerTypeField = () => {
    const { values } = useFormikContext<any>();

    // Check if Cancer is selected in familyHistory
    const isCancerSelected = values.familyHistory?.some(
      (item: any) => item.key === concepts.FAMILY_HISTORY_CANCER && item.value
    );

    if (!isCancerSelected) {
      return null;
    }

    return (
      <TextInputField
        name="cancerType"
        label="Type of Cancer"
        placeholder="Specify cancer type"
        id="cancerType"
      />
    );
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{
        familyHistory: [],
        cancerType: "",
      }}
      onSubmit={handleSubmit}
    >
      <FormFieldContainer direction="column">
        <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
          <FormFieldContainerLayout title="Family History">
            <CheckboxesGroup
              name="familyHistory"
              allowFilter={false}
              options={familyHistoryOptions}
            />
            <CancerTypeField />
          </FormFieldContainerLayout>
        </WrapperBox>
      </FormFieldContainer>
    </FormikInit>
  );
};
