"use client";
import { createContext, FC, ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
};

export type SectionContextType = {
  sections: Section[];
  addSection: (section: Section) => void;
  deleteSection: (id: string) => void;
  setActiveSection: (id: string) => void;
  section: Section;
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
};

export const SectionContext = createContext<SectionContextType | null>(null);

export const SectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [section, setSection] = useState<Section>({} as Section);

  const addSection = (values: Section) => {
    setSections((sects: any) => [
      ...sects,
      {
        ...values,
        id: uuidv4(),
        active: false,
        formDataElements: [],
      },
    ]);
  };

  const deleteSection = (id: string) => {
    setSections((sects) => sects.filter((s) => s.id !== id));
  };

  const setActiveSection = (id: string) => {
    const sects = [...sections];
    let index = sects.findIndex((s) => s.active == true);
    if (index >= 0) {
      sects[index].active = false;
    }
    index = sects.findIndex((s) => s.id === id);
    sects[index].active = true;
    setSection(sects[index]);
    setSections(sects);
  };

  const addElement = (dataElement: FormDataElement) => {
    const copiedSections = [...sections];
    const index = copiedSections.findIndex((s) => s.id === section.id);
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
    setSections(copiedSections);
    setSection(copiedSections[index]);
  };

  const addRule = (formElementId: string, rule: Rule) => {
    const copiedSections = [...sections];
    const index = copiedSections.findIndex((s) => s.id === section.id);
    const formDataIndex = copiedSections[index].formDataElements?.findIndex(
      (fd) => fd.id == formElementId
    );
    copiedSections[index].formDataElements[formDataIndex].rules.push({
      ...rule,
      id: uuidv4(),
    });

    setSections(copiedSections);

    setSection(copiedSections[index]);
  };

  const updateValidation = (
    formElementId: string,
    validationRule: ValidationRule
  ) => {
    const copiedSections = [...sections];

    const index = copiedSections.findIndex((s) => s.id === section.id);
    const sect = copiedSections[index];
    const formDataIndex = sect.formDataElements?.findIndex(
      (fd) => fd.id == formElementId
    );

    const formDataElement = sect.formDataElements[formDataIndex];

    const validations = formDataElement.validations;

    const vIndex = validations.findIndex((v) => v.rule === validationRule.rule);

    validations[vIndex] = validationRule;
    formDataElement.validations = validations;
    sect.formDataElements[formDataIndex] = formDataElement;
    copiedSections[index] = sect;
    setSections(copiedSections);
  };

  const getValidations = (formDataElementId: string, validation: string) => {
    const formIndex = section.formDataElements.findIndex(
      (fd) => fd.id == formDataElementId
    );

    const validationRule = section.formDataElements[formIndex].validations.find(
      (v) => v.rule == validation
    );

    if (!validationRule) return "";
    return validationRule?.value;
  };

  const updateProp = (
    formDataElementId: string,
    value: string,
    prop: "isVisible" | "optionSetId"
  ) => {
    const copiedSections = [...sections];

    const index = copiedSections.findIndex((s) => s.id === section.id);
    const sect = copiedSections[index];
    const formDataIndex = sect.formDataElements?.findIndex(
      (fd) => fd.id == formDataElementId
    );

    sect.formDataElements[formDataIndex][prop] = value;

    console.log(sect.formDataElements[formDataIndex]);

    copiedSections[index] = sect;
    setSections(copiedSections);
  };

  return (
    <SectionContext.Provider
      value={{
        sections,
        section,
        getValidations,
        setActiveSection,
        addSection,
        addElement,
        addRule,
        updateValidation,
        updateProp,
        deleteSection,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
