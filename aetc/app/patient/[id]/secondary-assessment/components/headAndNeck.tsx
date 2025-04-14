"use client";

import React, { useState } from "react";
import { FormikInit } from "@/components";
import * as yup from "yup";

import {
  HeadNeckBackImage,
  HeadNeckFrontImage,
  HeadNeckImage,
  HeadNeckLeftImage,
  HeadNeckRightImage,
} from "@/components/svgImages";
import { getActivePatientDetails, useSubmitEncounter } from "@/hooks";
import { concepts, encounters } from "@/constants";
import { flattenImagesObs } from "@/helpers";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import ComponentSlider from "@/components/slider/slider";

import { HeadNeckLeftFemaleImage } from "@/components/svgImages/headNeckLeftFemale";
import { HeadNeckFrontFemaleImage } from "@/components/svgImages/headNeckFrontFemale";
import { HeadNeckRightFemaleImage } from "@/components/svgImages/headNeckRightFemale";
import { getDateTime } from "@/helpers/dateTime";
import { Checkbox, FormControlLabel } from "@mui/material";

type Props = {
  onSubmit: () => void;
};
const form = {
  generalInformation: {
    name: "generalInformation",
    label: "General Information",
  },
};

const schema = yup.object({
  [form.generalInformation.name]: yup
    .string()
    .label(form.generalInformation.label),
});

const initialValues = {
  temperatureInfo: "",
  skinRashInfo: "",
  rashDescription: "",
};
export const HeadAndNeck = ({ onSubmit }: Props) => {
  const [headNeckImageEncounter, setHeadNeckImageEncounter] = useState<
    Array<any>
  >([]);
  const [leftHeadNeckImageEncounter, setLeftHeadNeckImageEncounter] = useState<
    Array<any>
  >([]);
  const [rightHeadNeckImageEncounter, setRightHeadNeckImageEncounter] =
    useState<Array<any>>([]);
  const [backHeadNeckImageEncounter, setBackHeadNeckImageEncounter] = useState<
    Array<any>
  >([]);
  const { gender } = getActivePatientDetails();
  const [isChecked, setIsChecked] = useState(false);

  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.HEAD_AND_NECK_ASSESSMENT,
    onSubmit
  );

  const handleSubmitForm = async (values: any) => {
    const obsDatetime = getDateTime();

    const obs = [
      {
        concept: concepts.IMAGE_PART_NAME,
        obsDatetime,
        groupMembers: flattenImagesObs(headNeckImageEncounter),
        value: "anterior",
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        obsDatetime,
        groupMembers: flattenImagesObs(leftHeadNeckImageEncounter),
        value: "left lateral",
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        obsDatetime,
        groupMembers: flattenImagesObs(rightHeadNeckImageEncounter),
        value: "right lateral",
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        obsDatetime,
        groupMembers: flattenImagesObs(backHeadNeckImageEncounter),
        value: "posterior",
      },
      {
        concept: concepts.NOTES,
        value: isChecked ? "Normal" : "Abnormalities",
        obsDatetime,
      },
    ];

    await handleSubmit(obs);
  };

  const slides = [
    {
      id: 1,
      label: "Left Lateral",
      content: (
        <>
          {/* <HeadLeftImage onValueChange={setLeftHeadNeckImageEncounter} /> */}
          {gender == "Male" && (
            <HeadNeckLeftImage onValueChange={setLeftHeadNeckImageEncounter} />
          )}
          {gender == "Female" && (
            <HeadNeckLeftFemaleImage
              onValueChange={setLeftHeadNeckImageEncounter}
            />
          )}
        </>
      ),
    },
    {
      id: 2,
      label: "Anterior",
      content: (
        <>
          {/* <HeadNeckImage onValueChange={setHeadNeckImageEncounter} /> */}
          {/* <HeadNeckFrontImage
            gender={gender as any}
            onValueChange={setHeadNeckImageEncounter}
          /> */}
          {gender == "Male" && (
            <HeadNeckFrontImage onValueChange={setHeadNeckImageEncounter} />
          )}
          {gender == "Female" && (
            <HeadNeckFrontFemaleImage
              onValueChange={setHeadNeckImageEncounter}
            />
          )}
        </>
      ),
    },
    {
      id: 3,
      label: "Right Lateral",
      content: (
        <>
          {/* <HeadRightImage onValueChange={setRightHeadNeckImageEncounter} /> */}

          {/* <HeadNeckRightImage
            gender={gender as any}
            onValueChange={setRightHeadNeckImageEncounter}
          /> */}
          {gender == "Male" && (
            <HeadNeckRightImage
              onValueChange={setRightHeadNeckImageEncounter}
            />
          )}
          {gender == "Female" && (
            <HeadNeckRightFemaleImage
              onValueChange={setRightHeadNeckImageEncounter}
            />
          )}
        </>
      ),
    },
    {
      id: 4,
      label: "Posterior",
      content: (
        <>
          {/* <HeadBackImage onValueChange={setBackHeadNeckImageEncounter} /> */}
          <HeadNeckBackImage onValueChange={setBackHeadNeckImageEncounter} />
        </>
      ),
    },
  ];

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
        submitButtonText="Next"
      >
        <FormControlLabel
          label="Tick if the Head and Neck is normal and there are no abnormalities"
          control={
            <Checkbox
              checked={isChecked}
              onChange={(event) => {
                setIsChecked(event.currentTarget.checked);
              }}
            />
          }
        />
        <br />
        {!isChecked && <ComponentSlider slides={slides} />}
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
