'use client'
import React, { createContext, useContext, useState } from "react";

// Define the shape of the context data
interface VisitDatesContextType {
  visitDate: any;
  setVisitDates: (visitDate: any) => void;
}

// Create the context with default value as undefined
const VisitDatesContext = createContext<VisitDatesContextType | undefined>(
  undefined
);

// Create the provider component
export const VisitDatesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visitDate, setVisitDates] = useState(null);

  return (
    <VisitDatesContext.Provider value={{ visitDate, setVisitDates }}>
      {children}
    </VisitDatesContext.Provider>
  );
};

// Custom hook for using the context
export const useVisitDates = (): VisitDatesContextType => {
  const context = useContext(VisitDatesContext);
  if (!context) {
    throw new Error("useVisitDates must be used within a VisitDatesProvider");
  }
  return context;
};
