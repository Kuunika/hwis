import React, { useEffect, useRef, useState } from "react";
import Lung from "../../assets/lung";
import { Box, Typography } from "@mui/material";
import { BreathingLungForm } from "./form"
import { BasePopover } from "../popover";
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";

export const LungImage = () => {
    const { handleFormSubmit, handleClose, containerRef, section, anchorEl, setAnchorEl, highlightSection, selectedSection, setSelectedSection, highlightAllSelectedSections, setIds } = useImage()

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