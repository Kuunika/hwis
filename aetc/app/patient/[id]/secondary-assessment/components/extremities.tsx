"use client";
import { NO, YES, concepts, encounters } from "@/constants";
import { flattenImagesObs, getInitialValues, getObservations } from "@/helpers";
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
import { LowerLimbPosterior } from "@/components/svgImages";
import { useSubmitEncounter } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";

const form = {
  oedama: {
    name: concepts.OEDEMA,
    label: "Oedema",
  },
  oedamaDetails: {
    name: concepts.OEDEMA_DETAILS,
    label: "Oedema Details",
  },
  coldClammy: {
    name: concepts.COLD_CLAMMY,
    label: "Cold Clammy",
  },
  abnormalitiesUpperLimb: {
    name: concepts.ABNORMALITIES_UPPER_LIMB,
    label: "Are there other abnormalities  in the upper limbs",
  },
  abnormalitiesLowerLimb: {
    name: concepts.ABNORMALITIES_LOWER_LIMB,
    label: "Are there other abnormalities  in the lower limbs",
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
  { id: concepts.WHOLE_BODY, label: "Whole Body" },
];

const initialsValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

export const ExtremitiesForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});

  const [abnormalitiesUpperLimbImageEnc, setAbnormalitiesUpperLimbImageEnc] =
    useState<Array<any>>([]);

  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.EXTREMITIES_ASSESSMENT,
    onSubmit
  );

  const handleSubmitForm = async (values: any) => {
    const formValues = { ...values };
    const obs = [
      {
        concept: form.abnormalitiesUpperLimb.name,
        value: formValues[form.abnormalitiesUpperLimb.name],
        obsDatetime: getDateTime(),
        group_members: flattenImagesObs(abnormalitiesUpperLimbImageEnc),
      },
    ];
    delete formValues[form.abnormalitiesLowerLimb.name];
    await handleSubmit([...getObservations(formValues, getDateTime()), ...obs]);
  };

  return (
    <ContainerLoaderOverlay loading={isLoading}>
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
            <LowerLimbPosterior
              onValueChange={setAbnormalitiesUpperLimbImageEnc}
              imageEncounter={encounters.EXTREMITIES_ASSESSMENT}
              imageSection={form.abnormalitiesUpperLimb.name}
            />
          )}
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.abnormalitiesLowerLimb.name}
            label={form.abnormalitiesLowerLimb.label}
          />
          {formValues[form.abnormalitiesLowerLimb.name] == YES && (
            <LowerLimbPosterior
              onValueChange={setAbnormalitiesUpperLimbImageEnc}
              imageEncounter={encounters.EXTREMITIES_ASSESSMENT}
              imageSection={form.abnormalitiesLowerLimb.name}
            />
          )}
        </FormFieldContainerLayout>
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
