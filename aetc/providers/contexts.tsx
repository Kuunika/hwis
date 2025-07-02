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
import { ActivePatientProvider } from "@/contexts/activePatientContext";

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
                      <PrinterProvider>
                        <ActivePatientProvider>
                          {children}
                        </ActivePatientProvider>
                      </PrinterProvider>
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
