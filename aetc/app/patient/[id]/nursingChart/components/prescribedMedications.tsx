import { conceptNames, concepts, encounters } from "@/constants";
import { getActivePatientDetails } from "@/hooks";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";

import {
  Button,
  Card,
  CardContent,
  Paper,
  Typography,
  Fade,
  Box,
  TextField,
} from "@mui/material";
import { useState } from "react";

import { getDateTime } from "@/helpers/dateTime";
import { Encounter } from "@/interfaces";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { DrugDispensedList, formatDispensed } from "./drugDispensedList";
import { PrescribedMedicationList } from "./prescribedMedicationList";

export const PrescribedMedication = () => {
  const { patientId, activeVisitId, activeVisit } = getActivePatientDetails();
  const {
    data,
    isPending: fetchingEncounters,
    isRefetching,
    refetch,
  } = getPatientsEncounters(patientId as string);
  const [row, setRow] = useState<any>(null);
  const [formData, setFormData] = useState({ route: "", dose: "" });
  const { mutate, isPending, isSuccess } = addEncounter();
  const [formError, setFormError] = useState<any>({});

  const dispensationEncounter = data?.filter((d) => {
    return (
      d?.encounter_type?.uuid == encounters.DISPENSING &&
      d.visit_id == activeVisitId
    );
  });

  const handleDispenseSubmission = () => {
    setFormError({});

    if (Boolean(formData.dose) && Boolean(formData.route)) {
      mutate({
        encounterType: encounters.DISPENSING,
        visit: activeVisit,
        patient: patientId,
        encounterDatetime: getDateTime(),
        obs: [
          {
            concept: concepts.DRUG_GIVEN,
            value: row.medicationUUID,
            obsDatetime: getDateTime(),
            group_members: [
              {
                concept: concepts.MEDICATION_DOSE,
                value: formData.dose,
                obsDatetime: getDateTime(),
              },
              {
                concept: concepts.MEDICATION_ROUTE,
                value: formData.route,
                obsDatetime: getDateTime(),
              },
            ],
          },
        ],
      });

      setFormData({ dose: "", route: "" });
      return;
    }

    setFormError({
      route: { state: formData.route == "", message: "can't be blank" },
      dose: { state: formData.dose == "", message: "can't be blank" },
    });
  };

  const medicationDispensed = formatDispensed(
    (dispensationEncounter && dispensationEncounter[0]) ?? ({} as Encounter),
    row?.medicationUUID
  );

  const totalDispensed = medicationDispensed?.reduce((previous, current) => {
    return previous + Number(current.dose);
  }, 0);

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" component="h2" gutterBottom>
          Prescribed Medication
        </Typography>
        <PrescribedMedicationList setRow={setRow} />

        <Fade in={!!row} timeout={500}>
          <div>
            {row && (
              <Card sx={{ marginTop: 2, padding: 2 }}>
                <Typography variant="h6">{row?.medicationName}</Typography>
                <ContainerLoaderOverlay
                  loading={isPending || fetchingEncounters || isRefetching}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        gap: 1,
                      }}
                    >
                      <TextField
                        name="dose"
                        label="Dose"
                        type="number"
                        required
                        value={formData.dose}
                        onChange={(value) => {
                          setFormData((data) => {
                            return { ...data, dose: value.target.value };
                          });
                        }}
                        onBlur={(value) => {
                          setFormData((current) => ({
                            ...current,
                            dose: value.target.value,
                          }));
                          if (
                            totalDispensed + Number(value.target.value) >
                            row.dose
                          ) {
                            setFormError((error: any) => {
                              return {
                                ...error,
                                dose: {
                                  message:
                                    "you can't dispense more than what was prescribed",
                                  state: true,
                                },
                              };
                            });
                          } else {
                            setFormError((error: any) => {
                              return {
                                ...error,
                                dose: {
                                  message: "",
                                  state: false,
                                },
                              };
                            });
                          }
                        }}
                        error={formError?.dose?.state}
                        helperText={formError?.dose?.message}
                      />
                      <TextField
                        name="route"
                        label="Route"
                        required
                        value={formData.route}
                        onChange={(value) => {
                          setFormData((data) => {
                            return { ...data, route: value.target.value };
                          });
                        }}
                        onBlur={(value) => {
                          if (value.target.value) {
                            setFormError((error: any) => {
                              return {
                                ...error,
                                route: {
                                  message: "",
                                  state: false,
                                },
                              };
                            });
                          }
                          setFormData((current) => ({
                            ...current,
                            route: value.target.value,
                          }));
                        }}
                        error={formError?.route?.state}
                        helperText={formError?.route?.message}
                      />
                    </Box>

                    <Button
                      disabled={
                        formError?.dose?.state || formError?.route?.state
                      }
                      onClick={handleDispenseSubmission}
                      sx={{ borderRadius: "4px", mt: 1 }}
                      variant="contained"
                    >
                      Administer drug
                    </Button>
                    <br />
                    <br />
                    <DrugDispensedList
                      data={
                        (dispensationEncounter && dispensationEncounter[0]) ??
                        ({} as Encounter)
                      }
                      givenMedication={row.medicationUUID}
                    />
                  </CardContent>
                </ContainerLoaderOverlay>
                <Button
                  variant="text"
                  onClick={() => setRow(null)}
                  color="primary"
                >
                  Close
                </Button>
              </Card>
            )}
          </div>
        </Fade>
      </Paper>
    </>
  );
};
