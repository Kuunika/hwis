import React from "react";
import Lung from "../../assets/lung";
import {  BreathingSoundsChestLungForm } from "./forms"

import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";


export const BreathingSoundsChestLung = () => {
    const { handleFormSubmit, handleClose, containerRef, section, anchorEl, selectedSection } = useImage()

    return (
        <div>
            <Lung ref={containerRef} />
            <SVGPopover section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
                <BreathingSoundsChestLungForm onCancel={handleClose} onSubmit={handleFormSubmit} />
            </SVGPopover>
        </div>
    );

};

export default BreathingSoundsChestLung;