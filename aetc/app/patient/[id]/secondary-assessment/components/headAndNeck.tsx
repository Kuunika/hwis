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
import { HeadLeftImage } from "@/components/svgImages/headLeft";
import { HeadRightImage } from "@/components/svgImages/headRight";
import { HeadBackImage } from "@/components/svgImages/headBack";

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

  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.HEAD_AND_NECK_ASSESSMENT,
    onSubmit
  );

  const handleSubmitForm = async (values: any) => {
    const obs = [
      {
        concept: concepts.IMAGE_PART_NAME,
        obsDatetime: new Date(),
        groupMembers: flattenImagesObs(headNeckImageEncounter),
        value: "Front",
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        obsDatetime: new Date(),
        groupMembers: flattenImagesObs(leftHeadNeckImageEncounter),
        value: "Left",
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        obsDatetime: new Date(),
        groupMembers: flattenImagesObs(rightHeadNeckImageEncounter),
        value: "Right",
      },
      {
        concept: concepts.IMAGE_PART_NAME,
        obsDatetime: new Date(),
        groupMembers: flattenImagesObs(backHeadNeckImageEncounter),
        value: "Back",
      },
    ];

    await handleSubmit(obs);
  };

  const slides = [
    {
      id: 1,
      label: "Left",
      content: (
        <>
          {/* <HeadLeftImage onValueChange={setLeftHeadNeckImageEncounter} /> */}
          <HeadNeckLeftImage
            gender={gender as any}
            onValueChange={setLeftHeadNeckImageEncounter}
          />
        </>
      ),
    },
    {
      id: 2,
      label: "Front",
      content: (
        <>
          {/* <HeadNeckImage onValueChange={setHeadNeckImageEncounter} /> */}
          <HeadNeckFrontImage
            gender={gender as any}
            onValueChange={setHeadNeckImageEncounter}
          />
        </>
      ),
    },
    {
      id: 3,
      label: "Right",
      content: (
        <>
          {/* <HeadRightImage onValueChange={setRightHeadNeckImageEncounter} /> */}

          <HeadNeckRightImage
            gender={gender as any}
            onValueChange={setRightHeadNeckImageEncounter}
          />
        </>
      ),
    },
    {
      id: 4,
      label: "Back",
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
        <ComponentSlider slides={slides} />
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
