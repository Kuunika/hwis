import { Abdomen } from "@/assets/abdomen";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button } from "@mui/material";
import { OtherAbnormalityForm } from "./forms";

export function AbdomenImageWithOtherForm() {
    const { handleClose, handleFormSubmit, containerRef, section, anchorEl, selectedSection } = useImage()

    return <>
        <Abdomen ref={containerRef} />
        <SVGPopover section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
            <OtherAbnormalityForm onCancel={handleClose} onSubmit={handleFormSubmit} />
        </SVGPopover>
    </>
}