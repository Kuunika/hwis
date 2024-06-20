import { AuthProvider, PatientProfileProvider, SearchRegistrationProvider, TriageProvider } from "@/contexts";
import { LocationProvider } from "@/contexts/location";
import { ReactNode } from "react";

export const ContextProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <TriageProvider>
        <PatientProfileProvider>
          <LocationProvider>
            <SearchRegistrationProvider>{children}</SearchRegistrationProvider>
          </LocationProvider>
        </PatientProfileProvider>
      </TriageProvider>
    </AuthProvider>
  );
};
