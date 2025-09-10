import { GenericDialog, NotificationContainer } from "@/components";
import { NO, YES, concepts, encounters } from "@/constants";
import {
  getInitialValues,
  getObservations,
  mapSubmissionToCodedArray,
} from "@/helpers";
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
import { useSubmitEncounter } from "@/hooks/useSubmitEncounter";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { useServerTime } from "@/contexts/serverTimeContext";

const form = {
  isAirwayPatent: {
    name: concepts.AIRWAY_PATENT,
    label: "Is Airway Patent",
    type: "string",
    options: {
      [YES]: "Patent",
      [NO]: "Not Patent",
      [concepts.THREATENED]: "Threatened",
    },
    children: [
      {
        multiple: true,
        concept: concepts.AIRWAY_REASON,
        label: "Reason",
        type: "string",
      },
      {
        multiple: true,
        concept: concepts.AIRWAY_OPENING_INTERVENTION,
        label: "Airway Opening Intervention",
        type: "string",
      },
    ],
  },
  isPatientInjured: {
    name: concepts.PATIENT_INJURED,
    label: "Is Patient Injured",
    type: "string",
    options: {
      [YES]: "Injured",
      [NO]: "Not Injured",
    },
    children: [
      {
        type: "string",
        concept: concepts.NECK_COLLAR_APPLIED,
        label: "Neck Collar Applied",
        options: {
          [YES]: "Neck collar applied",
          [NO]: "Neck collar not applied",
          [concepts.NOT_INDICATED]: "No indication of neck collar",
        },
      },
      { type:"string",concept: concepts.HEAD_BLOCKS_APPLIED, label: "Head Blocks Applied" },
    ],
  },
  neckCollar: {
    name: concepts.NECK_COLLAR_APPLIED,
    label: "Neck Collar Applied",
    child: true,
  },
  weakness: {
    name: concepts.WEAKNESS,
    label: "Weakness",
  },
  headBlocks: {
    name: concepts.HEAD_BLOCKS_APPLIED,
    label: "Head Blocks Applied",
    child: true,
  },
  airWayThreatenedReason: {
    name: concepts.AIRWAY_REASON,
    label: "Reason",
    child: true,
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
    label: "Oropharyngeal Airway Size",
  },
};

export const airwayFormConfig: any = form;

type Prop = {
  onSubmit: () => void;
};

