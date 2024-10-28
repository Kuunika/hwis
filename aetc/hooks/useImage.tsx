import React from "react";
import { useRef, useState, useEffect } from "react";

export const useImage = () => {
  const containerRef = useRef<SVGSVGElement>(null);
  const [ids, setIds] = useState<
    Array<{
      id: string | null;
      label: string | null;
      notes?: any;
      description?: any;
      other?: any;
    }>
  >([]); // array of sections with data added
  const [counter, setCounter] = useState(0); // state used just to persist an click color highlight after mouseleave event
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSection, setSelectedSection] = useState<{
    id: string | null;
    label: string | null;
  }>({ id: "", label: "" });
  const [anchorElDisplay, setAnchorElDisplay] = React.useState(null);
  const [hoverId, setHoverId] = useState("");

  const highlightcolor = "#708090";

  const handleMouseEnter = (e: MouseEvent) => {
    const target = e.currentTarget as SVGElement;
    setHoverId(target.id);
    //@ts-ignore
    setAnchorElDisplay(e.target);
    target.style.opacity = `0.4`;
    target.style.fill = highlightcolor;
    target.style.cursor = "pointer";
  };
  const handleMouseLeave = (e: MouseEvent | Event) => {
    const target = e.currentTarget as SVGElement;
    target.style.opacity = `0`;
    target.style.fill = ``;
    setCounter((count) => count + 1);
  };

  useEffect(() => {
    highlightAllSelectedSections();
  }, [ids, counter]);

  useEffect(() => {
    highlightSection(selectedSection.id as string, highlightcolor, "0.5");
  }, [selectedSection, counter]);

  useEffect(() => {
    let elements: Array<SVGRectElement | SVGPathElement> = [];
    if (containerRef.current) {
      const rects = Array.from(
        containerRef.current.getElementsByTagName("rect")
      );
      const paths = Array.from(
        containerRef.current.getElementsByTagName("path")
      );

      elements = [...rects, ...paths];
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.fill = ``;
        elements[i].style.opacity = `0`;
        elements[i].style.stroke = `black`;
        elements[i].addEventListener("mouseleave", handleMouseLeave);

        //@ts-ignore
        elements[i].addEventListener("mouseenter", handleMouseEnter);
        elements[i].addEventListener("click", handleClickLister);
      }
    }
    return () => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].removeEventListener("mouseleave", handleMouseLeave);
        //@ts-ignore
        elements[i].removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, []);

  const highlightAllSelectedSections = () => {
    if (containerRef.current) {
      for (let i = 0; i < ids.length; i++) {
        highlightSection(ids[i].id as string, highlightcolor, "0.5");
      }
    }
  };
  const highlightSection = (id: string, color: string, opacity: string) => {
    if (containerRef.current) {
      const rect = containerRef.current.getElementById(id) as SVGAElement;
      if (!rect) return;
      rect.style.fill = color;
      rect.style.opacity = opacity;
    }
  };

  const handleClickLister = (e: Event) => {
    const target = e.currentTarget as SVGElement;
    const label = target.getAttribute("data-label"); // Retrieve custom attribute
    const id = target.id;
    //@ts-ignore
    setAnchorEl(e?.currentTarget);
    setSelectedSection({ id, label });
    // setIds(ids => [...ids, { id, label }]);
  };

  const handleClose = () => {
    setAnchorEl(null);
    highlightSection(selectedSection.id as string, "", "0");
    setSelectedSection({ id: null, label: null });
    highlightAllSelectedSections();
  };

  const handleFormSubmit = (values: any) => {
    setIds((ids) => [...ids, { ...selectedSection, ...values }]);
    handleClose();
  };

  const section = ids.find((id) => id.id == selectedSection.id);

  return {
    handleClose,
    handleFormSubmit,
    containerRef,
    selectedSection,
    setSelectedSection,
    section,
    anchorEl,
    setAnchorEl,
    highlightSection,
    highlightAllSelectedSections,
    setIds,
  };
};
