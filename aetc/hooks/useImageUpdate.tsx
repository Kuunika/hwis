import { getDateTime } from "@/helpers/dateTime";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { getActivePatientDetails, useImageFormTransform } from ".";
import { concepts } from "@/constants";

export const useImageUpdate = () => {
  const { submittedValues, setData, setSubmittedValues } =
    useImageFormTransform();
  const { activeVisit, patientId } = getActivePatientDetails();
  const containerRef = useRef<SVGSVGElement>(null);
  const [ids, setIds] = useState<
    Array<{
      id: string | null;
      label: string | null;
      notes?: any;
      description?: any;
      other?: any;
    }>
  >([]);
  const [counter, setCounter] = useState(0);
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
    target.style.opacity = `0.5`;
    target.style.fill = highlightcolor;

    target.style.cursor = "pointer";
  };
  const handleMouseLeave = (e: MouseEvent | Event) => {
    const target = e.currentTarget as SVGElement;
    target.style.opacity = ``;
    target.style.fill = "";
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
      const gElement = containerRef.current.querySelector("#BODY_PART");

      if (!gElement) return;

      elements = Array.from(gElement.querySelectorAll("path"));

      elements.forEach((el) => {
        el.style.fill = "";
        el.style.opacity = "";
        el.style.stroke = "";

        el.addEventListener("mouseleave", handleMouseLeave);
        //@ts-ignore
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("click", handleClickLister);
      });
    }

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mouseleave", handleMouseLeave);
        //@ts-ignore
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("click", handleClickLister);
      });
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

  const handleFormSubmit = (formData: any) => {
    const dateTime = getDateTime();
    const obs = Object.keys(formData)
      .flatMap((key) => {
        const conceptData = formData[key];

        return Array.isArray(conceptData)
          ? conceptData.map((p: any) => {
              return {
                concept: key,
                value: p.id,
                obsDatetime: dateTime,
              };
            })
          : {
              concept: key,
              value: conceptData,
              obsDatetime: dateTime,
            };
      })
      .filter((concept) => concept.value != "");

    formData = {
      encounterDateTime: dateTime,
      visit: activeVisit,
      patient: patientId,
      encounterType: selectedSection.id,
      obs: [
        ...obs,
        {
          concept: concepts.IMAGE_PART_NAME,
          value: selectedSection.label,
          obsDatetime: dateTime,
        },
      ],
    };
    setIds((ids) => [...ids, { ...selectedSection, formData }]);
    handleClose();
  };

  const section = ids.find((id) => id.id == selectedSection.id);

  const deselectSection = () => {
    let clonedIds = [...ids];
    clonedIds = clonedIds.filter((clone) => clone.id != selectedSection.id);
    setIds(clonedIds);
    handleClose();
  };

  const deleteSection = (id: any) => {
    let clonedIds = [...ids];
    clonedIds = clonedIds.filter((clone) => clone.label != id);
    setIds(clonedIds);

    setSubmittedValues((values) => {
      return values.filter((v) => v.section != id);
    });
    highlightAllSelectedSections();
  };

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
    ids,
    deselectSection,
    deleteSection,
    setData,
    submittedValues,
  };
};
