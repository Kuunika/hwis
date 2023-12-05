import { TriageProvider } from "@/contexts";
import { ReactNode } from "react";

export const ContextProviders = ({ children }: { children: ReactNode }) => {
  return <TriageProvider>{children}</TriageProvider>;
};
