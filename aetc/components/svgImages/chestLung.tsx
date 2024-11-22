import React, { useEffect } from "react";
import Lung from "../../assets/lung";
import { ChestLungForm, DataBox } from "./forms";

import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { useImageFormTransform } from "@/hooks";
import { Box, Button } from "@mui/material";
import { concepts } from "@/constants";

interface Props {
  onValueChange: (values: any) => void;
  imageEncounter?: string;
  imageSection?: string;
  selectable?: boolean;
}

export const ChestLung = ({
  onValueChange,
  imageEncounter,
  imageSection,
  selectable = false,
}: Props) => {
  const {
    handleFormSubmit,
    handleClose,
    containerRef,
    section,
    anchorEl,
    selectedSection,
    ids,
    deselectSection,
  } = useImage();
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

    const updatedFormData = {
      ...formData,
      ...(imageEncounter && { [concepts.IMAGE_ENCOUNTER]: imageEncounter }),
      ...(imageSection && { [concepts.IMAGE_SECTION]: imageSection }),
    };

    handleFormSubmit(updatedFormData);
  };

  return (
    <div>
      <Lung ref={containerRef} />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
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
        {!selectable ? (
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
        ) : (
          <Box sx={{ display: "flex", gap: "0.2ch" }}>
            {!isSelected && (
              <Button
                type="submit"
                onClick={handleFormSubmit}
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
      </SVGPopover>
    </div>
  );
};

export default ChestLung;
