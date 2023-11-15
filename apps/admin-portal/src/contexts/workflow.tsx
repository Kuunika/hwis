"use client";
import { useState } from "react";
import { WorkFlow } from "@/services/workflow";
import { createContext, FC, ReactNode } from "react";
import { useForm } from "@/hooks";

export type WorkFlowContextType = {
  workflow: WorkFlow;
  addWorkFlow: (data: any) => void;
};

export const WorkFlowContext = createContext<WorkFlowContextType | null>(null);

export const WorkFlowProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [workflow, setWorkFlow] = useState<WorkFlow>({} as WorkFlow);
  const { data: forms } = useForm().getForms();

  const addWorkFlow = (data: any) => {
    console.log({ data });
    const workFlowForms = data.forms.map((f: any) =>
      forms?.find((form) => form.id == f.id)
    );
    setWorkFlow({ id: "", name: data.flowName, forms: workFlowForms });
  };

  return (
    <WorkFlowContext.Provider value={{ workflow, addWorkFlow }}>
      {children}
    </WorkFlowContext.Provider>
  );
};
