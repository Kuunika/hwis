import { Abdomen } from "@/assets/abdomen";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button } from "@mui/material";
import { concepts } from "@/constants";
import { useEffect } from "react";
export function AbdomenImage({
  onValueChange,
}: {
  onValueChange: (values: any) => void;
}) {
  const {
    handleClose,
    handleFormSubmit,
    containerRef,
    section,
    anchorEl,
    setAnchorEl,
    highlightSection,
    selectedSection,
    setSelectedSection,
    highlightAllSelectedSections,
    setIds,
    ids,
  } = useImage();

  useEffect(() => {
    onValueChange(ids);
  }, [ids]);

  return (
    <>
      <Abdomen ref={containerRef} />
      <SVGPopover
        section={section}
        selectedSection={selectedSection}
        anchorEl={anchorEl}
        handleClose={handleClose}
      >
        <Box sx={{ display: "flex", gap: "0.2ch" }}>
          <Button
            type="submit"
            onClick={() =>
              handleFormSubmit({
                [concepts.SELECTED_SECTION]: selectedSection.id,
              })
            }
            sx={{ borderRadius: "1px" }}
            variant="contained"
            fullWidth
          >
            Select
          </Button>
          <Button sx={{ borderRadius: "1px" }} fullWidth onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </SVGPopover>
    </>
  );
}
