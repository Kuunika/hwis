import { conceptNames, concepts, encounters } from "@/constants";
import { getActivePatientDetails } from "@/hooks";
import {
  fetchConceptAndCreateEncounter,
  getPatientsEncounters,
} from "@/hooks/encounter";
import {
  Button,
  Card,
  CardContent,
  Paper,
  Typography,
  Fade,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { getDateTime } from "@/helpers/dateTime";
import { Encounter } from "@/interfaces";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { DrugDispensedList, formatDispensed } from "./drugDispensedList";
import { PrescribedMedicationList } from "./prescribedMedicationList";

export const PrescribedMedication = () => {
  const { patientId, activeVisitId, activeVisit } = getActivePatientDetails();
  const { data, isPending, isRefetching, refetch } = getPatientsEncounters(
    patientId as string
  );
  const {
    mutate,
    isPending: isSubmitting,
    isSuccess,
  } = fetchConceptAndCreateEncounter();

  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [formData, setFormData] = useState({ route: "", dose: "" });
  const [formError, setFormError] = useState<{ route?: string; dose?: string }>(
    {}
  );

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  const dispensationEncounter = data?.find(
    (encounter) =>
      encounter?.encounter_type?.uuid === encounters.DISPENSING &&
      encounter.visit_id === Number(activeVisitId)
  );

  const medicationDispensed = formatDispensed(
    dispensationEncounter ?? ({} as Encounter),
    selectedMedication?.medicationUUID
  );

  const totalDispensed =
    medicationDispensed?.reduce(
      (total, entry) => total + Number(entry.dose),
      0
    ) || 0;

  const handleInputChange = useCallback(
    (field: "dose" | "route", value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (field === "dose" && selectedMedication) {
        setFormError((prev) => ({
          ...prev,
          dose:
            totalDispensed + Number(value) > selectedMedication.dose
              ? "Cannot dispense more than prescribed"
              : undefined,
        }));
      } else {
        setFormError((prev) => ({
          ...prev,
          [field]: value ? undefined : "Field is required",
        }));
      }
    },
    [totalDispensed, selectedMedication]
  );

  const handleSubmit = useCallback(() => {
    if (!formData.dose || !formData.route) {
      setFormError({
        dose: !formData.dose ? "Field is required" : undefined,
        route: !formData.route ? "Field is required" : undefined,
      });
      return;
    }

    const payload = {
      encounterType: encounters.DISPENSING,
      visit: activeVisit,
      patient: patientId,
      encounterDatetime: getDateTime(),
      obs: [
        {
          concept: concepts.DRUG_GIVEN,
          value: selectedMedication.medicationUUID,
          obsDatetime: getDateTime(),
          coded: true,
          groupMembers: [
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
    };

    mutate(payload);
    setFormData({ dose: "", route: "" });
  }, [formData, mutate, activeVisit, patientId, selectedMedication]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Prescribed Medication
      </Typography>
      <PrescribedMedicationList setRow={setSelectedMedication} />

      <Fade in={!!selectedMedication} timeout={500}>
        <div>
          {selectedMedication && (
            <Card sx={{ mt: 2, p: 3, borderRadius: 2, boxShadow: 4 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {selectedMedication?.medicationName}
              </Typography>
              <ContainerLoaderOverlay
                loading={isSubmitting || isPending || isRefetching}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <TextField
                        name="dose"
                        label="Dose"
                        type="number"
                        required
                        fullWidth
                        variant="outlined"
                        value={formData.dose}
                        onChange={(e) =>
                          handleInputChange("dose", e.target.value)
                        }
                        error={!!formError.dose}
                        helperText={formError.dose}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="route"
                        label="Route"
                        required
                        fullWidth
                        variant="outlined"
                        value={formData.route}
                        onChange={(e) =>
                          handleInputChange("route", e.target.value)
                        }
                        error={!!formError.route}
                        helperText={formError.route}
                      />
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="center" mt={2} mb={2}>
                    <Button
                      disabled={!!formError.dose || !!formError.route}
                      onClick={handleSubmit}
                      variant="contained"
                      sx={{
                        borderRadius: 5,
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontSize: 16,
                      }}
                    >
                      Administer Drug
                    </Button>
                  </Box>

                  <DrugDispensedList
                    data={dispensationEncounter ?? ({} as Encounter)}
                    givenMedication={selectedMedication.medicationUUID}
                  />
                </CardContent>
              </ContainerLoaderOverlay>
              <Box display="flex" justifyContent="center" mt={1}>
                <Button
                  variant="text"
                  onClick={() => setSelectedMedication(null)}
                  color="primary"
                >
                  Close
                </Button>
              </Box>
            </Card>
          )}
        </div>
      </Fade>
    </Paper>
  );
};
