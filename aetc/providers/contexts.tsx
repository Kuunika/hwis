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
import { PrinterProvider } from "@/contexts/printer";
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
                    <ServerTimeProvider>
                      <PrinterProvider>{children}</PrinterProvider>
                    </ServerTimeProvider>
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
