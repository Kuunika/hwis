'use client'
import { FormContainer, PatientInfoTab } from "@/components";
import { TemplateWrapper } from "@/components/templateForm";
import { concepts, encounters } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SummaryForm } from "./summaryForm";

import { Obs } from "@/interfaces";

export default function TraumaSpecialtyReview() {
  const { params } = useParameters();
  const { data } = getPatientsEncounters(params.id as string);
  const [presentingComplaints, setPresentingComplaints] = useState<Obs[]>([]);

  useEffect(() => {
    if (!data) return;

    const presentingComplaints = data.find(
      (d) => d.encounter_type.uuid === encounters.PRESENTING_COMPLAINTS
    );

    const presentingComplaintsObs = presentingComplaints?.obs.filter((ob) =>
      ob.names.some((n) => n.name === concepts.PRESENTING_COMPLAINTS)
    ) as Obs[];
    setPresentingComplaints(presentingComplaintsObs);
  }, [data]);

  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <TemplateWrapper OtherChildren={<SummaryForm />}>
          <Card sx={{ margin: "auto", mt: 4, p: 2 }}>
            <CardHeader title="Orthopaedic Specialty Review" />
            <CardContent>
              <Typography
                variant="h6"
                sx={{ textDecoration: "underline", fontStyle: "italic" }}
              >
                Presenting Complaints
              </Typography>

              <Typography
                variant="h6"
                sx={{ textDecoration: "underline", fontStyle: "italic" }}
              >
                Mechanism of Injury
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* {presentingComplaints.map((complaint:Obs) => { */}
                // return
              </Grid>
            </CardContent>
          </Card>
        </TemplateWrapper>
      </FormContainer>
    </>
  );
}
