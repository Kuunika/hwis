"use client";
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

export default function TraumaSpecialtyReview() {
  const { params } = useParameters();
  const { data } = getPatientsEncounters(params.id as string);
  const [traumaData, setTraumaData] = useState<
    Record<string, string | boolean | null>
  >({});

  useEffect(() => {
    if (!data) return;

    const reviewOfSystemsEncounter = data.find(
      (d) => d.encounter_type.uuid === encounters.REVIEW_OF_SYSTEMS
    );

    const reviewOfSystemsTraumaObs = reviewOfSystemsEncounter?.obs.filter(
      (ob) => ob.names.some((n) => n.name === concepts.REVIEW_OF_SYSTEMS_TRAUMA)
    );

    const reviewOfSystemsTraumaOb =
      reviewOfSystemsTraumaObs?.[reviewOfSystemsTraumaObs.length - 1];

    setTraumaData({
      [concepts.TIME_OF_INJURY]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.TIME_OF_INJURY
      ),
      [concepts.ASSAULT]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.ASSAULT
      ),
      [concepts.ROAD_TRAFFIC_ACCIDENT]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.ROAD_TRAFFIC_ACCIDENT
      ),
      [concepts.FALL]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.FALL
      ),
      [concepts.BITE]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.BITE
      ),
      [concepts.GUNSHOT]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.GUNSHOT
      ),
      [concepts.BUILDING_COLLAPSE]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.BUILDING_COLLAPSE
      ),
      [concepts.SELF_HARM]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.SELF_HARM
      ),
      [concepts.BURN_INJURY]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.BURN_INJURY
      ),
      [concepts.DROWNING]: getObservationValue(
        reviewOfSystemsTraumaOb?.children,
        concepts.DROWNING
      ),
    });
  }, [data]);

  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <TemplateWrapper>
          <Card sx={{ margin: "auto", mt: 4, p: 2 }}>
            <CardHeader title="Trauma Specialty Review" />
            <CardContent>
              <Typography
                variant="h6"
                sx={{ textDecoration: "underline", fontStyle: "italic" }}
              >
                Details
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: "italic", mb: 2 }}>
                <strong>Time of Injury:</strong>{" "}
                {traumaData[concepts.TIME_OF_INJURY] || "N/A"}
              </Typography>

              <Typography
                variant="h6"
                sx={{ textDecoration: "underline", fontStyle: "italic" }}
              >
                Mechanism of Injury
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                {Object.entries(traumaData).map(([key, value]) => {
                  if (key === concepts.TIME_OF_INJURY) return null; // Already displayed above

                  return (
                    value && (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          {key.replace(/_/g, " ").toUpperCase()}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontStyle: "italic" }}
                        >
                          {typeof value === "boolean"
                            ? value
                              ? "Yes"
                              : "No"
                            : value}
                        </Typography>
                      </Grid>
                    )
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </TemplateWrapper>
      </FormContainer>
    </>
  );
}
