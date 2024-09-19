"use client";
import { useState } from "react";

import { createContext, FC, ReactNode } from "react";



type IFlow = { [key: string]: any }
export type KeyValueContextType = {
  show: boolean;
  setShow: (value: any) => void;
  flow: IFlow,
  addKeyToFlow: (value: any) => void
};

export const KeyValueContext = createContext<KeyValueContextType | null>(null);

export const KeyValueProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [show, setShow] = useState<boolean>(false);
  const [flow, setFlow] = useState<IFlow>({} as IFlow);

  const addKeyToFlow = (value: any) => {
    setFlow(flow => ({ ...flow, ...value }));
  }

  return (
    <KeyValueContext.Provider value={{ show, setShow, flow, addKeyToFlow }}>
      {children}
    </KeyValueContext.Provider>
  );
};
