import { AuthProvider, PatientProfileProvider, SearchRegistrationProvider, TriageProvider } from "@/contexts";
import { KeyValueProvider } from "@/contexts/keyValueContext";
import { LocationProvider } from "@/contexts/location";
import { ReactNode } from "react";

export const ContextProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <TriageProvider>
        <KeyValueProvider>
        <PatientProfileProvider>
          <LocationProvider>
            <SearchRegistrationProvider>{children}</SearchRegistrationProvider>
          </LocationProvider>
        </PatientProfileProvider>
        </KeyValueProvider>
      </TriageProvider>
    </AuthProvider>
  );
};
