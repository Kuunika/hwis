import {
  DatePickerInput,
  FormDatePicker,
  FormikInit,
  FormValuesListener,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import { concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import { getFacilities } from "@/hooks";
import { useAllergyFormat } from "@/hooks/useAllergyFormat";
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

const intoxications = [
  { id: "ethanol", label: "Ethanol (Beer, Wine, Spirits)" },
  { id: "methanol", label: "Methanol" },
  { id: "isopropanol", label: "Isopropanol (Rubbing alcohol)" },
  { id: "cannabis", label: "Cannabis (Marijuana, THC products)" },
  { id: "cocaine", label: "Cocaine" },
  { id: "heroin", label: "Heroin" },
  { id: "methamphetamine", label: "Methamphetamine" },
  { id: "mdma", label: "MDMA (Ecstasy)" },
  { id: "lsd", label: "LSD (Acid)" },
  { id: "pcp", label: "PCP (Phencyclidine)" },
  { id: "ketamine", label: "Ketamine" },
  {
    id: "opioids",
    label: "Opioids (Morphine, Codeine, Oxycodone, Fentanyl, Tramadol)",
  },
  {
    id: "benzodiazepines",
    label: "Benzodiazepines (Diazepam, Lorazepam, Alprazolam)",
  },
  { id: "barbiturates", label: "Barbiturates (Phenobarbital, Secobarbital)" },
  {
    id: "antidepressants",
    label: "Antidepressants (Amitriptyline, Fluoxetine, Sertraline)",
  },
  { id: "antipsychotics", label: "Antipsychotics (Haloperidol, Olanzapine)" },
  { id: "acetaminophen", label: "Acetaminophen (Paracetamol)" },
  { id: "nsaids", label: "NSAIDs (Ibuprofen, Diclofenac)" },
  { id: "carbon_monoxide", label: "Carbon Monoxide" },
  { id: "cyanide", label: "Cyanide" },
  { id: "pesticides", label: "Pesticides (Organophosphates, Carbamates)" },
  { id: "heavy_metals", label: "Heavy Metals (Lead, Mercury, Arsenic)" },
  { id: "antifreeze", label: "Antifreeze (Ethylene glycol)" },
  { id: "paint_thinners", label: "Paint thinners, Glue (Toluene, Xylene)" },
  { id: "mushrooms", label: "Mushrooms (Amanita, Psilocybin)" },
  { id: "aflatoxins", label: "Aflatoxins (Contaminated grains, nuts)" },
  { id: "strychnine", label: "Strychnine" },
  { id: "poisonous_plants", label: "Poisonous berries or plants" },
  { id: "synthetic_cannabinoids", label: "Synthetic Cannabinoids (Spice, K2)" },
  { id: "bath_salts", label: "Bath salts (Synthetic cathinones)" },
  { id: "inhalants", label: "Inhalants (Nitrous oxide, Butane, Freon)" },
  { id: concepts.OTHER, label: "Other" },
];

export const PastMedicalHistory = () => {
  const { data, isLoading } = getFacilities();
  const [formValues, setFormValues] = useState<any>({});
  const { medicationOptions } = useFetchMedications();
  const { allergyOptions } = useAllergyFormat();

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
      <br />
      <GroupedSearchComboBox
        options={allergyOptions}
        multiple={true}
        name={form.allergy.name}
        label={form.allergy.label}
      />
      <br />
      <SearchComboBox
        options={intoxications}
        name={form.intoxication.name}
        label={form.intoxication.label}
      />
      {formValues[form.intoxication.name] &&
        formValues[form.intoxication.name]?.find(
          (opt: any) => opt.id == concepts.OTHER
        ) && (
          <>
            <TextInputField
              multiline
              rows={5}
              sx={{ width: "100%" }}
              name={form.intoxicationDescription.name}
              label={form.intoxicationDescription.label}
              id={form.intoxicationDescription.name}
            />
          </>
        )}
      <br />
      <TextInputField
        multiline
        rows={5}
        sx={{ width: "100%" }}
        id={form.socialHistory.name}
        label={form.socialHistory.label}
        name={form.socialHistory.name}
      />
      <br />
      <TextInputField
        multiline
        rows={5}
        sx={{ width: "100%" }}
        id={form.familyHistory.name}
        label={form.familyHistory.label}
        name={form.familyHistory.name}
      />
    </FormikInit>
  );
};
