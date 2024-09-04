import { Abdomen } from "@/assets/abdomen";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { BreathingLungForm } from "./form"
import { Box, Button } from "@mui/material";
export function AbdomenImage() {
    const { handleClose, handleFormSubmit, containerRef, section, anchorEl, setAnchorEl, highlightSection, selectedSection, setSelectedSection, highlightAllSelectedSections, setIds } = useImage()

    return <>
        <Abdomen ref={containerRef} />
        <SVGPopover section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
            <Box sx={{ display: "flex", gap: "0.2ch" }}>
                <Button type="submit" onClick={handleFormSubmit} sx={{ borderRadius: "1px" }} variant="contained" fullWidth>Select</Button>
                <Button sx={{ borderRadius: "1px" }} fullWidth onClick={handleClose}>Cancel</Button>
            </Box>
        </SVGPopover>
    </>
}