import { getInitialValues, successDialog } from "@/helpers";
import { useNavigation } from "@/hooks";
import { useEffect, useState } from "react";
import {
  FieldsContainer,
  FormDatePicker,
  FormTimePicker,
  FormValuesListener,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import * as Yup from "yup";
import { addBroughtDead } from "@/hooks/patientReg";
import { OverlayLoader } from "@/components/backdrop";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
//Add:
//Name of Deceased : Firstname , Last Name
// Date of Birth
// Age
//ID if available
//Religion
// Place of Residence
const form = {
  firstName: {
    name: "first_name",
    label: "First name",
  },
  surname: {
    name: "surname",
    label: "Surname",
  },
  dateOfBirth: {
    name: "date_of_birth",
    label: "Date of Birth",
  },
  age: {
    name: "age",
    label: "Age",
  },
  nationalID: {
    name: "national_id",
    label: "National ID",
  },
  religion: {
    name: "religion",
    label: "Religion",
  },
  placeOfResidence: {
    name: "place_of_residence",
    label: "Place of Residence",
  },
  placeOfDeath: {
    name: "place_of_death",
    label: "Place of Death",
  },
  dateOfDeath: {
    name: "date_of_death",
    label: "Date of Death",
  },
  timeOfDeath: {
    name: "time_of_death",
    label: "Time of Death",
  },
  dateOfArrival: {
    name: "date_of_arrival",
    label: "Date of Arrived at AETC",
  },
  timeOfArrival: {
    name: "time_of_arrival",
    label: "Time of Arrived at AETC",
  },
  broughtBy: {
    name: "brought_by",
    label: "Brought By",
  },
  broughtByContact: {
    name: "brought_by_contact",
    label: "Contact",
  },
  genderDeceased: {
    name: "gender_deceased",
    label: "Gender Of Deceased",
  },
  pregnant: {
    name: "pregnant",
    label: "Pregnant at time of death",
  },
  whatHappened: {
    name: "what_happened",
    label: "What Happened",
  },
  patientSeenAtHospital: {
    name: "patient_seen_at_hospital",
    label: "Was the patient seen at this hospital",
  },
  historyOfTravel: {
    name: "history_of_travel",
    label: "History of travel",
  },
  immediate: {
    name: "immediate",
    label: "Immediate",
  },
  underlyingConditions: {
    name: "underlying_conditions",
    label: "Underlying Conditions",
  },
  involvedInAccident: {
    name: "involved_in_accident",
    label: "Was the patient involved in an accident",
  },
  placeOfInjury: {
    name: "place_of_injury",
    label: "Place Of Injury",
  },
  timeOfInjury: {
    name: "time_of_injury",
    label: "Time Of Injury",
  },
  dateOfInjury: {
    name: "date_of_injury",
    label: "Date Of Injury",
  },
  howTheInjuryOccurred: {
    name: "how_the_injury_occurred",
    label: "How did the Injury occur",
  },
  policeInformed: {
    name: "police_informed",
    label: "Have the police been informed",
  },
  policeStationInformed: {
    name: "police_station_informed",
    label: "Police Station Informed",
  },
  isDeathNatural: {
    name: "is_death_natural",
    label: "Is the death natural",
  },
  autopsyIsDiscussed: {
    name: "autopsy_is_discussed",
    label: "Autopsy Discussed With Escort",
  },
  mortuaryInformed: {
    name: "mortuary_informed",
    label: "Has the Mortuary been Informed on need of autopsy",
  },
  nameOfConfirmingDeath: {
    name: "name_of_confirming_death",
    label: "Name of person confirming death",
  },
  dateConfirmingDeath: {
    name: "date_confirming_death",
    label: "Date Confirming Death",
  },
  timeConfirmingDeath: {
    name: "time_confirming_death",
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

const initialValues = getInitialValues(form);
// const { navigateBack } = useNavigation();
export const BroughtDeadForm = () => {
  const [formValues, setFormValues] = useState<any>({});

  const { mutate, isSuccess, isPending } = addBroughtDead();
  const { navigateTo } = useNavigation(); // Initialize navigation

  useEffect(() => {
    // if (isSuccess) navigateBack();
  }, [isSuccess]);

  const onSubmit = (values: any) => {
    mutate(values);
    navigateTo("/registration/death/list");
  };

  return (
    <ContainerLoaderOverlay loading={isPending}>
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitButtonText="Submit"
      >
        <FormValuesListener getValues={setFormValues} />
        <FieldsContainer>
          <TextInputField
            name={form.firstName.name}
            id={form.firstName.name}
            label={form.firstName.label}
            sx={{ width: "100%" }}
          />
          <TextInputField
            name={form.surname.name}
            id={form.surname.name}
            label={form.surname.label}
            sx={{ width: "100%" }}
          />
        </FieldsContainer>
        <FormDatePicker
          name={form.dateOfBirth.name}
          label={form.dateOfBirth.label}
          width="100%"
          sx={{ mb: 2 }}
        />
        <FieldsContainer>
          <TextInputField
            name={form.age.name}
            id={form.age.name}
            label={form.age.label}
            sx={{ width: "100%" }}
          />
          <TextInputField
            name={form.nationalID.name}
            id={form.nationalID.name}
            label={form.nationalID.label}
            sx={{ width: "100%" }}
          />
          <TextInputField
            name={form.religion.name}
            id={form.religion.name}
            label={form.religion.label}
            sx={{ width: "100%" }}
          />
        </FieldsContainer>
        <TextInputField
          name={form.placeOfResidence.name}
          id={form.placeOfResidence.name}
          label={form.placeOfResidence.label}
          sx={{ width: "100%" }}
        />

        <TextInputField
          name={form.placeOfDeath.name}
          id={form.placeOfDeath.name}
          label={form.placeOfDeath.label}
          sx={{ width: "100%" }}
        />

        <FormDatePicker
          name={form.dateOfDeath.name}
          label={form.dateOfDeath.label}
          width="100%"
          sx={{ mb: 2 }}
        />

        <FieldsContainer sx={{ mb: 2 }}>
          <FormTimePicker
            name={form.timeOfDeath.name}
            label={form.timeOfDeath.label}
          />

          <FormTimePicker
            name={form.timeOfArrival.name}
            label={form.timeOfArrival.label}
          />
        </FieldsContainer>

        <FormDatePicker
          name={form.dateOfArrival.name}
          label={form.dateOfArrival.label}
          width="100%"
          sx={{ mb: 2 }}
        />

        <FieldsContainer>
          <TextInputField
            name={form.broughtBy.name}
            id={form.broughtBy.name}
            label={form.broughtBy.label}
            sx={{ width: "100%" }}
          />
          <TextInputField
            name={form.broughtByContact.name}
            id={form.broughtByContact.name}
            label={form.broughtByContact.label}
            sx={{ width: "100%" }}
          />
        </FieldsContainer>
        <FieldsContainer>
          <RadioGroupInput
            name={form.genderDeceased.name}
            label={form.genderDeceased.label}
            row
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
          />
          {formValues[form.genderDeceased.name] == "female" && (
            <RadioGroupInput
              name={form.pregnant.name}
              label={form.pregnant.label}
              row
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
            />
          )}
        </FieldsContainer>

        <TextInputField
          name={form.whatHappened.name}
          id={form.whatHappened.name}
          label={form.whatHappened.label}
          rows={4}
          sx={{ width: "100%" }}
          multiline={true}
        />
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.patientSeenAtHospital.name}
            label={form.patientSeenAtHospital.label}
            row
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
              rows={4}
              sx={{ width: "100%" }}
            />

            <TextInputField
              name={form.underlyingConditions.name}
              id={form.underlyingConditions.name}
              label={form.underlyingConditions.label}
              multiline={true}
              rows={4}
              sx={{ width: "100%" }}
            />
          </FieldsContainer>

          <RadioGroupInput
            name={form.involvedInAccident.name}
            label={form.involvedInAccident.label}
            row
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
              sx={{ width: "100%" }}
            />
          )}

          {formValues[form.involvedInAccident.name] == "yes" && (
            <>
              <FormDatePicker
                name={form.dateOfInjury.name}
                label={form.dateOfInjury.label}
                width={"100%"}
                sx={{ mb: 2 }}
              />
              <FormTimePicker
                name={form.timeOfInjury.name}
                label={form.timeOfInjury.label}
              />

              <TextInputField
                name={form.howTheInjuryOccurred.name}
                id={form.howTheInjuryOccurred.name}
                label={form.howTheInjuryOccurred.label}
                multiline={true}
                rows={5}
                sx={{ width: "100%", mt: 2 }}
              />

              <RadioGroupInput
                name={form.policeInformed.name}
                label={form.policeInformed.label}
                row
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
                  sx={{ width: "100%" }}
                />
              )}

              <RadioGroupInput
                name={form.isDeathNatural.name}
                label={form.isDeathNatural.label}
                row
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />
              <FieldsContainer>
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
            </>
          )}

          <TextInputField
            name={form.nameOfConfirmingDeath.name}
            id={form.nameOfConfirmingDeath.name}
            label={form.nameOfConfirmingDeath.label}
            sx={{ width: "100%" }}
          />

          <FormDatePicker
            name={form.dateConfirmingDeath.name}
            label={form.dateConfirmingDeath.label}
            width={"100%"}
            sx={{ mb: 2 }}
          />
          <FormTimePicker
            name={form.timeConfirmingDeath.name}
            label={form.timeConfirmingDeath.label}
          />
        </>
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
