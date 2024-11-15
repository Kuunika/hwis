import React, { useEffect } from "react";
import Lung from "../../assets/lung";
import { ChestLungForm, DataBox } from "./forms";

import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { useImageFormTransform } from "@/hooks";
import { Box } from "@mui/material";
import { concepts } from "@/constants";

interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
}

export const ChestLung = ({
  onValueChange,
  imageEncounter,
  imageSection,
}: Props) => {
  const {
    handleFormSubmit,
    handleClose,
    containerRef,
    section,
    anchorEl,
    selectedSection,
    ids,
  } = useImage();
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
        <ChestLungForm
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

export default ChestLung;
