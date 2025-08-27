import LungBack from "@/assets/lungBack";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { BreathingLungForm, DataBox } from "./forms";
import { useImageFormTransform } from "@/hooks";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { concepts } from "@/constants";
import { BreathingSoundsForm } from "./forms/chest/breathSoundsForm";
import { PercussionForm } from "./forms/chest/percussionForm";

interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
  breathSounds?: boolean;
  percussion?: boolean;
}

export function LungBackImage({
  onValueChange,
  imageEncounter,
  imageSection,
  breathSounds = false,
  percussion = false,
}: Props) {
  const {
    handleClose,
    handleFormSubmit,
    containerRef,
    section,
    anchorEl,
    selectedSection,
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

    handleFormSubmit(formData);
  };

  return (
    <div>
      <LungBack ref={containerRef} />
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
        {breathSounds ? (
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
        ) : percussion ? (
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
        ) : (
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
