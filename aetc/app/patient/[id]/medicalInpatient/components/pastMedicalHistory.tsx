import {
  DatePickerInput,
  FormDatePicker,
  FormikInit,
  FormValuesListener,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import { getFacilities } from "@/hooks";
import useFetchMedications from "@/hooks/useFetchMedications";
import { useState } from "react";
import * as Yup from "yup";

const form = {
  hivStatus: {
    name: concepts.HIV,
    label: "HIV status",
  },
  arvStatus: {
    name: concepts.ARV,
    label: "on antiretrovirals (ARVs)",
  },
  drugList: {
    name: concepts.DRUG_GIVEN,
    label: "ARVs given",
  },
  otherArvMedication: {
    name: concepts.OTHER_MEDICATION,
    label: "Other Medication",
  },
  sinceWhen: {
    name: concepts.DATE,
    label: "Since When",
  },
  clinic: {
    name: concepts.HEALTH_CENTER,
    label: "Clinic",
  },
  other: {
    name: concepts.OTHER,
    label: "Other",
  },
  surgicalHistory: {
    name: concepts.SURGICAL_HISTORY,
    label: "Surgical History",
  },
  allergy: {
    name: concepts.ALLERGY,
    label: "Allergy",
  },
  allergyDetails: {
    name: concepts.ALLERGY_DETAILS,
    label: "Other",
  },
  intoxication: {
    name: concepts.INTOXICATION,
    label: "Intoxication",
  },
  intoxicationDescription: {
    name: concepts.INTOXICATION_DESCRIPTION,
    label: "Intoxication description",
  },
  socialHistory: {
    name: concepts.SOCIAL_HISTORY,
    label: "Social History",
  },
  familyHistory: {
    name: concepts.FAMILY_HISTORY,
    label: "Family History",
  },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

const hivOptions = [
  { value: concepts.POSITIVE, label: "Positive" },
  { value: concepts.NEGATIVE, label: "Negative" },
  { value: concepts.UNKNOWN, label: "unknown" },
];

const radioOptions = [
  { value: concepts.YES, label: "YES" },
  { value: concepts.NO, label: "NO" },
];
export const PastMedicalHistory = () => {
  const { data, isLoading } = getFacilities();
  const [formValues, setFormValues] = useState<any>({});
  const { medicationOptions } = useFetchMedications();

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={() => {}}
    >
      <FormValuesListener getValues={setFormValues} />
      <RadioGroupInput
        name={form.hivStatus.name}
        label={form.hivStatus.label}
        options={hivOptions}
        row
      />
      {formValues[form.hivStatus.name] == concepts.POSITIVE && (
        <>
          <RadioGroupInput
            options={radioOptions}
            name={form.arvStatus.name}
            label={form.arvStatus.label}
            row
          />
          {formValues[form.arvStatus.name] == concepts.YES && (
            <>
              <SearchComboBox
                name={form.drugList.name}
                label={form.drugList.label}
                options={medicationOptions}
              />
              <TextInputField
                multiline
                rows={4}
                name={form.otherArvMedication.name}
                label={form.otherArvMedication.label}
                id={form.otherArvMedication.name}
                sx={{ width: "100%" }}
              />
              <br />
              <FormDatePicker
                name={form.sinceWhen.name}
                label={form.sinceWhen.label}
                width={"100%"}
              />
              <br />
              <SearchComboBox
                label="Referral Medical Facility"
                name={form.clinic.name}
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
            </>
          )}
        </>
      )}
      <TextInputField
        multiline
        rows={5}
        name={form.other.name}
        label={form.other.label}
        id={form.other.name}
        sx={{ width: "100%" }}
      />
      <TextInputField
        multiline
        rows={5}
        name={form.surgicalHistory.name}
        label={form.surgicalHistory.label}
        id={form.surgicalHistory.name}
        sx={{ width: "100%" }}
      />
    </FormikInit>
  );
};
