"use client";
import { createContext, FC, ReactNode, useState, useEffect } from "react";
import { produce } from "immer";
import { FormDataElement, Rule } from ".";

export type Validation = {
  rule: string;
  value: string;
};

export type Frag = {
  fragmentName: string;
  formDataElements: FormDataElement[];
};

export type FormBuilderContextType = {
  fragment: Frag;
  setFragment: (frag: Frag) => void;

  formValues: any;
  setFormValues: (values: any) => void;
};

export const FormBuilderContext = createContext<FormBuilderContextType | null>(
  null
);

export const FormBuilderProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fragment, setFragment] = useState<Frag>({} as Frag);
  const [formValues, setFormValues] = useState<any>();

  useEffect(() => {
    fragment.formDataElements?.forEach((fd) => {
      let show = true;
      fd.rules.forEach((rule) => {
        show = show && Boolean(checkRule(rule));
      });
      const visible = show ? "1" : "0";
      setFormDataElementVisible(fd.dataElement, visible);
    });
  }, [formValues]);

  const checkRule = (rule: Rule) => {
    const value = formValues[rule.dataElementId];

    // console.log({ ruleValue: rule.value });
    // console.log({ actualValue: value });

    if (rule.operator == "=") {
      return rule.value == value ? true : false;
    }
    if (rule.operator == ">") {
      return Number(value) > Number(rule.value) ? true : false;
    }
    if (rule.operator == "<") {
      return Number(value) < Number(rule.value) ? true : false;
    }
    return;
  };

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
        formValues,
        setFormValues,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};
