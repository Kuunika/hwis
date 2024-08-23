import React, { useEffect, useRef, useState } from "react";
import Lung from "../../assets/lung";
import { Box, Typography } from "@mui/material";
import { BreathingLungForm } from "@/app/primary-assessment/components/forms/breathingLungForm";
import { BasePopover } from "../popover";

export const LungImage = () => {
    const containerRef = useRef<SVGSVGElement>(null);
    const [ids, setIds] = useState<Array<{ id: string | null, label: string | null, notes?: any, description?: any, other?: any }>>([]); // array of sections with data added
    const [counter, setCounter] = useState(0) // state used just to persist an click color highlight after mouseleave event
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedSection, setSelectedSection] = useState<{ id: string | null, label: string | null }>({ id: "", label: "" })
    const [anchorElDisplay, setAnchorElDisplay] = React.useState(null);
    const [hoverId, setHoverId] = useState('')


    const highlightcolor = "#708090"

    const handleMouseEnter = (e: MouseEvent) => {
        const target = e.currentTarget as SVGElement;
        setHoverId(target.id);

        //@ts-ignore
        setAnchorElDisplay(e.target)
        target.style.opacity = `0.5`;
        target.style.fill = highlightcolor
        target.style.cursor = "pointer"
    }
    const handleMouseLeave = (e: MouseEvent) => {
        const target = e.currentTarget as SVGElement;
        // setAnchorElDisplay(null)
        target.style.fill = ""
        target.style.opacity = `0`;
        setCounter(count => count + 1)
    }

    useEffect(() => {
        highlightAllSelectedSections()
    }, [ids, counter])

    useEffect(() => {
        highlightSection(selectedSection.id as string, highlightcolor, "0.5")
    }, [selectedSection, counter])

    useEffect(() => {
        let rects: HTMLCollectionOf<SVGRectElement>;
        if (containerRef.current) {
            rects = containerRef.current.getElementsByTagName('rect');
            for (let i = 0; i < rects.length; i++) {
                rects[i].style.fill = ``;
                rects[i].style.opacity = `0`;
                rects[i].addEventListener('mouseleave', handleMouseLeave);
                rects[i].addEventListener('mouseenter', handleMouseEnter);
                rects[i].addEventListener('click', handleClickLister)
            }
        }
        return () => {
            for (let i = 0; i < rects.length; i++) {
                rects[i].removeEventListener('mouseleave', handleMouseLeave);
                rects[i].removeEventListener('mouseenter', handleMouseEnter);
            }
        };
    }
        , [])



    const highlightAllSelectedSections = () => {
        if (containerRef.current) {
            for (let i = 0; i < ids.length; i++) {
                highlightSection(ids[i].id as string, highlightcolor, "0.5");
            }
        }
    }
    const highlightSection = (id: string, color: string, opacity: string) => {
        if (containerRef.current) {
            const rect = containerRef.current.getElementById(id) as SVGAElement;
            if (!rect) return;
            rect.style.fill = color;
            rect.style.opacity = opacity
        }
    }

    const handleClickLister = (e: Event) => {
        const target = e.currentTarget as SVGElement;
        const label = target.getAttribute('data-label'); // Retrieve custom attribute
        const id = target.id
        //@ts-ignore
        setAnchorEl(e?.currentTarget);
        setSelectedSection({ id, label })
        // setIds(ids => [...ids, { id, label }]);
    }



    const handleClose = () => {
        setAnchorEl(null);
        highlightSection(selectedSection.id as string, "", "0");
        setSelectedSection({ id: null, label: null })
        highlightAllSelectedSections()
    };

    const handleFormSubmit = (values: any) => {
        setIds(ids => [...ids, { ...selectedSection, ...values }])
        handleClose()
    }

    const section = ids.find(id => id.id == selectedSection.id);

    return (
        <div>
            <Lung ref={containerRef} />
            <BasePopover onClose={handleClose} anchorEl={anchorEl} anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }} transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
                <Box sx={{ padding: "1ch", width: "30ch" }}>
                    <Typography variant="h5">{selectedSection.label}</Typography>
                    <br />
                    <Typography>{section?.notes}</Typography>
                    <Typography>{section?.description?.reduce((acc: any, item: any) => {
                        return acc + "," + item.id
                    }, [''])}</Typography>
                    <BreathingLungForm onCancel={handleClose} onSubmit={handleFormSubmit} />
                </Box>
            </BasePopover>
            {/* <BasePopover onClose={() => setAnchorElDisplay(null)} anchorEl={anchorElDisplay} anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }} transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
                <Typography>HHHHHHHHHHHHHHHH</Typography>
            </BasePopover> */}
        </div>
    );

};

export default LungImage;
