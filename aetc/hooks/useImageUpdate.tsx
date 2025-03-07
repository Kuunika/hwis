import { getDateTime } from "@/helpers/dateTime";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { getActivePatientDetails, useImageFormTransform } from ".";
import { concepts } from "@/constants";

interface Section {
  id: string | null;
  label: string | null;
  notes?: any;
  description?: any;
  other?: any;
  formData?: any;
}

export const useImageUpdate = () => {
  const { submittedValues, setData, setSubmittedValues } =
    useImageFormTransform();
  const { activeVisit, patientId } = getActivePatientDetails();
  const containerRef = useRef<SVGSVGElement>(null);
  const [ids, setIds] = useState<Section[]>([]);
  const [counter, setCounter] = useState(0);
  const [anchorEl, setAnchorEl] = useState<SVGElement | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section>({
    id: "",
    label: "",
  });
  const [anchorElDisplay, setAnchorElDisplay] = useState<SVGElement | null>(
    null
  );
  const [hoverId, setHoverId] = useState("");

  const highlightColor = "#708090";

  const handleMouseEnter = (e: Event) => {
    const target = e.currentTarget as SVGElement;
    setHoverId(target.id);
    setAnchorElDisplay(target);
    target.style.opacity = "0.5";
    target.style.fill = highlightColor;
    target.style.cursor = "pointer";
  };

  const handleMouseLeave = (e: Event) => {
    const target = e.currentTarget as SVGElement;
    target.style.opacity = "";
    target.style.fill = "";
    setCounter((prevCounter) => prevCounter + 1);
  };

  const handleClickLister = (e: Event) => {
    const target = e.currentTarget as SVGElement;
    const label = target.getAttribute("data-label");
    const id = target.id;
    setAnchorEl(target);
    setSelectedSection({ id, label });
  };

  const highlightSection = (id: string, color: string, opacity: string) => {
    if (containerRef.current) {
      const rect = containerRef.current.getElementById(id) as SVGAElement;
      if (rect) {
        rect.style.fill = color;
        rect.style.opacity = opacity;
      }
    }
  };

  const highlightAllSelectedSections = () => {
    ids.forEach((section) => {
      if (section.id) {
        highlightSection(section.id, highlightColor, "0.5");
      }
    });
  };

  useEffect(() => {
    highlightAllSelectedSections();
  }, [ids, counter]);

  useEffect(() => {
    if (selectedSection.id) {
      highlightSection(selectedSection.id, highlightColor, "0.5");
    }
  }, [selectedSection, counter]);

  useEffect(() => {
    let elements: Array<SVGRectElement | SVGPathElement> = [];

    if (containerRef.current) {
      const gElement = containerRef.current.querySelector("#BODY_PART");

      if (gElement) {
        elements = [
          ...Array.from(gElement.querySelectorAll("path")),
          ...Array.from(gElement.querySelectorAll("polygon")),
        ];

        elements.forEach((el) => {
          el.style.fill = "";
          el.style.opacity = "";
          el.style.stroke = "";

          el.addEventListener("mouseleave", handleMouseLeave);
          el.addEventListener("mouseenter", handleMouseEnter);
          el.addEventListener("click", handleClickLister);
        });
      }
    }

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("click", handleClickLister);
      });
    };
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
    if (selectedSection.id) {
      highlightSection(selectedSection.id, "", "0");
    }
    setSelectedSection({ id: null, label: null });
    highlightAllSelectedSections();
  };

  const handleFormSubmit = (formData: any) => {
    const dateTime = getDateTime();
    const obs = Object.keys(formData)
      .flatMap((key) => {
        const conceptData = formData[key];

        return Array.isArray(conceptData)
          ? conceptData.map((p: any) => ({
              concept: key,
              value: p.id,
              obsDatetime: dateTime,
            }))
          : {
              concept: key,
              value: conceptData,
              obsDatetime: dateTime,
            };
      })
      .filter((concept) => concept.value !== "");

    const newFormData = {
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

    setIds((prevIds) => [
      ...prevIds,
      { ...selectedSection, formData: newFormData },
    ]);
    handleClose();
  };

  const section = ids.find((id) => id.id === selectedSection.id);

  const deselectSection = () => {
    setIds((prevIds) => prevIds.filter((id) => id.id !== selectedSection.id));
    handleClose();
  };

  const deleteSection = (id: string) => {
    setIds((prevIds) => prevIds.filter((section) => section.label !== id));
    setSubmittedValues((prevValues) =>
      prevValues.filter((v) => v.section !== id)
    );
    highlightAllSelectedSections();
  };

  console.log(containerRef);

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
