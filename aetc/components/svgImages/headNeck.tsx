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
  const [submittedValues, setSubmittedValues] = useState<Array<FormValueLabel>>(
    []
  );

  const handleDataSubmission = (
    section: string,
    data: any,
    formConceptsLabels: Array<{ concept: string; label: string }>
  ) => {
    const formData = Object.keys(data).map((key) => {
      const label = formConceptsLabels.find(
        ({ concept }: any) => concept == key
      )?.label;

      const labelValue = formConceptsLabels.find(
        (label) => label.concept == data[key]
      )?.label;

      return { label, value: labelValue ?? data[key] };
    });

    setSubmittedValues((values) => {
      const index = values.findIndex((v) => v.section == section);

      if (index < 0) {
        return [...values, { section, formValues: formData }];
      }

      values[index] = { section, formValues: formData };

      return [...values];
    });
  };

  useEffect(() => {
    console.log({ submittedValues });
  }, [submittedValues]);

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
