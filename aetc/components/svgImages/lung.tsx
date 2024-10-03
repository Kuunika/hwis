import React from "react";
import Lung from "../../assets/lung";
import { BreathingLungForm } from "./form"

import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";

export const LungImage = () => {
    const { handleFormSubmit, handleClose, containerRef, section, anchorEl, selectedSection } = useImage()

    return (
        <div>
            <Lung ref={containerRef} />
            <SVGPopover section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
                <BreathingLungForm onCancel={handleClose} onSubmit={handleFormSubmit} />
            </SVGPopover>

        </div>
    );

};

export default LungImage;