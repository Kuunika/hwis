import { SVGPopover } from "./svgPopover";
import { Box } from "@mui/material";

import { BreathingLungForm, DataBox, RushForm } from "./forms";
import { useImageFormTransform } from "@/hooks";

import { concepts } from "@/constants";
import { useEffect } from "react";

import { useImageUpdate } from "@/hooks/useImageUpdate";
import { FullBodyFemaleBack } from "@/assets/fullBodyFemaleBack";
import {
  LungBackFemale,
  LungBackMale,
  LungFrontFemale,
  LungFrontMale,
  LungLeftFemale,
  LungRightMale,
} from "@/assets";
import { BreathingSoundsForm } from "./forms/chest/breathSoundsForm";
import { PercussionForm } from "./forms/chest/percussionForm";
interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
  form: "percussion" | "breathSounds" | "breathLungs";
}

export function LungBackMaleImage({
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
      <LungBackMale ref={containerRef} />
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
        {form == "percussion" && (
          <PercussionForm
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
        {form == "breathLungs" && (
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
      </SVGPopover>
    </div>
  );
}
