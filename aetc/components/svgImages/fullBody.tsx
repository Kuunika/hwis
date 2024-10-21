
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button } from "@mui/material";
import { FullBody } from "@/assets/fullBody";
export function FullBodyImage() {
    const { handleClose, handleFormSubmit, containerRef, section, anchorEl, setAnchorEl, highlightSection, selectedSection, setSelectedSection, highlightAllSelectedSections, setIds } = useImage()

    return <>
        <FullBody ref={containerRef} />
        <SVGPopover section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
            <Box sx={{ display: "flex", gap: "0.2ch" }}>
                <Button type="submit" onClick={handleFormSubmit} sx={{ borderRadius: "1px" }} variant="contained" fullWidth>Select</Button>
                <Button sx={{ borderRadius: "1px" }} fullWidth onClick={handleClose}>Cancel</Button>
            </Box>
        </SVGPopover>
    </>
}