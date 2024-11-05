import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box } from "@mui/material";

import { DataBox, RushForm } from "./forms";
import { useImageFormTransform } from "@/hooks";
import { FullBodyBack } from "@/assets";
import { concepts } from "@/constants";
import { useEffect } from "react";
interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
}

export function FullBodyBackImage({
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
      <FullBodyBack ref={containerRef} />
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
        <RushForm
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
}
