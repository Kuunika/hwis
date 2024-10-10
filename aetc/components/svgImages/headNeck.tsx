
import { useImage } from "@/hooks/useImage";
import { SVGPopover } from "./svgPopover";
import { Box, Button } from "@mui/material";

import React from "react";
import { HeadNeck } from "@/assets/headNeck";
import { EarForm, EyeForm, MouthForm, NoseForm, OtherTemporalCrownForm } from "./forms/headNeck";
import { OtherAbnormalityForm } from "./forms";


export function HeadNeckImage() {
    const { handleClose, handleFormSubmit, containerRef, section, anchorEl, setAnchorEl, highlightSection, selectedSection, setSelectedSection, highlightAllSelectedSections, setIds } = useImage()
   const idSelected = selectedSection.id;
    return <>
        <HeadNeck ref={containerRef} />
        <SVGPopover width="50ch" section={section} selectedSection={selectedSection} anchorEl={anchorEl} handleClose={handleClose}>
               {(idSelected=='right_eye' || idSelected=='left_eye') && <EyeForm onSubmit={()=>{}} />} 
               {idSelected=='mouth' && <MouthForm onSubmit={()=>{}} />} 
               {idSelected=='nose' && <NoseForm onSubmit={()=>{}} />} 
               {(idSelected=='left_temporal' || idSelected=='right_temporal' || idSelected=='crown') && <OtherTemporalCrownForm onSubmit={()=>{}} />}
               {(idSelected=='right_ear' || idSelected=='left_ear' ) && <EarForm onSubmit={()=>{}} />} 
        </SVGPopover>
    </>
}