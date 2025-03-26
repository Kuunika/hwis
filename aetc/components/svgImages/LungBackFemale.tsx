import { SVGPopover } from "./svgPopover";
import { Box } from "@mui/material";

import { BreathingLungForm, DataBox, RushForm } from "./forms";
import { useImageFormTransform } from "@/hooks";

import { concepts } from "@/constants";
import { useEffect } from "react";

import { useImageUpdate } from "@/hooks/useImageUpdate";
import { FullBodyFemaleBack } from "@/assets/fullBodyFemaleBack";
import { LungBackFemale, LungFrontFemale, LungLeftFemale } from "@/assets";
import { PercussionForm } from "./forms/chest/percussionForm";
import { BreathingSoundsForm } from "./forms/chest/breathSoundsForm";
import { PercussionMedicalInPatientForm } from "./forms/chest/percussionMedicalInpatientForm";
interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
  form: "percussion" | "breathSounds" | "breathLungs" | "medicalInpatient";
}

export function LungBackFemaleImage({ onValueChange, form }: Props) {
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
      <LungBackFemale ref={containerRef} />
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
        {form == "medicalInpatient" && (
          <PercussionMedicalInPatientForm
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
