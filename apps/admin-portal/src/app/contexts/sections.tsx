"use client";
import { createContext, FC, ReactNode, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";

export type Rule = {
  id: string;
  formElementId: string;
  operator: string;
  value: string;
  routeTo: string;
};

export type ValidationRule = { rule: string; value: string | boolean };
export type FormDataElement = {
  id: string;
  formFragmentId: string;
  type: string;
  validations: Array<ValidationRule>;
  isVisible: string;
  dataType: string;
  order: string;
  label: string;
  rules: Array<Rule>;
  optionSetId?: string;
};

export type Section = {
  id: string;
  fragmentName: string;
  dataElements: Array<{ id: string; label: string }>;
  active?: boolean;
  formDataElements: FormDataElement[];
  order: number | string;
};

export type SectionContextType = {
  formName: string;
  sections: Section[];
  addSection: (section: Section) => void;
  deleteSection: (id: string) => void;
  setActiveSection: (id: string) => void;
  addElement: (value: FormDataElement) => void;
  addRule: (formElementId: string, rule: Rule) => void;
  updateValidation: (
    formElementId: string,
    validationRule: ValidationRule
  ) => void;
  getValidations: (
    formDataElementId: string,
    validation: string
  ) => string | boolean | number;
  updateProp: (
    formDataElementId: string,
    value: string,
    prop: "isVisible" | "optionSetId"
  ) => void;

  updateSection: (
    sectionId: string,
    prop: "order",
    index: number,
    index2: number
  ) => void;
  addFormName: (formName: string) => void;
  orderFormDataElements: (
    sectionId: string,
    formDataElementId: string,
    index: number,
    index2: number
  ) => void;

  getActiveSection: () => Section | undefined;
};

export const SectionContext = createContext<SectionContextType | null>(null);

export const SectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [formName, setFormName] = useState("");
  const [sections, setSections] = useState<Section[]>([]);

  const addSection = (values: Section) => {
    setSections((sects) => [
      ...sects,
      {
        ...values,
        id: uuidv4(),
        active: false,
        formDataElements: [],
        order: sections.length,
      },
    ]);
  };

  const updateSection = (
    sectionId: string,
    prop: "order",
    index: number,
    index2: number
  ) => {
    setSections((sects) => {
      const draft = [...sects];
      const sectOne = draft[index];
      const sectTwo = draft[index2];
      draft[index] = sectTwo;
      draft[index2] = sectOne;
      return draft;
    });
  };

  const orderFormDataElements = (
    sectionId: string,
    formDataElementId: string,
    index: number,
    index2: number
  ) => {
    setSections((draft) => {
      const sects = [...draft];

      const activeSection = getActiveSection();

      const activeSectionIndex = sects.findIndex(
        (sect) => sect.id == activeSection?.id
      );
      const fdOne = sects[activeSectionIndex].formDataElements[index];
      const fdTwo = sects[activeSectionIndex].formDataElements[index2];

      sects[activeSectionIndex].formDataElements[index] = fdTwo;
      sects[activeSectionIndex].formDataElements[index2] = fdOne;

      return sects;
    });
  };

  const addFormName = (formName: string) => setFormName(formName);

  const deleteSection = (id: string) => {
    setSections((sects) => sects.filter((s) => s.id !== id));
  };

  const setActiveSection = (id: string) => {
    setSections((draft) => {
      const sects = [...draft];
      let index = sects.findIndex((s) => s.active == true);
      if (index >= 0) {
        sects[index].active = false;
      }
      index = sects.findIndex((s) => s.id === id);
      sects[index].active = true;
      return sects;
    });
  };

  const addElement = (dataElement: FormDataElement) => {
    setSections((draft) => {
      const copiedSections = [...draft];
      const section = getActiveSection();
      const index = copiedSections.findIndex((s) => s.id === section?.id);
      copiedSections[index].formDataElements?.push({
        ...dataElement,
        rules: [],
        id: uuidv4(),
        validations: [
          {
            rule: "isRequired",
            value: "1",
          },
        ],
        isVisible: "1",
        optionSetId: "",
      });
      return copiedSections;
    });
  };

  const addRule = (formElementId: string, rule: Rule) => {
    setSections((draft) => {
      const copiedSections = [...draft];
      const section = getActiveSection();
      const index = copiedSections.findIndex((s) => s.id === section?.id);
      const formDataIndex = copiedSections[index].formDataElements?.findIndex(
        (fd) => fd.id == formElementId
      );
      copiedSections[index].formDataElements[formDataIndex].rules.push({
        ...rule,
        id: uuidv4(),
      });
      return copiedSections;
    });
  };

  const updateValidation = (
    formElementId: string,
    validationRule: ValidationRule
  ) => {
    setSections((draft) => {
      const copiedSections = [...draft];
      const section = getActiveSection();
      const index = copiedSections.findIndex((s) => s.id === section?.id);
      const sect = copiedSections[index];
      const formDataIndex = sect.formDataElements?.findIndex(
        (fd) => fd.id == formElementId
      );

      const formDataElement = sect.formDataElements[formDataIndex];

      const validations = formDataElement.validations;

      const vIndex = validations.findIndex(
        (v) => v.rule === validationRule.rule
      );
      validations[vIndex] = validationRule;
      formDataElement.validations = validations;
      sect.formDataElements[formDataIndex] = formDataElement;
      copiedSections[index] = sect;

      return copiedSections;
    });
  };

  const getValidations = (formDataElementId: string, validation: string) => {
    const section = getActiveSection();

    if (!section) return "";

    const formIndex = section.formDataElements.findIndex(
      (fd) => fd.id == formDataElementId
    );

    const validationRule = section.formDataElements[
      formIndex
    ]?.validations?.find((v) => v.rule == validation);

    if (!validationRule) return "";
    return validationRule?.value;
  };

  const updateProp = (
    formDataElementId: string,
    value: string,
    prop: "isVisible" | "optionSetId"
  ) => {
    setSections((draft) => {
      const copiedSections = [...draft];
      const section = getActiveSection();
      const index = copiedSections.findIndex((s) => s.id == section?.id);
      const sect = copiedSections[index];
      const formDataIndex = sect.formDataElements?.findIndex(
        (fd) => fd.id == formDataElementId
      );

      sect.formDataElements[formDataIndex][prop] = value;
      copiedSections[index] = sect;
      setSections(copiedSections);

      return copiedSections;
    });
  };

  const getActiveSection = () => sections.find((s) => s.active);

  return (
    <SectionContext.Provider
      value={{
        sections,
        getValidations,
        setActiveSection,
        addSection,
        addElement,
        addRule,
        updateValidation,
        updateProp,
        deleteSection,
        formName,
        addFormName,
        updateSection,
        orderFormDataElements,
        getActiveSection,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
