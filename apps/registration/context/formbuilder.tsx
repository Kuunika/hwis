"use client";
import { createContext, FC, ReactNode, useState, useEffect } from "react";
import { produce } from "immer";

export type Rule = {
  id: string;
  formElementId: string;
  operator: string;
  value: string;
  routeTo: string;
};

export type Validation = {
  rule: string;
  value: string;
};

export type FormDataElement = {
  label: string;
  type: string;
  dataElement: string;
  rules: Array<Rule>;
  id: string;
  validations: Array<any>;
  isVisible: string;
  optionSetId?: string;
  options?: Array<{ label: string; value: string }>;
};

export type Frag = {
  fragmentName: string;
  formDataElements: FormDataElement[];
};

export type FormBuilderContextType = {
  fragment: Frag;
  setFragment: (frag: Frag) => void;
  applyRules: (id: string, value: any) => void;
};

export const FormBuilderContext = createContext<FormBuilderContextType | null>(
  null
);

export const FormBuilderProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fragment, setFragment] = useState<Frag>({} as Frag);

  const applyRules = (id: string, value: string) => {
    const formDataElement = fragment.formDataElements.find(
      (fd) => fd.id === id
    );

    if (!formDataElement) return;

    if (formDataElement.rules.length == 0) return;

    formDataElement.rules.forEach((rule) => {
      if (rule?.operator == "=") {
        if (rule.value == value) {
          return setFormDataElementVisible(rule.routeTo, "1");
        } else {
          return setFormDataElementVisible(rule.routeTo, "0");
        }
      }
    });
  };

  useEffect(() => {
    console.log({ fragment });
  }, [fragment]);

  const setFormDataElementVisible = (dataElement: string, value: "0" | "1") => {
    setFragment(
      produce((draft) => {
        const index = draft.formDataElements.findIndex(
          (fd) => fd.dataElement == dataElement
        );

        draft.formDataElements[index].isVisible = value;
      })
    );
  };

  const initFragment = (frag: Frag) => {
    setFragment(frag);
  };

  return (
    <FormBuilderContext.Provider
      value={{
        fragment,
        setFragment: initFragment,
        applyRules,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};
