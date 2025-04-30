import { GenericDialog } from "@/components";
import { concepts, encounters } from "@/constants";
import { generatePatientSummaryZPL } from "@/helpers/zpl";

import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getPatientLabOrder } from "@/hooks/labOrder";
import { Obs } from "@/interfaces";

import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type Prop = {
  onClose: () => void;
  open: boolean;
};

export const PatientInfoPrintDialog = ({ onClose, open }: Prop) => {
  const { params } = useParameters();
  const [diagnosis, setDiagnosis] = useState<Obs[]>([]);
  const [presentingComplaints, setPresentingComplaints] = useState<Obs[]>([]);
  const [patientLabOrders, setPatientLabOrders] = useState<Array<any>>([]);

  const { data: presentingComplaintsData } = getPatientsEncounters(
    params?.id as string,
    `encounter_type=${encounters.PRESENTING_COMPLAINTS}`
  );

  const { data } = getPatientsEncounters(
    params?.id as string,
    `encounter_type=${encounters.OUTPATIENT_DIAGNOSIS}`
  );

  const { data: ordersData } = getPatientLabOrder(params?.id as string);

  useEffect(() => {
    if (data) {
      const finalDiagnosis = data[0]?.obs?.filter((ob) =>
        ob.names.find((n) => n.name === concepts.FINAL_DIAGNOSIS)
      );
      setDiagnosis(finalDiagnosis);
    }
  }, [data]);

  useEffect(() => {
    if (ordersData) {
      setPatientLabOrders(ordersData);
    }
  }, [ordersData]);

  useEffect(() => {
    if (presentingComplaintsData) {
      setPresentingComplaints(presentingComplaintsData[0].obs);
    }
  }, [presentingComplaintsData]);

  const handleOnPrint = () => {
    const zpl = generatePatientSummaryZPL({
      presentingComplaints,
      diagnosis,
      labOrders: patientLabOrders,
    });

    console.log(zpl);
    onClose();
  };

  return (
    <GenericDialog title="Patient Summary" onClose={() => { }} open={open}>
      <Stack spacing={3}>
        {/* Presenting Complaints */}
        <Box>
          <Typography variant="h6">Presenting Complaints</Typography>
          <Stack spacing={1} mt={1}>
            {presentingComplaints?.map((d, index) => (
              <Typography key={`complaint-${index}`}>{d.value}</Typography>
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Final Diagnosis */}
        <Box>
          <Typography variant="h6">Final Diagnosis</Typography>
          <Stack spacing={1} mt={1}>
            {diagnosis?.map((d, index) => (
              <Typography key={`diagnosis-${index}`}>{d.value}</Typography>
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Lab Investigations */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Lab Investigations
          </Typography>

          <Grid container spacing={2} sx={{ fontWeight: "bold", mb: 1 }}>
            <Grid item xs={4}>
              Specimen
            </Grid>
            <Grid item xs={4}>
              Test
            </Grid>
            <Grid item xs={4}>
              Result
            </Grid>
          </Grid>

          {patientLabOrders.map((order, orderIndex) =>
            order?.tests?.map((test: any, testIndex: number) => (
              <Grid
                container
                spacing={2}
                key={`order-${orderIndex}-test-${testIndex}`}
              >
                <Grid item xs={4}>
                  {order.specimen?.name || "N/A"}
                </Grid>
                <Grid item xs={4}>
                  {test.name}
                </Grid>
                <Grid item xs={4}>
                  {test.result || "Pending"}
                </Grid>
              </Grid>
            ))
          )}
        </Box>
      </Stack>
      <br />
      <Button variant="contained" onClick={handleOnPrint}>
        Print
      </Button>
      <Button variant="text" onClick={onClose}>
        Cancel
      </Button>
    </GenericDialog>
  );
};
