"use client";
import { useState } from "react";

import { createContext, FC, ReactNode } from "react";

export type ConsultationContextType = {
  activeStep: number;
  setActiveStep: (step: number) => void;
};

export const ConsultationContext =
  createContext<ConsultationContextType | null>(null);

export const ConsultationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <ConsultationContext.Provider value={{ activeStep, setActiveStep }}>
      {children}
    </ConsultationContext.Provider>
  );
};
