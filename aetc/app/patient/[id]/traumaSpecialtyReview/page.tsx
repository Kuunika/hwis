"use client";
import { concepts, encounters } from "@/constants";
import { getObservation, getObservationValue } from "@/helpers/emr";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function TraumaSpecialtyReview() {
  const { params } = useParameters();
  const { data } = getPatientsEncounters(params.id as string);
  const [traumaData, setTraumaData] = useState({});

  useEffect(() => {
    if (!data) return;

    const reviewOfSystemsEncounter = data?.find(
      (d) => d.encounter_type.uuid == encounters.REVIEW_OF_SYSTEMS
    );

    const reviewOfSystemsTraumaObs = reviewOfSystemsEncounter?.obs.filter(
      (ob) => ob.names.find((n) => n.name == concepts.REVIEW_OF_SYSTEMS_TRAUMA)
    );

    const reviewOfSystemsTraumaOb =
      reviewOfSystemsTraumaObs?.[reviewOfSystemsTraumaObs.length - 1];

    const timeOfInjury = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.TIME_OF_INJURY
    );
    const assault = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.ASSAULT
    );
    const traffic = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.ROAD_TRAFFIC_ACCIDENT
    );
    const fall = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.FALL
    );
    const bite = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.BITE
    );
    const gunshot = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.GUNSHOT
    );
    const collapse = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.BUILDING_COLLAPSE
    );
    const selfInflicted = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.SELF_HARM
    );
    const burns = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.BURN_INJURY
    );
    const drown = getObservationValue(
      reviewOfSystemsTraumaOb?.children,
      concepts.DROWNING
    );

    setTraumaData({
      [concepts.ASSAULT]: assault,
      [concepts.ROAD_TRAFFIC_ACCIDENT]: traffic,
      [concepts.FALL]: fall,
      [concepts.BITE]: bite,
      [concepts.TIME_OF_INJURY]: timeOfInjury,
      [concepts.SELF_HARM]: selfInflicted,
      [concepts.BURNS]: burns,
      [concepts.BURN_INJURY]: drown,
      [concepts.DROWNING]: collapse,
    });
  }, [data]);

  return (
    <Box>
      <Typography variant="h3">Trauma Specialty</Typography>
    </Box>
  );
}
