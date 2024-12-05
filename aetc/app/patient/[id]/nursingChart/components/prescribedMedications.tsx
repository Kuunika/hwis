import { conceptNames, concepts, encounters } from "@/constants";
import { getActivePatientDetails } from "@/hooks";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import MedicationTable from "./minimalTable";
import MinimalTable from "./minimalTable";
import {
  Button,
  Card,
  CardContent,
  Paper,
  Typography,
  Fade,
  Box,
} from "@mui/material";
import { useState } from "react";
import { FormikInit, TextInputField } from "@/components";
import * as Yup from "yup";
import { getDateTime } from "@/helpers/dateTime";

const schema = Yup.object().shape({
  [concepts.MEDICATION_ROUTE]: Yup.string().label("Route"),
  [concepts.MEDICATION_DOSE]: Yup.string().label("Dose"),
});

export const PrescribedMedication = () => {
  const { patientId, activeVisitId, activeVisit } = getActivePatientDetails();
  const { data } = getPatientsEncounters(patientId as string);
  const [row, setRow] = useState<any>(null);
  const [formData, setFormData] = useState({ route: "", dose: "" });
  const { mutate, isPending, isSuccess } = addEncounter();

  const prescriptionEncounter = data?.filter((d) => {
    return (
      d.encounter_type.uuid == encounters.PRESCRIPTIONS &&
      d.visit_id == activeVisitId
    );
  });

  if (!prescriptionEncounter || prescriptionEncounter.length == 0) return;

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

  const handleDispenseSubmission = () => {
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
  };
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

        {/* Apply smooth transition to the card */}
        <Fade in={!!row} timeout={500}>
          <div>
            {row && (
              <Card sx={{ marginTop: 2, padding: 2 }}>
                <Typography variant="h6">{row?.medicationName}</Typography>
                <CardContent>
                  <FormikInit
                    onSubmit={handleDispenseSubmission}
                    validationSchema={schema}
                    initialValues={{
                      [concepts.MEDICATION_ROUTE]: "",
                      [concepts.MEDICATION_DOSE]: "",
                    }}
                    submitButton={false}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <TextInputField
                        name={concepts.MEDICATION_DOSE}
                        id="dose"
                        label="Dose"
                        getValue={(value) => {
                          setFormData((current) => ({
                            ...current,
                            dose: value,
                          }));
                        }}
                      />
                      <TextInputField
                        name={concepts.MEDICATION_ROUTE}
                        getValue={(value) => {
                          setFormData((current) => ({
                            ...current,
                            route: value,
                          }));
                        }}
                        id="role"
                        label="Role"
                      />
                    </Box>
                    <Button
                      onClick={handleDispenseSubmission}
                      sx={{ borderRadius: "4px" }}
                      variant="contained"
                    >
                      Administer drug
                    </Button>
                  </FormikInit>
                </CardContent>
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
