import { useState } from "react";
import {
  FieldsContainer,
  FormDatePicker,
  FormTimePicker,
  FormValuesListener,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
} from "shared-ui/src";
import * as Yup from "yup";

const form = {
  placeOfDeath: {
    name: "placeOfDeath",
    label: "Place of Death",
  },
  dateOfDeath: {
    name: "dateOfDeath",
    label: "Date of Death",
  },
  timeOfDeath: {
    name: "timeOfDeath",
    label: "Time of Death",
  },
  dateOfArrival: {
    name: "dateOfArrival",
    label: "Date of Arrived at AETC",
  },
  timeOfArrival: {
    name: "timeOfArrival",
    label: "Time of Arrived at AETC",
  },
  broughtBy: {
    name: "broughtBy",
    label: "Brought By",
  },
  broughtByContact: {
    name: "broughtByContact",
    label: "Contact",
  },
  genderDeceased: {
    name: "genderDeceased",
    label: "Gender Of Deceased",
  },
  pregnant: {
    name: "pregnant",
    label: "Pregnant at time of death",
  },
  whatHappened: {
    name: "whatHappened",
    label: "What Happened",
  },
  patientSeenAtHospital: {
    name: "patientSeenAtHospital",
    label: "Was the patient seen at this hospital",
  },
  historyOfTravel: {
    name: "historyOfTravel",
    label: "History of travel",
  },
  immediate: {
    name: "immediate",
    label: "Immediate",
  },
  underlyingConditions: {
    name: "underlyingConditions",
    label: "Underlying Conditions",
  },
  involvedInAccident: {
    name: "involvedInAccident",
    label: "Was the patient involved in an accident",
  },
  placeOfInjury: {
    name: "placeOfInjury",
    label: "Place Of Injury",
  },
  timeOfInjury: {
    name: "timeOfInjury",
    label: "Time Of Injury",
  },
  dateOfInjury: {
    name: "dateOfInjury",
    label: "Date Of Injury",
  },
  howTheInjuryOccurred: {
    name: "howTheInjuryOccurred",
    label: "How did the Injury occur",
  },
  policeInformed: {
    name: "policeInformed",
    label: "Have the police been informed",
  },
  policeStationInformed: {
    name: "policeStationInformed",
    label: "Police Station Informed",
  },
  isDeathNatural: {
    name: "isDeathNatural",
    label: "Is the death natural",
  },
  autopsyIsDiscussed: {
    name: "autopsyIsDiscussed",
    label: "Autopsy Discussed With Escort",
  },
  mortuaryInformed: {
    name: "mortuaryInformed",
    label: "Has the Mortuary been Informed on need of autopsy",
  },
  nameOfConfirmingDeath: {
    name: "nameOfConfirmingDeath",
    label: "Name of person confirming death",
  },
  dateConfirmingDeath: {
    name: "dateConfirmingDeath",
    label: "Date Confirming Death",
  },
  timeConfirmingDeath: {
    name: "timeConfirmingDeath",
    label: "Time Confirming Death",
  },
};

const schema = Yup.object().shape({
  [form.placeOfDeath.name]: Yup.string().label(form.placeOfDeath.label),
  [form.dateOfDeath.name]: Yup.string().label(form.dateOfDeath.label),
  [form.timeOfDeath.name]: Yup.string().label(form.timeOfDeath.label),
  [form.dateOfArrival.name]: Yup.string()
    .required()
    .label(form.dateOfArrival.label),
  [form.timeOfArrival.name]: Yup.string()
    .required()
    .label(form.timeOfArrival.label),
  [form.broughtBy.name]: Yup.string().required().label(form.broughtBy.label),
  [form.broughtByContact.name]: Yup.string()
    .required()
    .label(form.broughtByContact.label),
  [form.genderDeceased.name]: Yup.string()
    .required()
    .label(form.genderDeceased.label),
  [form.pregnant.name]: Yup.string().label(form.pregnant.label),
  [form.historyOfTravel.name]: Yup.string().label(form.historyOfTravel.label),
  [form.whatHappened.name]: Yup.string()
    .required()
    .label(form.whatHappened.label),
  [form.patientSeenAtHospital.name]: Yup.string()
    .required()
    .label(form.patientSeenAtHospital.label),
  [form.immediate.name]: Yup.string().label(form.immediate.label),
  [form.underlyingConditions.name]: Yup.string().label(
    form.underlyingConditions.label
  ),
  [form.involvedInAccident.name]: Yup.string()
    .required()
    .label(form.involvedInAccident.label),
  [form.placeOfInjury.name]: Yup.string().label(form.placeOfInjury.label),
  [form.dateOfInjury.name]: Yup.string().label(form.dateOfInjury.label),
  [form.timeOfInjury.name]: Yup.string().label(form.timeOfInjury.label),
  [form.howTheInjuryOccurred.name]: Yup.string().label(
    form.howTheInjuryOccurred.label
  ),
  [form.policeInformed.name]: Yup.string().label(form.policeInformed.label),
  [form.policeStationInformed.name]: Yup.string().label(
    form.policeStationInformed.label
  ),
  [form.isDeathNatural.name]: Yup.string().label(form.isDeathNatural.label),
  [form.autopsyIsDiscussed.name]: Yup.string().label(
    form.autopsyIsDiscussed.label
  ),
  [form.mortuaryInformed.name]: Yup.string().label(form.mortuaryInformed.label),
  [form.nameOfConfirmingDeath.name]: Yup.string().label(
    form.nameOfConfirmingDeath.label
  ),
  [form.dateConfirmingDeath.name]: Yup.string().label(
    form.dateConfirmingDeath.label
  ),
  [form.timeConfirmingDeath.name]: Yup.string().label(
    form.timeConfirmingDeath.label
  ),
});

