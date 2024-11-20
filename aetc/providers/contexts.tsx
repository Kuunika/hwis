import {
  AuthProvider,
  ConsultationProvider,
  PatientProfileProvider,
  SearchRegistrationProvider,
  TriageProvider,
} from "@/contexts";
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
              <ConsultationProvider>
                <SearchRegistrationProvider>
                  {children}
                </SearchRegistrationProvider>
              </ConsultationProvider>
            </LocationProvider>
          </PatientProfileProvider>
        </KeyValueProvider>
      </TriageProvider>
    </AuthProvider>
  );
};
