import React from "react";
import { Typography, Grid, Box } from "@mui/material";

interface Field {
  name: string;
  value: string;
  parent?: string;
}

interface PrimarySurveyProps {
  panelData: any[];
  renderTimestamp: (panelData: any) => React.ReactNode;
}

export const PrimarySurvey = ({
  panelData,
  renderTimestamp,
}: PrimarySurveyProps) => {
  // Categorize fields by A–E
  const categorizeField = (fieldName: string) => {
    const name = fieldName.toLowerCase();

    if (
      name.includes("airway") ||
      name.includes("neck collar") ||
      name.includes("head blocks") ||
      name.includes("c-spine") ||
      name.includes("jaw thrust") ||
      name.includes("suction")
    ) {
      return "airway";
    }

    if (
      name.includes("breathing") ||
      name.includes("respiratory") ||
      name.includes("oxygen") ||
      name.includes("saturation") ||
      name.includes("trachea") ||
      name.includes("chest") ||
      name.includes("percussion") ||
      name.includes("lung")
    ) {
      return "breathing";
    }

    if (
      name.includes("pulse") ||
      name.includes("blood pressure") ||
      name.includes("bleeding") ||
      name.includes("intravenous") ||
      name.includes("catheter") ||
      name.includes("circulation")
    ) {
      return "circulation";
    }

    if (
      name.includes("consciousness") ||
      name.includes("glasgow") ||
      name.includes("pupil") ||
      name.includes("neurological") ||
      name.includes("headache") ||
      name.includes("disability")
    ) {
      return "disability";
    }

    if (
      name.includes("temperature") ||
      name.includes("exposure") ||
      name.includes("trauma") ||
      name.includes("environment") ||
      name.includes("mucous") ||
      name.includes("peripheries")
    ) {
      return "exposure";
    }

    return "other";
  };

  // Extract fields into their ABCDE groups
  const extractAllFields = (panelData: any) => {
    const fields: Record<string, Field[]> = {
      airway: [],
      breathing: [],
      circulation: [],
      disability: [],
      exposure: [],
      other: [],
    };

    if (!panelData || !Array.isArray(panelData)) return fields;

    panelData.forEach((item) => {
      if (!item) return;

      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        const parentValue = item.value || "";
        item.children.forEach((child: any) => {
          if (
            child &&
            child.names &&
            Array.isArray(child.names) &&
            child.names.length > 0
          ) {
            const childName = child.names[0]?.name;
            const childValue = child.value || child.names[0]?.name || "";
            if (childName && childValue) {
              const category = categorizeField(childName);
              fields[category].push({
                name: childName,
                value: childValue,
                parent: parentValue,
              });
            }
          }
        });
      } else if (
        item.names &&
        Array.isArray(item.names) &&
        item.names.length > 0 &&
        item.names[0]?.name
      ) {
        const fieldName = item.names[0].name;
        const fieldValue = item.value || "";
        if (fieldName && fieldValue) {
          const category = categorizeField(fieldName);
          fields[category].push({ name: fieldName, value: fieldValue });
        }
      }
    });

    return fields;
  };

  // Return nothing if no data
  if (!panelData || !Array.isArray(panelData) || panelData.length === 0) {
    return null;
  }

  const fields = extractAllFields(panelData);

  return (
    <Box sx={{ p: 2, minHeight: "60px" }}>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ textDecoration: "underline", marginBottom: 1 }}
      >
        Primary Survey
      </Typography>

      <Grid container spacing={2}>
        {/* Column 1: A & B */}
        <Grid item xs={12} md={4}>
          {/* A – Airway */}
          {fields.airway.length > 0 && (
            <>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}
              >
                A – Airway with C-Spine Protection
              </Typography>
              {fields.airway.map((field, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
                  {field.name}: {field.value}
                </Typography>
              ))}
            </>
          )}

          {/* B – Breathing */}
          {fields.breathing.length > 0 && (
            <>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}
              >
                B – Breathing
              </Typography>
              {fields.breathing.map((field, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
                  {field.name}: {field.value}
                </Typography>
              ))}
            </>
          )}
        </Grid>

        {/* Column 2: C & D */}
        <Grid item xs={12} md={4}>
          {/* C – Circulation */}
          {fields.circulation.length > 0 && (
            <>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}
              >
                C – Circulation
              </Typography>
              {fields.circulation.map((field, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
                  {field.name}: {field.value}
                </Typography>
              ))}
            </>
          )}

          {/* D – Disability */}
          {fields.disability.length > 0 && (
            <>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}
              >
                D – Disability
              </Typography>
              {fields.disability.map((field, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
                  {field.name}: {field.value}
                </Typography>
              ))}
            </>
          )}
        </Grid>

        {/* Column 3: E only */}
        <Grid item xs={12} md={4}>
          {/* E – Exposure/Environment */}
          {fields.exposure.length > 0 && (
            <>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}
              >
                E – Exposure/Environment
              </Typography>
              {fields.exposure.map((field, index) => (
                <Typography key={index} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
                  {field.name}: {field.value}
                </Typography>
              ))}
            </>
          )}
        </Grid>
      </Grid>

      {renderTimestamp(panelData)}
    </Box>
  );
};
