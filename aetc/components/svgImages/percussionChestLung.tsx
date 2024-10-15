import React from "react";
import Lung from "../../assets/lung";
import {  PercussionChestLungForm } from "./forms"

import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";


export const PercussionChestLung = () => {
    const { handleFormSubmit, handleClose, containerRef, section, anchorEl, selectedSection } = useImage()

    return (
        <div>
            <Lung ref={containerRef} />
            <SVGPopover section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
                <PercussionChestLungForm onCancel={handleClose} onSubmit={handleFormSubmit} />
            </SVGPopover>
        </div>
    );

};

export default PercussionChestLung;