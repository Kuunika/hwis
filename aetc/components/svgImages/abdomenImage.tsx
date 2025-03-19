import { Abdomen } from "@/assets/abdomen";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button } from "@mui/material";
import {
  DataBox,
  OtherAbnormalityForm,
  SecondaryAbdomenPelvicForm,
} from "./forms";
import { useImageFormTransform } from "@/hooks";
import { useEffect } from "react";
import { concepts } from "@/constants";
import { PalpationForm } from "./forms/abdomen/palpationForm";
import { AbdomenMale } from "@/assets/abdomenMale";
import { AbdomenFemale } from "@/assets/abdomenFemale";
import { useImageUpdate } from "@/hooks/useImageUpdate";
interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
  formNameSection?: string;
}

export function NewAbdomenImage({
  onValueChange,

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
  } = useImageUpdate();

  useEffect(() => {
    console.log({ ids });
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
      <AbdomenMale ref={containerRef} />

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
        {formNameSection == "other" && (
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

        {formNameSection == "secondaryAbdomen" && (
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
        )}
      </SVGPopover>
    </>
  );
}
