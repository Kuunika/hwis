import { NotificationContainer } from "@/components";
import { useState } from "react";
import {
  FieldsContainer,
  FormDatePicker,
  FormValuesListener,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "shared-ui/src";
import * as Yup from "yup";

const form = {
  isAirwayPatent: {
    name: "isAirwayPatent",
    label: "Is Airway Patent",
  },
  isPatientInjured: {
    name: "isPatientInjured",
    label: "Is Patient Injured",
  },
  neckCollar: {
    name: "neckCollar",
    label: "Neck Collar Applied",
  },
  weakness: {
    name: "weakness",
    label: "Weakness",
  },
  headBlocks: {
    name: "headBlocks",
    label: "Head Blocks Applied",
  },
  airWayThreatenedReason: {
    name: "airWayThreatenedReason",
    label: "Reason",
  },
  otherReason: {
    name: "otherReason",
    label: "specify",
  },
  intervention: {
    name: "intervention",
    label: "Airway Opening Intervention",
  },
  nasopharyngealSize: {
    name: "nasopharyngeal",
    label: "Nasopharyngeal Airway Size",
  },
  oropharyngealSize: {
    name: "oropharyngeal",
    label: "oropharyngeal Airway Size",
  },
};

type Prop = {
  onSubmit: () => void;
};

const schema = Yup.object().shape({
  [form.isAirwayPatent.name]: Yup.string()
    .required()
    .label(form.isAirwayPatent.label),
  [form.headBlocks.name]: Yup.string().label(form.headBlocks.label),
  [form.neckCollar.name]: Yup.string().label(form.neckCollar.label),
  [form.airWayThreatenedReason.name]: Yup.string().label(
    form.airWayThreatenedReason.label
  ),
  [form.intervention.name]: Yup.string().label(form.intervention.label),
  [form.weakness.name]: Yup.string().required().label(form.weakness.label),
  [form.nasopharyngealSize.name]: Yup.string()
    .required()
    .label(form.nasopharyngealSize.label),
  date: Yup.date().label("date"),
  [form.oropharyngealSize.name]: Yup.string()
    .required()
    .label(form.oropharyngealSize.label),
});

const airwayThreatenedReasons = [
  { id: "secretion", label: "Secretions - blood, vomit, other" },
  { id: "Tongue swelling", label: "Tongue swelling" },
  { id: "Neck swelling", label: "Neck swelling" },
  { id: "Neck haematoma", label: "Neck haematoma" },
  { id: "Tongue falling back", label: "Tongue falling back" },
  { id: "other", label: "Other" },
];

const airwayInterventionsList = [
  { id: "Suctioning Airway", label: "Suctioning Airway" },
  { id: "Jaw thrust manoeuvre", label: "Jaw thrust manoeuvre" },
  { id: "Head tilt/chin lift", label: "Head tilt/chin lift" },
  {
    id: "oropharyngeal",
    label:
      "Airway adjunct (Oropharyngeal airway and size / nasopharyngeal airway)",
  },
];

const initialsValues = {
  concern: "",
  moderate: "",
  date: "",
};

export const AirwayForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});

  console.log(formValues);

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={onSubmit}
    >
      <FormValuesListener getValues={setFormValues} />

      <FieldsContainer sx={{ alignItems: "flex-start" }}>
        <RadioGroupInput
          name={form.isAirwayPatent.name}
          label={form.isAirwayPatent.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "Threatened", value: "threatened" },
          ]}
        />
        {formValues[form.isAirwayPatent.name] == "yes" && (
          <RadioGroupInput
            name={form.isPatientInjured.name}
            label={form.isPatientInjured.label}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        )}
      </FieldsContainer>
      <br />
      {formValues[form.isPatientInjured.name] == "yes" &&
        formValues[form.isAirwayPatent.name] == "yes" && (
          <>
            <NotificationContainer message="Please stabilize the C-Spine" />
            <br />
            <FieldsContainer sx={{ alignItems: "flex-start" }}>
              <RadioGroupInput
                name={form.neckCollar.name}
                label={form.neckCollar.label}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                  { label: "No Indicated", value: "notIndicated" },
                ]}
              />
              <RadioGroupInput
                name={form.headBlocks.name}
                label={form.headBlocks.label}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />
            </FieldsContainer>
            <br />
          </>
        )}
      {formValues[form.isAirwayPatent.name] === "threatened" && (
        <FieldsContainer>
          <SearchComboBox
            name={form.airWayThreatenedReason.name}
            label={form.airWayThreatenedReason.label}
            options={airwayThreatenedReasons}
            multiple={false}
          />
        </FieldsContainer>
      )}

      {formValues[form.isAirwayPatent.name] === "no" && (
        <>
          {formValues[form.airWayThreatenedReason.name] == "other" && (
            <>
              <br />
              <FieldsContainer>
                <TextInputField
                  sx={{ m: 0 }}
                  name={form.otherReason.name}
                  label={form.otherReason.label}
                  id={form.otherReason.name}
                />
              </FieldsContainer>
            </>
          )}

          <br />
          <FieldsContainer>
            <SearchComboBox
              name={form.intervention.name}
              label={form.intervention.label}
              options={airwayInterventionsList}
              multiple={false}
            />
          </FieldsContainer>
          <br />
          {formValues[form.intervention.name] == "oropharyngeal" && (
            <>
              <FieldsContainer sx={{ alignItems: "flex-start" }}>
                <RadioGroupInput
                  name={form.nasopharyngealSize.name}
                  label={form.nasopharyngealSize.label}
                  options={[
                    { value: "5", label: "5" },
                    { value: "6", label: "6" },
                    { value: "7", label: "7" },
                  ]}
                />
                <RadioGroupInput
                  name={form.oropharyngealSize.name}
                  label={form.oropharyngealSize.label + " (MM)"}
                  options={[
                    { value: "80", label: "80" },
                    { value: "90", label: "90" },
                    { value: "100", label: "100" },
                    { value: "110", label: "110" },
                    { value: "120", label: "120" },
                  ]}
                />
              </FieldsContainer>
            </>
          )}
        </>
      )}
    </FormikInit>
  );
};
