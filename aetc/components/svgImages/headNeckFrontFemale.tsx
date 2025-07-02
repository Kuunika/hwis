"use client";
import { SVGPopover } from "./svgPopover";
import { Box } from "@mui/material";

import React, { useEffect } from "react";
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
import { DataBox } from "./forms";

import { useImageFormTransform } from "@/hooks";
import { concepts, encounters } from "@/constants";
import { HeadNeckFront } from "@/assets";
import { useImageUpdate } from "@/hooks/useImageUpdate";
import { HeadNeckFrontFemale } from "@/assets/headNeckFrontFemale";

interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
}

export function HeadNeckFrontFemaleImage({
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
  } = useImageUpdate();
  const idSelected = selectedSection.id;
  const labelSelected = selectedSection.label as string;

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
      <HeadNeckFrontFemale ref={containerRef} />
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
        {idSelected == encounters.HEAD_RIGHT_EYE && (
          <EyeForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {idSelected == encounters.HEAD_LEFT_EYE && (
          <EyeForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {idSelected == encounters.HEAD_MOUTH && (
          <MouthForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {idSelected == encounters.HEAD_NOSE && (
          <NoseForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {idSelected == encounters.HEAD_NECK && (
          <NeckForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}

        {(idSelected == encounters.HEAD_LEFT_TEMPORAL ||
          idSelected == encounters.HEAD_RIGHT_TEMPORAL ||
          idSelected == encounters.HEAD_CROWN) && (
          <OtherTemporalCrownForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {(idSelected == encounters.HEAD_CHIN ||
          idSelected == encounters.HEAD_LEFT_CHEEK ||
          idSelected == encounters.HEAD_RIGHT_CHEEK ||
          idSelected == encounters.HEAD_FOREHEAD) && (
          <OtherPartsOfTheHeadForm
            onSubmit={(values, formConceptsLabels) =>
              handleDataSubmission(labelSelected, values, formConceptsLabels)
            }
          />
        )}
        {(idSelected == encounters.HEAD_RIGHT_EAR ||
          idSelected == encounters.HEAD_LEFT_EAR) && (
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
