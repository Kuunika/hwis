"use client";
import { NO, YES, concepts, encounters } from "@/constants";
import {
  flattenImagesObs,
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
} from "@/components";
import * as Yup from "yup";
import {
  LowerLimbFemaleAnteriorImage,
  LowerLimbFemalePosteriorImage,
  LowerLimbMaleAnteriorImage,
  LowerLimbMalePosteriorImage,
} from "@/components/svgImages";
import { getActivePatientDetails, useSubmitEncounter } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";

import { UpperLimbFemaleAnteriorImage } from "@/components/svgImages/upperLimbFemaleAnterior";
import { UpperLimbFemalePosteriorImage } from "@/components/svgImages/upperLimbFemalePosterior";
import { UpperLimbMaleAnteriorImage } from "@/components/svgImages/upperLimbMaleAnterior";
import { UpperLimbMalePosteriorImage } from "@/components/svgImages/upperLimbMalePosterior";
import { CheckBoxNext } from "@/components/form/checkBoxNext";

const form = {
  oedama: {
    name: concepts.OEDEMA,
    label: "Oedema",
    coded: true,
  },
  oedamaDetails: {
    name: concepts.OEDEMA_DETAILS,
    label: "Oedema Details",
    coded: true,
  },
  coldClammy: {
    name: concepts.COLD_CLAMMY,
    label: "Cold Clammy",
    coded: true,
  },
  abnormalitiesUpperLimb: {
    name: concepts.ABNORMALITIES_UPPER_LIMB,
    label: "Are there other abnormalities  in the upper limbs",
    coded: true,
  },
  abnormalitiesLowerLimb: {
    name: concepts.ABNORMALITIES_LOWER_LIMB,
    label: "Are there other abnormalities  in the lower limbs",
    coded: true,
  },
};

type Prop = {
  onSubmit: () => void;
};

const schema = Yup.object().shape({
  [form.oedama.name]: Yup.string().required().label(form.oedama.label),
  [form.oedamaDetails.name]: Yup.string().label(form.oedamaDetails.label),
  [form.coldClammy.name]: Yup.string().required().label(form.coldClammy.label),
  [form.abnormalitiesUpperLimb.name]: Yup.string()
    .required()
    .label(form.abnormalitiesUpperLimb.label),
  [form.abnormalitiesLowerLimb.name]: Yup.string()
    .required()
    .label(form.abnormalitiesLowerLimb.label),
});

const oedamaOptions = [
  { id: concepts.FEET_ONLY, label: "Feet Only" },
  { id: concepts.UP_TO_KNEE, label: "Up To knee" },
  { id: concepts.UP_TO_THIGH, label: "Up to Thighs" },
  // { id: concepts.WHOLE_BODY, label: "Whole Body" },
];

const initialsValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

