import { AuthProvider, PatientProfileProvider, SearchRegistrationProvider, TriageProvider } from "@/contexts";
import { ReactNode } from "react";

export const ContextProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <TriageProvider>
        <PatientProfileProvider>
          <SearchRegistrationProvider>{children}</SearchRegistrationProvider>
        </PatientProfileProvider>
      </TriageProvider>
    </AuthProvider>
  );
};
