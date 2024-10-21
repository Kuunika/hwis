import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button, Typography } from "@mui/material";

import React from "react";
import { HeadNeck } from "@/assets/headNeck";
import {
  EarForm,
  EyeForm,
  MouthForm,
  NeckForm,
  NoseForm,
  OtherPartsOfTheHeadForm,
  OtherTemporalCrownForm,
} from "./forms/headNeck";
import { OtherAbnormalityForm } from "./forms";

export function HeadNeckImage() {
  const {
    handleClose,
    handleFormSubmit,
    containerRef,
    section,
    anchorEl,
    setAnchorEl,
    highlightSection,
    selectedSection,
    setSelectedSection,
    highlightAllSelectedSections,
    setIds,
  } = useImage();
  const idSelected = selectedSection.id;

  const data = [
    {
      id: "",
      label: "",
      values: [{ value: [{ value: "", label: "" }], label: "" }],
    },
  ];

  const handleDataSubmission = (
    section: string,
    data: any,
    formConceptsLabels: any
  ) => {
    const nameLabels = Object.keys(formConceptsLabels).map(
      (key) => formConceptsLabels[key]
    );
    const formData = Object.keys(data).map((key) => {
      const label = nameLabels.find(({ name }) => name == key)?.label;
      return { label, value: data[key] };
    });

    console.log({ formData });
  };

  return (
    <>
      <HeadNeck ref={containerRef} />
      <Box display="flex">
        <DataBox />
        <DataBox />
      </Box>
      <SVGPopover
        width="50ch"
        section={section}
        selectedSection={selectedSection}
        anchorEl={anchorEl}
        handleClose={handleClose}
      >
        {idSelected == "right_eye" && (
          <EyeForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission("Right Eye", values, formConceptsLabels)
            }
          />
        )}
        {idSelected == "left_eye" && <EyeForm onSubmit={() => {}} />}
        {idSelected == "mouth" && (
          <MouthForm onSubmit={(value) => console.log({ value })} />
        )}
        {idSelected == "nose" && <NoseForm onSubmit={() => {}} />}
        {idSelected == "neck" && <NeckForm onSubmit={() => {}} />}
        {(idSelected == "left_temporal" ||
          idSelected == "right_temporal" ||
          idSelected == "crown") && (
          <OtherTemporalCrownForm onSubmit={() => {}} />
        )}
        {(idSelected == "chin" ||
          idSelected == "left_cheek" ||
          idSelected == "right_cheek" ||
          idSelected == "forehead") && (
          <OtherPartsOfTheHeadForm onSubmit={() => {}} />
        )}
        {(idSelected == "right_ear" || idSelected == "left_ear") && (
          <EarForm onSubmit={() => {}} />
        )}
      </SVGPopover>
    </>
  );
}

const DataBox = () => {
  return (
    <Box border="solid black 1px" p="2ch" m="1px">
      <Typography variant="h6">Right Eye</Typography>
      <Box>
        <Box display="flex" alignItems="center">
          <Typography variant="body2">Abnormalities</Typography>:
          <Typography ml={1} variant="body2">
            Abnormalities
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
