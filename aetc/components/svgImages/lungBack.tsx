import LungBack from "@/assets/lungBack";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { BreathingLungForm } from "./forms"
export function LungBackImage() {
    const { handleClose, handleFormSubmit, containerRef, section, anchorEl, setAnchorEl, highlightSection, selectedSection, setSelectedSection, highlightAllSelectedSections, setIds } = useImage()

    return <>
        <LungBack ref={containerRef} />
        <SVGPopover section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
            <BreathingLungForm onCancel={handleClose} onSubmit={handleFormSubmit} />
        </SVGPopover>
    </>
}