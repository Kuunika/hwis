import { GenericDialog, NotificationContainer } from "@/components";
import { NO, YES, concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import { useState } from "react";
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
import { CanvasImage } from "@/components/canvasImage/canvasImage";
import { Button } from "@mui/material";
import { FullBodyImage } from "@/components/svgImages/fullBody";

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
    name: "otherReason",
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
  onSubmit: (values: any) => void;
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

const initialsValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

export const AirwayForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [anatomyOpen, setAnatomyOpen] = useState(false);

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={onSubmit}
    >
      <FormValuesListener getValues={setFormValues} />
   
      <Button onClick={() => setAnatomyOpen(true)}>Image</Button>
      <GenericDialog
        maxWidth="lg"
        open={anatomyOpen}
        onClose={() => setAnatomyOpen(false)}
        title=""
      >
           <FullBodyImage />
        {/* <CanvasImage imageUrl="/anatomy.webp" /> */}
      </GenericDialog>

      <FormFieldContainerLayout title="Airway Patent">
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.isAirwayPatent.name}
            label={form.isAirwayPatent.label}
            options={[
              ...radioOptions,
              { label: "Threatened", value: "threatened" },
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
        {formValues[form.isAirwayPatent.name] === "threatened" && (
          <FieldsContainer sx={{ my: "1ch" }}>
            <SearchComboBox
              name={form.airWayThreatenedReason.name}
              label={form.airWayThreatenedReason.label}
              options={airwayThreatenedReasons}
              multiple={false}
            />
          </FieldsContainer>
        )}

        {formValues[form.airWayThreatenedReason.name] == "other" && (
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
          </FormFieldContainerLayout>
        </>
      )}
    </FormikInit>
  );
};
