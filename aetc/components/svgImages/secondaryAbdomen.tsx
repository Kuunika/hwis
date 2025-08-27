import { Abdomen } from "@/assets/abdomen";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { DataBox, SecondaryAbdomenPelvicForm } from "./forms";
import { useImageFormTransform } from "@/hooks";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { concepts } from "@/constants";

interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
}

export function SecondaryAbdomenImage({
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
