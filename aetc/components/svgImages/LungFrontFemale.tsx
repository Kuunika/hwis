import { SVGPopover } from "./svgPopover";
import { Box, Button } from "@mui/material";

import {
  BreathingLungForm,
  BreathingSoundsChestLungForm,
  ChestLungForm,
  DataBox,
  PercussionChestLungForm,
  RushForm,
} from "./forms";
import { useImageFormTransform } from "@/hooks";

import { concepts } from "@/constants";
import { useEffect } from "react";

import { useImageUpdate } from "@/hooks/useImageUpdate";
import { FullBodyFemaleBack } from "@/assets/fullBodyFemaleBack";
import { LungFrontFemale, LungLeftFemale } from "@/assets";
import { BreathingSoundsForm } from "./forms/chest/breathSoundsForm";
interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
  form:
    | "breathSounds"
    | "breathingLung"
    | "selectable"
    | "chestLung"
    | "percussion"
    | "breathingSoundChest";
}

export function LungFrontFemaleImage({
  onValueChange,
  imageEncounter,
  imageSection,

  form,
}: Props) {
  const {
    handleClose,
    handleFormSubmit,
    containerRef,
    section,
    anchorEl,
    selectedSection,
    ids,
    deselectSection,
  } = useImageUpdate();
  const { setData, submittedValues } = useImageFormTransform();
  useEffect(() => {
    onValueChange(ids);
  }, [ids]);

  const isSelected = ids.find((id) => id.id == selectedSection.id);

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
      <LungFrontFemale ref={containerRef} />
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
        {form == "breathSounds" && (
          <BreathingSoundsForm
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
        {form == "breathingLung" && (
          <BreathingLungForm
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

        {form == "selectable" && (
          <Box sx={{ display: "flex", gap: "0.2ch" }}>
            {!isSelected && (
              <Button
                type="submit"
                onClick={() => handleFormSubmit({})}
                sx={{ borderRadius: "1px" }}
                variant="contained"
                fullWidth
              >
                Select
              </Button>
            )}
            {isSelected && (
              <Button
                type="submit"
                onClick={deselectSection}
                sx={{ borderRadius: "1px" }}
                variant="contained"
                color="inherit"
                fullWidth
              >
                deselect
              </Button>
            )}
            <Button
              sx={{ borderRadius: "1px" }}
              fullWidth
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        )}

        {form == "chestLung" && (
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
        )}
        {form == "percussion" && (
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
        )}
        {form == "breathingSoundChest" && (
          <BreathingSoundsChestLungForm
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
    </div>
  );
}
