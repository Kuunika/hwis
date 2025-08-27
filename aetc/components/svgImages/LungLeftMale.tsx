import { SVGPopover } from "./svgPopover";
import { Box } from "@mui/material";

import { BreathingSoundsChestLungForm, DataBox, RushForm } from "./forms";
import { useImageFormTransform } from "@/hooks";

import { concepts } from "@/constants";
import { useEffect } from "react";

import { useImageUpdate } from "@/hooks/useImageUpdate";
import { FullBodyFemaleBack } from "@/assets/fullBodyFemaleBack";
import {
  LungBackFemale,
  LungFrontFemale,
  LungLeftFemale,
  LungLeftMale,
} from "@/assets";
import { BreathingSoundsForm } from "./forms/chest/breathSoundsForm";
interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
  form?:
    | "breathingSoundChest"
    | "breathSounds"
    | "breathLungs"
    | "medicalInpatient";
}

export function LungLeftMaleImage({
  onValueChange,
  imageEncounter,
  imageSection,
  form = "breathSounds",
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

    handleFormSubmit(formData);
  };

  return (
    <div>
      <LungLeftMale ref={containerRef} />
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
