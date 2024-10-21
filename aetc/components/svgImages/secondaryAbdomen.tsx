import { Abdomen } from "@/assets/abdomen";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { SecondaryAbdomenPelvicForm } from "./forms";

export function SecondaryAbdomenImage() {
    const { handleClose, handleFormSubmit, containerRef, section, anchorEl, selectedSection } = useImage()

    return <>
        <Abdomen ref={containerRef} />
        <SVGPopover section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
            <SecondaryAbdomenPelvicForm onCancel={handleClose} onSubmit={handleFormSubmit} />
        </SVGPopover>
    </>
}