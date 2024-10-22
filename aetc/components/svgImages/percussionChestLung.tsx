import React from "react";
import Lung from "../../assets/lung";
import { DataBox, PercussionChestLungForm } from "./forms";

import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { useImageFormTransform } from "@/hooks";
import { Box } from "@mui/material";

export const PercussionChestLung = () => {
  const {
    handleFormSubmit,
    handleClose,
    containerRef,
    section,
    anchorEl,
    selectedSection,
    setAnchorEl,
  } = useImage();
  const { setData, submittedValues } = useImageFormTransform();

  const handleDataSubmission = (
    section: string,
    formData: any,
    formConceptsLabels: Array<{ concept: string; label: string }>
  ) => {
    console.log({ formData });
    setData({ section, formData, formConceptsLabels });
    setAnchorEl(null);
    handleFormSubmit(formData);
  };

  return (
    <div>
      <Lung ref={containerRef} />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {submittedValues.map((value) => (
          <DataBox maxWidth="230px" key={value.section} labelValue={value} />
        ))}
      </Box>
      <SVGPopover
        section={section}
        selectedSection={selectedSection}
        anchorEl={anchorEl}
        handleClose={handleClose}
      >
        <PercussionChestLungForm
          onCancel={handleClose}
          onSubmit={(values, formConceptsLabels) =>
            handleDataSubmission(
              selectedSection.label as string,
              values,
              formConceptsLabels
            )
          }
        />
      </SVGPopover>
    </div>
  );
};

export default PercussionChestLung;
