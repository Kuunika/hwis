"use client";
import { useState } from "react";

import { createContext, FC, ReactNode } from "react";

export type TriageContextType = {
  show: boolean;
  setShow: (value: any) => void;
};

export const TriageContext = createContext<TriageContextType | null>(null);

export const TriageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <TriageContext.Provider value={{ show, setShow }}>
      {children}
    </TriageContext.Provider>
  );
};
