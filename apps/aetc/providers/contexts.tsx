import { AuthProvider, SearchRegistrationProvider, TriageProvider } from "@/contexts";
import { ReactNode } from "react";

export const ContextProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <TriageProvider>
        <SearchRegistrationProvider>{children}</SearchRegistrationProvider>
      </TriageProvider>
    </AuthProvider>
  );
};