const initialValues = {};

export const BroughtDeadForm = () => {
  const [formValues, setFormValues] = useState<any>({});
  const onSubmit = () => {};

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="Submit"
    >
      <FormValuesListener getValues={setFormValues} />
      <FieldsContainer>
        <TextInputField
          name={form.placeOfDeath.name}
          id={form.placeOfDeath.name}
          label={form.placeOfDeath.label}
        />
        <FormDatePicker
          name={form.dateOfDeath.name}
          label={form.dateOfDeath.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <FormTimePicker
          name={form.timeOfDeath.name}
          label={form.timeOfDeath.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <FormDatePicker
          name={form.dateOfArrival.name}
          label={form.dateOfArrival.label}
        />
        <FormTimePicker
          name={form.timeOfArrival.name}
          label={form.timeOfArrival.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.broughtBy.name}
          id={form.broughtBy.name}
          label={form.broughtBy.label}
        />
        <TextInputField
          name={form.broughtByContact.name}
          id={form.broughtByContact.name}
          label={form.broughtByContact.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.genderDeceased.name}
          label={form.genderDeceased.label}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />
        {formValues[form.genderDeceased.name] == "female" && (
          <RadioGroupInput
            name={form.pregnant.name}
            label={form.pregnant.label}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        )}
      </FieldsContainer>

      <FieldsContainer sx={{ alignItems: "flex-start" }}>
        <TextInputField
          name={form.whatHappened.name}
          id={form.whatHappened.name}
          label={form.whatHappened.label}
          multiline={true}
        />
        <RadioGroupInput
          name={form.patientSeenAtHospital.name}
          label={form.patientSeenAtHospital.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <>
        <MainTypography>Cause of Death</MainTypography>
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <TextInputField
            name={form.immediate.name}
            id={form.immediate.name}
            label={form.immediate.label}
            multiline={true}
          />

          <TextInputField
            name={form.underlyingConditions.name}
            id={form.underlyingConditions.name}
            label={form.underlyingConditions.label}
            multiline={true}
          />
        </FieldsContainer>
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.involvedInAccident.name}
            label={form.involvedInAccident.label}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
          {formValues[form.involvedInAccident.name] == "yes" && (
            <TextInputField
              name={form.placeOfInjury.name}
              id={form.placeOfInjury.name}
              label={form.placeOfInjury.label}
            />
          )}
        </FieldsContainer>
        {formValues[form.involvedInAccident.name] == "yes" && (
          <>
            <FieldsContainer>
              <FormDatePicker
                name={form.dateOfInjury.name}
                label={form.dateOfInjury.label}
              />
              <FormTimePicker
                name={form.timeOfInjury.name}
                label={form.timeOfInjury.label}
              />
            </FieldsContainer>
            <FieldsContainer>
              <TextInputField
                name={form.howTheInjuryOccurred.name}
                id={form.howTheInjuryOccurred.name}
                label={form.howTheInjuryOccurred.label}
                multiline={true}
              />
            </FieldsContainer>
            <FieldsContainer sx={{ alignItems: "flex-start" }}>
              <RadioGroupInput
                name={form.policeInformed.name}
                label={form.policeInformed.label}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />
              {formValues[form.policeInformed.name] == "yes" && (
                <TextInputField
                  name={form.policeStationInformed.name}
                  id={form.policeStationInformed.name}
                  label={form.policeStationInformed.label}
                />
              )}
            </FieldsContainer>
            <FieldsContainer>
              <RadioGroupInput
                name={form.isDeathNatural.name}
                label={form.isDeathNatural.label}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />
              {formValues[form.isDeathNatural.name] == "no" && (
                <RadioGroupInput
                  name={form.autopsyIsDiscussed.name}
                  label={form.autopsyIsDiscussed.label}
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                />
              )}
            </FieldsContainer>
            {formValues[form.isDeathNatural.name] == "no" && (
              <RadioGroupInput
                name={form.mortuaryInformed.name}
                label={form.mortuaryInformed.label}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />
            )}
          </>
        )}

        <FieldsContainer>
          <TextInputField
            name={form.nameOfConfirmingDeath.name}
            id={form.nameOfConfirmingDeath.name}
            label={form.nameOfConfirmingDeath.label}
          />
        </FieldsContainer>
        <FieldsContainer>
          <FormDatePicker
            name={form.dateConfirmingDeath.name}
            label={form.dateConfirmingDeath.label}
          />
          <FormTimePicker
            name={form.timeConfirmingDeath.name}
            label={form.timeConfirmingDeath.label}
          />
        </FieldsContainer>
      </>
    </FormikInit>
  );
};
