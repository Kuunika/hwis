"use client";
import { useState } from "react";

import { createContext, FC, ReactNode } from "react";



type IFlow = { [key: string]: any }
export type TriageContextType = {
  show: boolean;
  setShow: (value: any) => void;
  flow: IFlow,
  addKeyToFlow: (value: any) => void
};

export const TriageContext = createContext<TriageContextType | null>(null);

export const TriageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [show, setShow] = useState<boolean>(false);
  const [flow, setFlow] = useState<IFlow>({} as IFlow);

  const addKeyToFlow = (value: any) => {
    setFlow(flow => ({ ...flow, ...value }));
  }

  return (
    <TriageContext.Provider value={{ show, setShow, flow, addKeyToFlow }}>
      {children}
    </TriageContext.Provider>
  );
};
