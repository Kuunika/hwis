import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button } from "@mui/material";
import { FullBody } from "@/assets/fullBody";
import { DataBox, RushForm } from "./forms";
import { useImageFormTransform } from "@/hooks";
export function FullBodyImage() {
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
  const { setData, submittedValues } = useImageFormTransform();

  const handleDataSubmission = (
    section: string,
    formData: any,
    formConceptsLabels: Array<{ concept: string; label: string }>
  ) => {
    setData({ section, formData, formConceptsLabels });
    setAnchorEl(null);
    handleFormSubmit(formData);
  };

  return (
    <>
      <FullBody ref={containerRef} />
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
          onCancel={() => setAnchorEl(null)}
          onSubmit={(values, formConceptsLabels) =>
            handleDataSubmission(
              selectedSection.label as string,
              values,
              formConceptsLabels
            )
          }
        />
      </SVGPopover>
    </>
  );
}
