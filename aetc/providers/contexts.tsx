import {
  AuthProvider,
  ConsultationProvider,
  PatientProfileProvider,
  SearchRegistrationProvider,
  TriageProvider,
} from "@/contexts";
import { KeyValueProvider } from "@/contexts/keyValueContext";
import { LocationProvider } from "@/contexts/location";
import { ServerTimeProvider } from "@/contexts/serverTimeContext";
import { VisitDatesProvider } from "@/contexts/visitDatesContext";
import { ReactNode } from "react";

export const ContextProviders = ({ children }: { children: ReactNode }) => {
  return (
    <VisitDatesProvider>
      <AuthProvider>
        <TriageProvider>
          <KeyValueProvider>
            <PatientProfileProvider>
              <LocationProvider>
                <ConsultationProvider>
                  <SearchRegistrationProvider>
                    <ServerTimeProvider>{children}</ServerTimeProvider>
                  </SearchRegistrationProvider>
                </ConsultationProvider>
              </LocationProvider>
            </PatientProfileProvider>
          </KeyValueProvider>
        </TriageProvider>
      </AuthProvider>
    </VisitDatesProvider>
  );
};
