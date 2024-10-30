import { Abdomen } from "@/assets/abdomen";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { DataBox, SecondaryAbdomenPelvicForm } from "./forms";
import { useImageFormTransform } from "@/hooks";
import { Box } from "@mui/material";

export function SecondaryAbdomenImage() {
  const {
    handleClose,
    containerRef,
    section,
    anchorEl,
    selectedSection,
    handleFormSubmit,
  } = useImage();
  const idSelected = selectedSection.id;
  const labelSelected = selectedSection.label;

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
      <Abdomen ref={containerRef} />
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
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
        <SecondaryAbdomenPelvicForm
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
