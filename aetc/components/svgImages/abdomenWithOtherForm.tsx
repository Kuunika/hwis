import { Abdomen } from "@/assets/abdomen";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button } from "@mui/material";
import { DataBox, OtherAbnormalityForm } from "./forms";
import { useImageFormTransform } from "@/hooks";
import { useEffect } from "react";
import { concepts } from "@/constants";
import { PalpationForm } from "./forms/abdomen/palpationForm";
interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
  formNameSection?: string;
}

export function AbdomenImageWithOtherForm({
  onValueChange,
  imageEncounter,
  imageSection,
  formNameSection,
}: Props) {
  const {
    handleClose,
    handleFormSubmit,
    containerRef,
    section,
    anchorEl,
    selectedSection,
    ids,
    deleteSection,
    setData,
    submittedValues,
  } = useImage();

  useEffect(() => {
    onValueChange(ids);
  }, [ids]);

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
          <>
            <DataBox
              onDelete={() => deleteSection(value.section)}
              key={value.section}
              labelValue={value}
            />
          </>
        ))}
      </Box>
      <SVGPopover
        section={section}
        selectedSection={selectedSection}
        anchorEl={anchorEl}
        handleClose={handleClose}
      >
        {formNameSection != "palpation" && (
          <OtherAbnormalityForm
            onCancel={handleClose}
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(
                selectedSection.label as string,
                values,
                formConceptsLabels
              )
            }
          />
        )}
        {formNameSection == "palpation" && (
          <PalpationForm
            onCancel={handleClose}
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(
                selectedSection.label as string,
                values,
                formConceptsLabels
              )
            }
          />
        )}
      </SVGPopover>
    </>
  );
}
