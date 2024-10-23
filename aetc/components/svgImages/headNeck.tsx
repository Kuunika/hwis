import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button, Typography } from "@mui/material";

import React from "react";
import { HeadNeck } from "@/assets/headNeck";
import {
  EarForm,
  EyeForm,
  MouthForm,
  NeckForm,
  NoseForm,
  OtherPartsOfTheHeadForm,
  OtherTemporalCrownForm,
} from "./forms/headNeck";
import { DataBox, OtherAbnormalityForm } from "./forms";
import { FormValueLabel } from "@/interfaces";
import { useImageFormTransform } from "@/hooks";

export function HeadNeckImage() {
  const {
    handleClose,
    containerRef,
    section,
    anchorEl,
    selectedSection,
    handleFormSubmit,
  } = useImage();
  const idSelected = selectedSection.id;
  const labelSelected = selectedSection.label as string;

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
      <HeadNeck ref={containerRef} />
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {submittedValues.map((value) => (
          <DataBox key={value.section} labelValue={value} />
        ))}
      </Box>
      <SVGPopover
        width="50ch"
        section={section}
        selectedSection={selectedSection}
        anchorEl={anchorEl}
        handleClose={handleClose}
      >
        {idSelected == "right_eye" && (
          <EyeForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {idSelected == "left_eye" && (
          <EyeForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {idSelected == "mouth" && (
          <MouthForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {idSelected == "nose" && (
          <NoseForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {idSelected == "neck" && (
          <NeckForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}

        {(idSelected == "left_temporal" ||
          idSelected == "right_temporal" ||
          idSelected == "crown") && (
          <OtherTemporalCrownForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {(idSelected == "chin" ||
          idSelected == "left_cheek" ||
          idSelected == "right_cheek" ||
          idSelected == "forehead") && (
          <OtherPartsOfTheHeadForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {(idSelected == "right_ear" || idSelected == "left_ear") && (
          <EarForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
      </SVGPopover>
    </>
  );
}
