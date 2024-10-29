import { GenericDialog, NotificationContainer } from "@/components";
import { NO, YES, concepts, encounters } from "@/constants";
import { getInitialValues, getObservations } from "@/helpers";
import { useEffect, useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import * as Yup from "yup";
import { addEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { useSubmitEncounter } from "@/hooks/useSubmitEncounter";

const form = {
  isAirwayPatent: {
    name: concepts.AIRWAY_PATENT,
    label: "Is Airway Patent",
  },
  isPatientInjured: {
    name: concepts.PATIENT_INJURED,
    label: "Is Patient Injured",
  },
  neckCollar: {
    name: concepts.NECK_COLLAR_APPLIED,
    label: "Neck Collar Applied",
  },
  weakness: {
    name: concepts.WEAKNESS,
    label: "Weakness",
  },
  headBlocks: {
    name: concepts.HEAD_BLOCKS_APPLIED,
    label: "Head Blocks Applied",
  },
  airWayThreatenedReason: {
    name: concepts.AIRWAY_REASON,
    label: "Reason",
  },
  otherReason: {
    name: concepts.OTHER,
    label: "Specify",
  },
  intervention: {
    name: concepts.AIRWAY_OPENING_INTERVENTION,
    label: "Airway Opening Intervention",
  },
  nasopharyngealSize: {
    name: concepts.NASOPHARYNGEAL_AIRWAY,
    label: "Nasopharyngeal Airway Size",
  },
  oropharyngealSize: {
    name: concepts.OROPHARYNGEAL_AIRWAY,
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
  [form.weakness.name]: Yup.string().label(form.weakness.label),
  [form.nasopharyngealSize.name]: Yup.string().label(
    form.nasopharyngealSize.label
  ),
  [form.oropharyngealSize.name]: Yup.string().label(
    form.oropharyngealSize.label
  ),
});

const airwayThreatenedReasons = [
  { id: concepts.SECRETION, label: "Secretions - blood, vomit, other" },
  { id: concepts.TONGUE_SWELLING, label: "Tongue swelling" },
  { id: concepts.NECK_SWELLING, label: "Neck swelling" },
  { id: concepts.NECK_HAEMATOMA, label: "Neck haematoma" },
  { id: concepts.TONGUE_FALLING_BACK, label: "Tongue falling back" },
  { id: concepts.OTHER, label: "Other" },
];

const airwayInterventionsList = [
  { id: concepts.SUCTIONING_AIRWAY, label: "Suctioning Airway" },
  { id: concepts.JAW_THRUST_MANOEUVER, label: "Jaw thrust manoeuver" },
  { id: concepts.HEAD_TILT_CHIN_LIFT, label: "Head tilt/chin lift" },
  {
    id: concepts.OROPHARYNGEAL,
    label:
      "Airway adjunct (Oropharyngeal airway and size / nasopharyngeal airway)",
  },
];

const initialsValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

export const AirwayForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const { handleSubmit, isLoading, isSuccess } = useSubmitEncounter(
    encounters.AIRWAY_ASSESSMENT,
    onSubmit
  );

  const handleSubmitForm = async (values: any) => {
    await handleSubmit(getObservations(values, getDateTime()));
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={handleSubmitForm}
    >
      <FormValuesListener getValues={setFormValues} />

      <FormFieldContainerLayout title="Airway Patent">
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.isAirwayPatent.name}
            label={form.isAirwayPatent.label}
            options={[
              ...radioOptions,
              { label: "Threatened", value: concepts.THREATENED },
            ]}
          />
          {formValues[form.isAirwayPatent.name] == YES && (
            <RadioGroupInput
              name={form.isPatientInjured.name}
              label={form.isPatientInjured.label}
              options={radioOptions}
            />
          )}
        </FieldsContainer>
        {formValues[form.isAirwayPatent.name] === concepts.THREATENED && (
          <FieldsContainer sx={{ my: "1ch" }}>
            <SearchComboBox
              name={form.airWayThreatenedReason.name}
              label={form.airWayThreatenedReason.label}
              options={airwayThreatenedReasons}
              multiple={false}
            />
          </FieldsContainer>
        )}

        {formValues[form.airWayThreatenedReason.name] == concepts.OTHER && (
          <>
            <br />
            <FieldsContainer>
              <TextInputField
                sx={{ m: 0, width: "100%" }}
                name={form.otherReason.name}
                label={form.otherReason.label}
                id={form.otherReason.name}
              />
            </FieldsContainer>
          </>
        )}
      </FormFieldContainerLayout>

      <br />
      {formValues[form.isPatientInjured.name] == YES &&
        formValues[form.isAirwayPatent.name] == YES && (
          <>
            <NotificationContainer message="Please stabilize the C-Spine" />
            <br />

            <FormFieldContainerLayout
              last={true}
              title="Neck Collar and Head Blocks"
            >
              <FieldsContainer sx={{ alignItems: "flex-start" }}>
                <RadioGroupInput
                  name={form.neckCollar.name}
                  label={form.neckCollar.label}
                  options={[
                    ...radioOptions,
                    { label: "No Indicated", value: "notIndicated" },
                  ]}
                />
                <RadioGroupInput
                  name={form.headBlocks.name}
                  label={form.headBlocks.label}
                  options={radioOptions}
                />
              </FieldsContainer>
            </FormFieldContainerLayout>
            <br />
          </>
        )}

      {formValues[form.isAirwayPatent.name] === NO && (
        <>
          <FormFieldContainerLayout last={true} title="Interventions">
            <FieldsContainer>
              <SearchComboBox
                name={form.intervention.name}
                label={form.intervention.label}
                options={airwayInterventionsList}
                multiple={false}
              />
            </FieldsContainer>
            <br />
            {formValues[form.intervention.name] == concepts.OROPHARYNGEAL && (
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
          </FormFieldContainerLayout>
        </>
      )}
    </FormikInit>
  );
};
