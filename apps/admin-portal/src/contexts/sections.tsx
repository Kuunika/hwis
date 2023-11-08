"use client";
import { useParameters } from "@/helpers";
import { useForm, useOptionSet } from "@/hooks";
import { OptionSet } from "@/services";
import { createContext, FC, ReactNode, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export type Rule = {
  id?: string;
  formElementId: string;
  operator: string;
  value: string;
  dataElementId: string;
};

export type ValidationRule = { rule: string; value: string | boolean };
export type FormDataElement = {
  id: string;
  formFragmentId: string;
  type: string;
  dataElement: string;
  validations: Array<ValidationRule>;
  isVisible: string;
  dataType: string;
  order: string;
  label: string;
  rules: Array<Rule>;
  optionSetId?: string;
  optionSet: OptionSet;
};

export type Section = {
  id?: string;
  fragmentName: string;
  dataElements?: Array<{ id: string; label: string }>;
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
    formDataElementId: string,
    index: number,
    index2: number
  ) => void;

  getActiveSection: () => Section | undefined;
  formDataElements: FormDataElement[];
  resetContext: () => void;
};

export const SectionContext = createContext<SectionContextType | null>(null);

export const SectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { params } = useParameters();
  const { data: forms } = useForm().getForms();

  const [formName, setFormName] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const { data: options } = useOptionSet().getOptionSets();
  const [formDataElements, setFormDataElements] = useState<FormDataElement[]>(
    []
  );

  useEffect(() => {
    // when its an edit route
    if (params.id) {
      const form = forms?.find((f) => f.id == params.id);
      const fDataElements = form?.formDataElements;
      setFormDataElements(fDataElements || []);
      setFormName(form?.fragmentName || "");
    }
  }, [forms, params]);

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
    formDataElementId: string,
    index: number,
    index2: number
  ) => {
    setFormDataElements((draft) => {
      const copiedFormDataElements = [...draft];

      const fdOne = copiedFormDataElements[index];
      const fdTwo = copiedFormDataElements[index2];

      copiedFormDataElements[index] = fdTwo;
      copiedFormDataElements[index2] = fdOne;

      return copiedFormDataElements;
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
    setFormDataElements((draft) => {
      const copiedFormDataElements = [...draft];
      copiedFormDataElements.push({
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
      return copiedFormDataElements;
    });
  };

  const addRule = (formElementId: string, rule: Rule) => {
    setFormDataElements((draft) => {
      const copiedFormDataElements = [...draft];
      const formDataIndex = copiedFormDataElements.findIndex(
        (fd) => fd.id == formElementId
      );
      copiedFormDataElements[formDataIndex].rules.push({
        ...rule,
        id: uuidv4(),
      });
      return copiedFormDataElements;
    });
  };

  const updateValidation = (
    formElementId: string,
    validationRule: ValidationRule
  ) => {
    setFormDataElements((draft) => {
      const copiedFormDataElements = [...draft];

      const formDataIndex = copiedFormDataElements.findIndex(
        (fd) => fd.id == formElementId
      );

      const formDataElement = copiedFormDataElements[formDataIndex];

      const validations = formDataElement.validations;

      const vIndex = validations.findIndex(
        (v) => v.rule === validationRule.rule
      );
      validations[vIndex] = validationRule;
      formDataElement.validations = validations;
      copiedFormDataElements[formDataIndex] = formDataElement;

      return copiedFormDataElements;
    });
  };

  const getValidations = (formDataElementId: string, validation: string) => {
    const formIndex = formDataElements.findIndex(
      (fd) => fd.id == formDataElementId
    );

    const validationRule = formDataElements[formIndex]?.validations?.find(
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
    setFormDataElements((draft) => {
      const copiedFormDataElements = [...draft];

      const formDataIndex = copiedFormDataElements?.findIndex(
        (fd) => fd.id == formDataElementId
      );

      copiedFormDataElements[formDataIndex][prop] = value;

      if (prop === "optionSetId") {
        const optSet = options?.find((opt) => opt.id === value);

        if (optSet) copiedFormDataElements[formDataIndex]["optionSet"] = optSet;
      }

      return copiedFormDataElements;
    });
  };

  const getActiveSection = () => sections.find((s) => s.active);

  const resetContext = () => {
    setFormDataElements([]);
  };

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
        formDataElements,
        resetContext,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
