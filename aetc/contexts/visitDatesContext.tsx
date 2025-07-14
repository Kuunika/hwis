"use client";
import { concepts } from "@/constants";
import React, { createContext, useContext, useState } from "react";

// Define the shape of the context data
interface VisitDatesContextType {
  visitDate: any;
  setVisitDates: (visitDate: any) => void;
  selectedVisit: { id: number; uuid: string };
  setSelectedVisit: (input: any) => void;
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
  const [selectedVisit, setSelectedVisit] = useState<{
    id: number;
    uuid: string;
  }>({ id: 0, uuid: "" });

  return (
    <VisitDatesContext.Provider
      value={{ visitDate, setVisitDates, selectedVisit, setSelectedVisit }}
    >
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
