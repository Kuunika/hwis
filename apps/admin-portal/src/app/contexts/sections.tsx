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

export type FormDataElement = {
  id: string;
  formFragmentId: string;
  type: string;
  validations: any;
  dataType: string;
  order: string;
  label: string;
  rules: [];
};

export type Section = {
  id: string;
  fragmentName: string;
  dataElements: Array<{ id: string; label: string }>;
  active?: boolean;
  formDataElements?: FormDataElement[];
};

export type SectionContextType = {
  sections: Section[];
  addSection: (section: Section) => void;
  deleteSection: (id: string) => void;
  setActiveSection: (id: string) => void;
  section: Section;
  addElement: (value: FormDataElement) => void;
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
    copiedSections[index].formDataElements?.push(dataElement);
    setSections(copiedSections);
    setSection(copiedSections[index]);

    console.log({ sections });
  };

  return (
    <SectionContext.Provider
      value={{
        sections,
        addSection,
        deleteSection,
        setActiveSection,
        section,
        addElement,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
