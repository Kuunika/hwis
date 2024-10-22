import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button, Typography } from "@mui/material";

import React, { useEffect, useState } from "react";
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
import { DataBox, OtherAbnormalityForm } from "./forms";
import { FormValueLabel } from "@/interfaces";
import { useImageFormTransform } from "@/hooks";

export function HeadNeckImage() {
  const { handleClose, containerRef, section, anchorEl, selectedSection } =
    useImage();
  const idSelected = selectedSection.id;
  const { setData, submittedValues } = useImageFormTransform();

  const handleDataSubmission = (
    section: string,
    formData: any,
    formConceptsLabels: Array<{ concept: string; label: string }>
  ) => {
    setData({ section, formData, formConceptsLabels });
  };

  return (
    <>
      <HeadNeck ref={containerRef} />
      <Box display="flex">
        {submittedValues.map((value) => (
          <DataBox key={value.section} labelValue={value} />
        ))}
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