export const ExtremitiesForm = ({ onSubmit }: Prop) => {
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState<any>({});

  const [lowerLimbAnterior, setLowerLimbAnterior] = useState<Array<any>>([]);
  const [lowerLimbPosterior, setLowerLimbPosterior] = useState<Array<any>>([]);
  const [upperLimbAnterior, setUpperLimbAnterior] = useState<Array<any>>([]);
  const [upperLimbPosterior, setUpperLimbPosterior] = useState<Array<any>>([]);

  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.EXTREMITIES_ASSESSMENT,
    onSubmit
  );

  const { gender } = getActivePatientDetails();

  const handleSubmitForm = async (values: any) => {
    const formValues = { ...values };
    const obsDatetime = getDateTime();
    const obs = [
      {
        concept: concepts.IMAGE_PART_NAME,
        value: "lower limb anterior",
        obsDatetime,
        groupMembers: flattenImagesObs(lowerLimbAnterior),
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        value: "lower limb posterior",
        obsDatetime,
        groupMembers: flattenImagesObs(lowerLimbPosterior),
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        value: "upper limb posterior",
        obsDatetime,
        groupMembers: flattenImagesObs(upperLimbPosterior),
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        value: "upper limb anterior",
        obsDatetime,
        groupMembers: flattenImagesObs(upperLimbAnterior),
      },
    ];
    // delete formValues[form.abnormalitiesLowerLimb.name];
    await handleSubmit([
      ...mapSubmissionToCodedArray(form, formValues, obsDatetime),
      ...obs,
    ]);
  };

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      <CheckBoxNext
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        onNext={(obs: any) => handleSubmit(obs)}
        title="Tick if circulation is normal and there are no abnormalities"
      />
      {!isChecked && (
        <FormikInit
          validationSchema={schema}
          initialValues={initialsValues}
          onSubmit={handleSubmitForm}
        >
          <FormValuesListener getValues={setFormValues} />
          <FormFieldContainerLayout title="">
            <FieldsContainer mr="2px">
              <RadioGroupInput
                row
                options={radioOptions}
                name={form.oedama.name}
                label={form.oedama.label}
              />
              <RadioGroupInput
                row
                options={radioOptions}
                name={form.coldClammy.name}
                label={form.coldClammy.label}
              />
            </FieldsContainer>
            {formValues[form.oedama.name] == YES && (
              <SearchComboBox
                sx={{ width: "100%" }}
                multiple={false}
                name={form.oedamaDetails.name}
                options={oedamaOptions}
                label={form.oedamaDetails.label}
              />
            )}
            <RadioGroupInput
              row
              options={radioOptions}
              name={form.abnormalitiesUpperLimb.name}
              label={form.abnormalitiesUpperLimb.label}
            />
            {formValues[form.abnormalitiesUpperLimb.name] == YES && (
              <>
                {gender == "Female" && (
                  <>
                    <UpperLimbFemaleAnteriorImage
                      onValueChange={setUpperLimbAnterior}
                      form="extremities"
                    />
                    <UpperLimbFemalePosteriorImage
                      onValueChange={setUpperLimbPosterior}
                    />
                  </>
                )}
                {gender == "Male" && (
                  <>
                    <UpperLimbMaleAnteriorImage
                      onValueChange={setUpperLimbAnterior}
                      form="extremities"
                    />
                    <UpperLimbMalePosteriorImage
                      onValueChange={setUpperLimbPosterior}
                    />
                  </>
                )}
              </>
            )}
            <RadioGroupInput
              row
              options={radioOptions}
              name={form.abnormalitiesLowerLimb.name}
              label={form.abnormalitiesLowerLimb.label}
            />
            {formValues[form.abnormalitiesLowerLimb.name] == YES && (
              <>
                {gender == "Female" && (
                  <>
                    <LowerLimbFemaleAnteriorImage
                      onValueChange={setLowerLimbAnterior}
                      imageEncounter={encounters.EXTREMITIES_ASSESSMENT}
                      imageSection={form.abnormalitiesLowerLimb.name}
                      form="extremities"
                    />

                    <LowerLimbFemalePosteriorImage
                      onValueChange={setLowerLimbPosterior}
                      imageEncounter={encounters.EXTREMITIES_ASSESSMENT}
                      imageSection={form.abnormalitiesLowerLimb.name}
                    />
                  </>
                )}
                {gender == "Male" && (
                  <>
                    <LowerLimbMaleAnteriorImage
                      onValueChange={setLowerLimbAnterior}
                      imageEncounter={encounters.EXTREMITIES_ASSESSMENT}
                      imageSection={form.abnormalitiesLowerLimb.name}
                      form="extremities"
                    />

                    <LowerLimbMalePosteriorImage
                      onValueChange={setLowerLimbPosterior}
                      imageEncounter={encounters.EXTREMITIES_ASSESSMENT}
                      imageSection={form.abnormalitiesLowerLimb.name}
                    />
                  </>
                )}
              </>
            )}
          </FormFieldContainerLayout>
        </FormikInit>
      )}
    </ContainerLoaderOverlay>
  );
};
