import { SVGPopover } from "./svgPopover";
import { Box } from "@mui/material";

import { DataBox, RushForm } from "./forms";
import { useImageFormTransform } from "@/hooks";

import { concepts } from "@/constants";
import { useEffect } from "react";

import { useImageUpdate } from "@/hooks/useImageUpdate";
import { FullBodyFemaleBack } from "@/assets/fullBodyFemaleBack";
import { LungBackFemale, LungFrontFemale, LungLeftFemale } from "@/assets";
interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
}

export function LungFrontFemaleImage({
  onValueChange,
  imageEncounter,
  imageSection,
}: Props) {
  const {
    handleClose,
    handleFormSubmit,
    containerRef,
    section,
    anchorEl,
    selectedSection,
    ids,
  } = useImageUpdate();
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
    if (imageEncounter && imageSection) {
      formData = {
        ...formData,
        [concepts.IMAGE_ENCOUNTER]: imageEncounter,
        [concepts.IMAGE_SECTION]: imageSection,
      };
    }
    handleFormSubmit(formData);
  };

  return (
    <div>
      <LungBackFemale ref={containerRef} />
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {submittedValues.map((value) => (
          <DataBox key={value.section} labelValue={value} />
        ))}
      </Box>
      <SVGPopover
        section={section}
        selectedSection={selectedSection}
        anchorEl={anchorEl}
        handleClose={handleClose}
      >
        <></>
      </SVGPopover>
    </div>
  );
}
