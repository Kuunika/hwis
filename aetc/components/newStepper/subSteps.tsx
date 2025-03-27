"use client";

import { ReactNode, use } from "react";

interface SubStepProps {
  parent: number; 
  children: ReactNode | ReactNode[];
}

export function SubSteps({ parent, children }: SubStepProps) {
  return <>{children}</>; 
}

