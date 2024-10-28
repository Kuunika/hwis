import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { LegAbnormality } from "@/assets/legAbnormality";
import { DataBox, LegDeformityForm } from "./forms";
import { useImageFormTransform } from "@/hooks";
import { Box } from "@mui/material";
export function LegAbnormalityImage() {
  const {
    handleClose,
    handleFormSubmit,
    containerRef,
    section,
    anchorEl,
    setAnchorEl,

    selectedSection,
  } = useImage();
  const { setData, submittedValues } = useImageFormTransform();

  const handleDataSubmission = (
    section: string,
    formData: any,
    formConceptsLabels: Array<{ concept: string; label: string }>
  ) => {
    setData({ section, formData, formConceptsLabels });
    handleFormSubmit(formData);
  };

  return (
    <>
      <LegAbnormality ref={containerRef} />
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
        <LegDeformityForm
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
    </>
  );
}
