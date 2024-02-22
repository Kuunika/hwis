import { SearchRegistrationProvider, TriageProvider } from "@/contexts";
import { ReactNode } from "react";

export const ContextProviders = ({ children }: { children: ReactNode }) => {
  return (
    <TriageProvider>
      <SearchRegistrationProvider>{children}</SearchRegistrationProvider>
    </TriageProvider>
  );
};
