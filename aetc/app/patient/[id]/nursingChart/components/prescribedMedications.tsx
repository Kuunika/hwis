import { conceptNames, concepts, encounters } from "@/constants";
import { getActivePatientDetails } from "@/hooks";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import MinimalTable from "./minimalTable";
import {
  Button,
  Card,
  CardContent,
  Paper,
  Typography,
  Fade,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { Encounter } from "@/interfaces";

const formatDispensed = (data: Encounter, givenMedication: string) => {
  return data.obs
    .filter((ob) => ob.value_coded_uuid == givenMedication)
    .map((ob) => {
      return {
        route: ob.children.find(
          (b) => b.names[0].name == conceptNames.MEDICATION_ROUTE
        )?.value,
        dose: ob.children.find(
          (b) => b.names[0].name == conceptNames.PRESCRIBED_DOSE
        )?.value,
        createdBy: ob.created_by,
        createdTime: getHumanReadableDateTime(ob.obs_datetime),
      };
    });
};

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

  const prescriptionEncounter = data?.filter((d) => {
    return (
      d.encounter_type.uuid == encounters.PRESCRIPTIONS &&
      d.visit_id == activeVisitId
    );
  });

  if (!prescriptionEncounter || prescriptionEncounter.length == 0) return;

  //   useEffect(() => {
  //     if (isSuccess) {
  //       refetch();
  //     }
  //   }, [isSuccess]);

  const med = prescriptionEncounter[0].obs
    .filter((ob) => ob.names[0].name == conceptNames.DRUG_GIVEN)
    .map((ob) => {
      const durationUnit = ob.children.find(
        (b) => b.names[0].name == conceptNames.MEDICATION_DURATION_UNIT
      )?.value;
      return {
        medicationName: ob.value,
        medicationUUID: ob.value_coded_uuid,
        dose: ob.children.find(
          (b) => b.names[0].name == conceptNames.PRESCRIBED_DOSE
        )?.value,
        doseUnits: ob.children.find(
          (b) => b.names[0].name == conceptNames.MEDICATION_DOSE_UNIT
        )?.value,
        frequency: ob.children.find(
          (b) => b.names[0].name == conceptNames.MEDICATION_FREQUENCY
        )?.value,
        duration: `${
          ob.children.find(
            (b) => b.names[0].name == conceptNames.MEDICATION_DURATION
          )?.value
        } ${durationUnit}`,

        formulation: ob.children.find(
          (b) => b.names[0].name == conceptNames.MEDICATION_FORMULATION
        )?.value,
        description: ob.children.find(
          (b) => b.names[0].name == conceptNames.DESCRIPTION
        )?.value,

        action: <Button>Order drug</Button>,
      };
    });

  const dispensationEncounter = data?.filter((d) => {
    return (
      d.encounter_type.uuid == encounters.DISPENSING &&
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
    }

    setFormError({
      route: { state: Boolean(formData.route), message: "can't be blank" },
      dose: { state: Boolean(formData.dose), message: "can't be blank" },
    });
  };

  const medicationDispensed = formatDispensed(
    (dispensationEncounter && dispensationEncounter[0]) ?? ({} as Encounter),
    row?.medicationUUID
  );

  const totalDispensed = medicationDispensed.reduce((previous, current) => {
    return previous + Number(current.dose);
  }, 0);

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" component="h2" gutterBottom>
          Prescribed Medication
        </Typography>
        <MinimalTable
          getSelectedRow={setRow}
          columns={[
            { label: "Medication Name", field: "medicationName" },
            { label: "Dose", field: "dose" },
            { label: "Frequency", field: "frequency" },
            { label: "Duration", field: "duration" },
            { label: "Formulation", field: "formulation" },
          ]}
          data={med}
        />

        <Fade in={!!row} timeout={500}>
          <div>
            {row && (
              <Card sx={{ marginTop: 2, padding: 2 }}>
                <Typography variant="h6">{row?.medicationName}</Typography>
                <LoaderOverlay
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
                        onBlur={(value) => {
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
                </LoaderOverlay>
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

const DrugDispensedList = ({
  data,
  givenMedication,
}: {
  data: Encounter;
  givenMedication: string;
}) => {
  const rows = formatDispensed(data, givenMedication);
  return (
    <MinimalTable
      columns={[
        { label: "Dose", field: "dose" },
        { label: "Route", field: "route" },
        { label: "Dispensed Time", field: "createdTime" },
        { label: "Dispenser", field: "createdBy" },
      ]}
      data={rows}
    />
  );
};

interface LoaderOverlayProps {
  loading: boolean;
  children: ReactNode;
}

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ loading, children }) => {
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent overlay
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          opacity: loading ? 0.5 : 1, // Dim the content when loading
          pointerEvents: loading ? "none" : "auto", // Prevent interaction while loading
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
