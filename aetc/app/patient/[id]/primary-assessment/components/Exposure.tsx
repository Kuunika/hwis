import React, { useState } from "react";
import { FormValuesListener, FormikInit, TextInputField } from "@/components";
import * as yup from "yup";
import {
  FullBodyBackImage,
  FullBodyFemaleBackImage,
  FullBodyFemaleFrontImage,
  FullBodyImage,
} from "@/components/svgImages";
import { concepts, encounters } from "@/constants";
import { flattenImagesObs, getInitialValues, getObservations } from "@/helpers";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useSubmitEncounter } from "@/hooks/useSubmitEncounter";
import { getDateTime } from "@/helpers/dateTime";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { getOnePatient } from "@/hooks/patientReg";
import { getActivePatientDetails, useParameters } from "@/hooks";
import { CheckBox } from "@mui/icons-material";
import { CheckBoxNext } from "@/components/form/checkBoxNext";

type Props = {
  onSubmit: () => void;
};
const form = {
  temperatureInfo: {
    name: concepts.TEMPERATURE,
    label: "Temperature",
  },
  skinRashInfo: {
    name: concepts.SKIN_RASH,
    label: "Does the patient have a rash?",
  },
  additionalNotes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Other Abnormalities",
  },
  injuries: {
    name: concepts.INJURY,
    label: "Other Injuries",
  },
};

const schema = yup.object({
  [form.temperatureInfo.name]: yup
    .number()
    .required()
    .min(20)
    .max(45)
    .label(form.temperatureInfo.label),
  [form.additionalNotes.name]: yup.string().label(form.additionalNotes.label),
});

const initialValues = getInitialValues(form);

export const Exposure = ({ onSubmit }: Props) => {
  const { params } = useParameters();

  const { data: patient, isLoading: patientLoading } = getOnePatient(
    params?.id as string
  );
  const [formValues, setFormValues] = useState<any>({});
  const [fullImageFront, setFullImageFront] = useState<Array<any>>([]);
  const [fullImageBack, setFullImageBack] = useState<Array<any>>([]);
  const [isChecked, setIsChecked] = useState(false);

  const { handleSubmit, isLoading, isSuccess } = useSubmitEncounter(
    encounters.EXPOSURE_ASSESSMENT,
    onSubmit
  );

  const handleFormSubmit = (values: any) => {
    const formValues = { ...values };

    const obsDatetime = getDateTime();

    const obs = [
      {
        concept: concepts.IMAGE_PART_NAME,
        value: "full body front",
        obsDatetime,
        groupMembers: [...flattenImagesObs(fullImageFront)],
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        value: "full body back",
        obsDatetime,
        groupMembers: [...flattenImagesObs(fullImageBack)],
      },
      {
        concept: concepts.NOTES,
        value: isChecked ? "Normal" : "Abnormalities",
        obsDatetime,
      },
    ];

    handleSubmit([...getObservations(formValues, obsDatetime), ...obs]);
  };

  const gender = patient && patient?.gender;

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      <CheckBoxNext
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        onNext={(obs: any) => handleSubmit(obs)}
        title="Tick if exposure is normal and there are no abnormalities"
      />
      {!isChecked && (
        <FormikInit
          validationSchema={schema}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          submitButtonText="submit"
        >
          <FormValuesListener getValues={setFormValues} />

          <TextInputField
            sx={{ width: "100%" }}
            name={form.temperatureInfo.name}
            label={form.temperatureInfo.label}
            id={form.temperatureInfo.name}
            unitOfMeasure="°C"
          />

          <br />
          {/* <FormControlLabel
            label="Tick if the body is normal and there are no abnormalities"
            control={
              <Checkbox
                checked={isChecked}
                onChange={(event) => {
                  setIsChecked(event.currentTarget.checked);
                }}
              />
            }
          /> */}

          {!isChecked && (
            <>
              <Typography color={"grey"} variant="h5">
                Select areas with rash, injuries and other abnormalities
              </Typography>
              <br />{" "}
              {gender == "Male" && (
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      width: "60ch",
                    }}
                  >
                    <FullBodyImage onValueChange={setFullImageFront} />
                  </Box>
                  <Box
                    sx={{
                      width: "60ch",
                    }}
                  >
                    <FullBodyBackImage onValueChange={setFullImageBack} />
                  </Box>
                </Box>
              )}
              {gender == "Female" && (
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      width: "60ch",
                    }}
                  >
                    <FullBodyFemaleFrontImage
                      onValueChange={setFullImageFront}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: "60ch",
                    }}
                  >
                    <FullBodyFemaleBackImage onValueChange={setFullImageBack} />
                  </Box>
                </Box>
              )}
            </>
          )}
          <TextInputField
            sx={{ width: "100%" }}
            name={form.additionalNotes.name}
            label={form.additionalNotes.label}
            id={form.additionalNotes.name}
            rows={5}
            multiline
          />
        </FormikInit>
      )}
    </ContainerLoaderOverlay>
  );
};
