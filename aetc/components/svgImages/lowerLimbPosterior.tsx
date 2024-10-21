
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { LegAbnormality } from "@/assets/legAbnormality";
import { ExtremitiesLegForm } from "./forms"
export function LowerLimbPosterior() {
    const { handleClose, handleFormSubmit, containerRef, section, anchorEl, setAnchorEl, highlightSection, selectedSection, setSelectedSection, highlightAllSelectedSections, setIds } = useImage()

    return <>
        <LegAbnormality ref={containerRef} />
        <SVGPopover section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
            <ExtremitiesLegForm onCancel={handleClose} onSubmit={handleFormSubmit} />
        </SVGPopover>
    </>
}