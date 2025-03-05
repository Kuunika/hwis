import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box } from "@mui/material";

import React, { useEffect } from "react";

import { OtherPartsOfTheHeadForm } from "./forms/headNeck";
import { DataBox } from "./forms";

import { useImageFormTransform } from "@/hooks";
import { concepts } from "@/constants";

import { HeadNeckRight } from "@/assets";

interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
}

export function HeadNeckRightImage({
  onValueChange,
  imageEncounter,
  imageSection,
}: Props) {
  const {
    handleClose,
    containerRef,
    section,
    anchorEl,
    selectedSection,
    handleFormSubmit,
    ids,
  } = useImage();
  const idSelected = selectedSection.id;
  const labelSelected = selectedSection.label as string;

  const { setData, submittedValues } = useImageFormTransform();

  useEffect(() => {
    onValueChange(ids);
  }, [ids]);

  const handleDataSubmission = (
    section: string,
    formData: any,
    formConceptsLabels: Array<{ concept: string; label: string }>
  ) => {
    setData({ section, formData, formConceptsLabels });

    const updatedFormData = {
      ...formData,
      ...(imageEncounter && { [concepts.IMAGE_ENCOUNTER]: imageEncounter }),
      ...(imageSection && { [concepts.IMAGE_SECTION]: imageSection }),
    };

    handleFormSubmit(updatedFormData);
  };

  return (
    <>
      {/* <HeadRight ref={containerRef} /> */}
      <HeadNeckRight ref={containerRef} />
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
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
        <OtherPartsOfTheHeadForm
          onSubmit={(values, formConceptsLabels) =>
            handleDataSubmission(labelSelected, values, formConceptsLabels)
          }
        />
      </SVGPopover>
    </>
  );
}