const schema = Yup.object().shape({
  [form.isAirwayPatent.name]: Yup.string()
    .required()
    .label(form.isAirwayPatent.label),
  [form.headBlocks.name]: Yup.string().label(form.headBlocks.label),
  [form.neckCollar.name]: Yup.string().label(form.neckCollar.label),
  [form.airWayThreatenedReason.name]: Yup.array().label(
    form.airWayThreatenedReason.label
  ),
  [form.intervention.name]: Yup.array().label(form.intervention.label),
  [form.weakness.name]: Yup.string().label(form.weakness.label),
  [form.nasopharyngealSize.name]: Yup.string().label(
    form.nasopharyngealSize.label
  ),
  [form.oropharyngealSize.name]: Yup.string().label(
    form.oropharyngealSize.label
  ),
  [form.otherReason.name]: Yup.string()
    .when(form.airWayThreatenedReason.name, (values: any, schema: any) => {
      if (values[0] == concepts.OTHER) {
        return schema.required();
      }
      return schema;
    })
    .label(form.otherReason.label),
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
  { id: concepts.SUCTIONING_DONE, label: "Suctioning Done" },
  { id: concepts.JAW_THRUST_MANOEUVER, label: "Jaw thrust manoeuver" },
  { id: concepts.HEAD_TILT_CHIN_LIFT, label: "Head tilt/chin lift" },
  {
    id: concepts.OROPHARYNGEAL,
    label:
      "Airway adjunct (Oropharyngeal airway and size / nasopharyngeal airway)",
  },
  {
    id: "Laryngeal mask airway (LMA) insertion",
    label: "Laryngeal mask airway (LMA) insertion",
  },
  {
    id: "Endotracheal intubation",
    label: "Endotracheal intubation",
  },
  {
    id: "Performed Cricothyroidotomy(Surgical Airway)",
    label: "Performed Cricothyroidotomy(Surgical Airway)",
  },
  {
    id: "Performed tracheostomy",
    label: "Performed tracheostomy",
  },
];

const initialsValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

export const AirwayForm = ({ onSubmit }: Prop) => {
  const { ServerTime } = useServerTime();
  const [formValues, setFormValues] = useState<any>({});
  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.AIRWAY_ASSESSMENT,
    onSubmit
  );
  const [isChecked, setIsChecked] = useState(false);

  const [specify, setSpecify] = useState(false);
  const [showNasopharyngealSize, setShowNasopharyngealSize] = useState(false);

  const handleSubmitForm = async (values: any) => {
    const formValues = { ...values };
    const interventions = formValues[form.intervention.name];
    let interventionsObs: any = [];

    const obsDatetime = ServerTime.getServerTimeString();

    if (Array.isArray(interventions)) {
      interventionsObs = interventions.map((intervention) => {
        return {
          concept: form.intervention.name,
          value: intervention.id,
          obsDatetime,
        };
      });
    }

    const reasons = formValues[form.airWayThreatenedReason.name];
    let reasonsObs: any = [];
    if (Array.isArray(reasons)) {
      reasonsObs = reasons.map((reasons) => {
        return {
          concept: form.airWayThreatenedReason.name,
          value: reasons.id,
          obsDatetime,
        };
      });
    }

    delete formValues[form.airWayThreatenedReason.name];
    delete formValues[form.intervention.name];

    await handleSubmit([
      ...mapSubmissionToCodedArray(form, formValues, obsDatetime),
      ...interventionsObs,
      ...reasonsObs,
    ]);
  };

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      {/* <CheckBoxNext
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        onNext={(obs: any) => handleSubmit(obs)}
        title="Tick if airway is normal and there are no abnormalities"
      /> */}
      {!isChecked && (
        <FormikInit
          validationSchema={schema}
          initialValues={initialsValues}
          onSubmit={handleSubmitForm}
          submitButtonText="Next"
        >
          <br />

          <>
            <br />
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
                {/* {formValues[form.isAirwayPatent.name] == YES && ( */}
                <RadioGroupInput
                  name={form.isPatientInjured.name}
                  label={form.isPatientInjured.label}
                  options={radioOptions}
                />
                {/* )} */}
              </FieldsContainer>
              {(formValues[form.isAirwayPatent.name] === concepts.THREATENED ||
                formValues[form.isAirwayPatent.name] === concepts.NO) && (
                <>
                  <FieldsContainer sx={{ my: "1ch" }}>
                    <SearchComboBox
                      name={form.airWayThreatenedReason.name}
                      label={form.airWayThreatenedReason.label}
                      options={airwayThreatenedReasons}
                      getValue={(values: Array<any>) => {
                        setSpecify(
                          Boolean(values.find((v) => v.id == concepts.OTHER))
                        );
                      }}
                      multiple={true}
                    />
                  </FieldsContainer>
                  {specify && (
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
                </>
              )}
            </FormFieldContainerLayout>

            <br />
            {formValues[form.isPatientInjured.name] == YES && (
              // formValues[form.isAirwayPatent.name] == YES &&
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
                        {
                          label: "Not Indicated",
                          value: concepts.NOT_INDICATED,
                        },
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

            {(formValues[form.isAirwayPatent.name] === NO ||
              formValues[form.isAirwayPatent.name] === concepts.THREATENED) && (
              <>
                <FormFieldContainerLayout last={true} title="Interventions">
                  <FieldsContainer>
                    <SearchComboBox
                      name={form.intervention.name}
                      label={form.intervention.label}
                      options={airwayInterventionsList}
                      multiple={true}
                      getValue={(values: Array<any>) => {
                        setShowNasopharyngealSize(
                          Boolean(
                            values.find((v) => v.id == concepts.OROPHARYNGEAL)
                          )
                        );
                      }}
                    />
                  </FieldsContainer>
                  <br />
                  {showNasopharyngealSize && (
                    <>
                      <FieldsContainer sx={{ alignItems: "flex-start" }}>
                        <RadioGroupInput
                          name={form.nasopharyngealSize.name}
                          label={form.nasopharyngealSize.label + "(CM)"}
                          options={[
                            { value: "5", label: "5" },
                            { value: "6", label: "6" },
                            { value: "7", label: "7" },
                            { value: "8", label: "8" },
                            { value: "9", label: "9" },
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
          </>
        </FormikInit>
      )}
    </ContainerLoaderOverlay>
  );
};
