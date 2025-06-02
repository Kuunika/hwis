import React from "react";
import {
  Paper,
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getHumanReadableDateTime } from "@/helpers/dateTime";

const theme = createTheme({
  palette: {
    primary: { main: "#2196f3" },
    secondary: { main: "#f50057" },
  },
});

export const PrintClinicalNotes = (props: any) => {
  console.log({ props });
  // Make sure we have data object
  const data = props?.data || props;

  // Function to render timestamp and author
  const renderTimestamp = (panelData: any) => {
    if (!panelData?.[0]?.created_by) return null;

    return (
      <Typography
        sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px" }}
      >
        ~ {panelData[0].created_by} -{" "}
        {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
      </Typography>
    );
  };

  // Function to render grouped items by heading
  const renderGroupedItems = (panelData: any) => {
    if (!panelData || !Array.isArray(panelData) || panelData.length === 0)
      return null;

    // Create a map to group items by heading
    const headingMap = new Map();

    // Process all items and consolidate similar headings
    panelData.forEach((item) => {
      if (!item) return;

      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        // Get parent value as the heading
        const heading = item.value || "";
        if (!heading) return;

        // Collect all children values
        const childValues = item.children
          .map((child: any) => {
            if (
              !child ||
              !child.names ||
              !Array.isArray(child.names) ||
              child.names.length === 0
            )
              return "";
            return child.names[0]?.name || "";
          })
          .filter(Boolean);

        if (childValues.length > 0) {
          const existing = headingMap.get(heading) || [];
          headingMap.set(heading, [...existing, ...childValues]);
        }
      } else if (
        item.names &&
        Array.isArray(item.names) &&
        item.names.length > 0 &&
        item.names[0]?.name
      ) {
        // For regular items, use name as heading and value as the value
        const heading = item.names[0].name;
        const value = item.value || "";

        if (!heading || !value) return;

        const existing = headingMap.get(heading) || [];
        headingMap.set(heading, [...existing, value]);
      }
    });

    // Convert map to array of consolidated items
    const consolidatedItems = Array.from(headingMap.entries()).map(
      ([heading, values]) => ({
        label: heading,
        value: Array.isArray(values)
          ? Array.from(new Set(values)).join(", ")
          : values,
      })
    );

    if (consolidatedItems.length === 0) return null;

    return (
      <Box sx={{ p: 0.5 }}>
        <Typography
          variant="body2"
          sx={{ color: "#555", textAlign: "left", lineHeight: "1.8" }}
        >
          {consolidatedItems.map((item, index) => (
            <React.Fragment key={`item-${index}`}>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {item.label}
              </Box>
              : {item.value}
              {index < consolidatedItems.length - 1 ? "; " : ""}
            </React.Fragment>
          ))}
        </Typography>
      </Box>
    );
  };

  // Check if panel data has content
  const hasContent = (panelData: any) => {
    if (!panelData || !Array.isArray(panelData) || panelData.length === 0)
      return false;

    // Check if there's any valid data to display
    const flatData = Array.isArray(panelData) ? panelData.flat() : [];
    const renderedContent = renderGroupedItems(flatData);

    return renderedContent !== null;
  };

  // Section component to reduce repetition
  const Section = ({ title = "", panelData = [], borderRight = false }) => {
    if (!hasContent(panelData)) return null;

    const flatData = Array.isArray(panelData) ? panelData.flat() : [];

    return (
      <Grid
        item
        xs={6}
        sx={{
          p: 2,
          ...(borderRight && { borderRight: "1px solid rgba(0, 0, 0, 0.12)" }),
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ textDecoration: "underline" }}
          gutterBottom
        >
          {title}
        </Typography>
        {renderGroupedItems(flatData)}
        {renderTimestamp(panelData)}
      </Grid>
    );
  };

  // Clinical Notes section is unique, handle separately
  const renderClinicalNotes = (panelData: any) => {
    if (
      !panelData ||
      !Array.isArray(panelData) ||
      panelData.length === 0 ||
      !panelData.some((item) => item && item.value)
    ) {
      return null;
    }

    return (
      <Grid
        item
        xs={6}
        sx={{
          p: 1,
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          minHeight: "100px",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ textDecoration: "underline" }}
          gutterBottom
        >
          Clinical Notes
        </Typography>
        <List dense disablePadding>
          {panelData.map((item, index) =>
            item && item.value ? (
              <span key={`note-${index}-${item.obs_id || index}`}>
                <ListItem>
                  <ListItemText primary={item.value || ""} />
                </ListItem>
                {index === 0 && renderTimestamp(panelData)}
              </span>
            ) : null
          )}
        </List>
      </Grid>
    );
  };

  // Extract commonly used data for cleaner code
  const panelData = {
    clinicalNotes: data?.panel14?.data || [],
    triage: data?.panel1?.data || [],
    vital: data?.panel3?.data || [],
    primary: data?.panel8?.data || [],
    secondary: data?.panel9?.data || [],
    plan: data?.panel7?.data || [],
    soapier: data?.panel13?.data || [],
    diagnosis: data?.panel10?.data || [],
  };

  // Check if triage and vital sections have content
  const hasTriageContent = hasContent(panelData.triage);
  const hasVitalContent = hasContent(panelData.vital);
  const hasPrimaryContent = hasContent(panelData.primary);
  const hasClinicalNotesContent =
    panelData.clinicalNotes &&
    Array.isArray(panelData.clinicalNotes) &&
    panelData.clinicalNotes.length > 0 &&
    panelData.clinicalNotes.some((item) => item && item.value);

  // Check if we have any content for the first row
  const hasFirstRowContent =
    hasClinicalNotesContent ||
    hasTriageContent ||
    hasVitalContent ||
    hasPrimaryContent;

  // Check if we have any content for the second row
  const hasSecondaryContent: any = hasContent(panelData.secondary);
  const hasPlanContent = hasContent(panelData.plan);
  const hasSecondRowContent = hasSecondaryContent || hasPlanContent;

  // Check if we have any content for the third row
  const hasSoapierContent = hasContent(panelData.soapier);
  const hasDiagnosisContent = hasContent(panelData.diagnosis);
  const hasThirdRowContent = hasSoapierContent || hasDiagnosisContent;

  // If no content at all, return a message
  if (!hasFirstRowContent && !hasSecondRowContent && !hasThirdRowContent) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ maxWidth: 1000, mx: "auto", my: 2 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" align="center">
              No clinical data available
            </Typography>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 1000, mx: "auto", my: 2 }}>
        <Paper elevation={3}>
          {/* First Row - Clinical Notes and Right Column (Triage, Vital, Primary) */}
          {hasFirstRowContent && (
            <Grid container>
              {hasClinicalNotesContent &&
                renderClinicalNotes(panelData.clinicalNotes)}

              {/* Right Column Container - Only render if any section has content */}
              {(hasTriageContent || hasVitalContent || hasPrimaryContent) && (
                <Grid
                  item
                  xs={hasClinicalNotesContent ? 6 : 12}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  {/* Triage Information */}
                  {hasTriageContent && (
                    <Box
                      sx={{
                        p: 2,
                        borderBottom:
                          hasVitalContent || hasPrimaryContent
                            ? "1px solid rgba(0, 0, 0, 0.12)"
                            : "none",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ textDecoration: "underline" }}
                        gutterBottom
                      >
                        Triage Information
                      </Typography>
                      {renderGroupedItems(
                        Array.isArray(panelData.triage)
                          ? panelData.triage.flat()
                          : []
                      )}
                      {renderTimestamp(panelData.triage)}
                    </Box>
                  )}

                  {/* Vital Information */}
                  {hasVitalContent && (
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: hasPrimaryContent
                          ? "1px solid rgba(0, 0, 0, 0.12)"
                          : "none",
                        minHeight: "80px",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ textDecoration: "underline" }}
                        gutterBottom
                      >
                        Vital Information
                      </Typography>
                      {renderGroupedItems(
                        Array.isArray(panelData.vital)
                          ? panelData.vital.flat()
                          : []
                      )}
                      {renderTimestamp(panelData.vital)}
                    </Box>
                  )}

                  {/* Primary Survey */}
                  {hasPrimaryContent && (
                    <Box sx={{ p: 2, minHeight: "60px" }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ textDecoration: "underline", marginBottom: 0 }}
                      >
                        Primary Survey
                      </Typography>
                      {renderGroupedItems(
                        Array.isArray(panelData.primary)
                          ? panelData.primary.flat()
                          : []
                      )}
                      {renderTimestamp(panelData.primary)}
                    </Box>
                  )}
                </Grid>
              )}
            </Grid>
          )}

          {/* Add divider between rows only if both have content */}
          {hasFirstRowContent && hasSecondRowContent && <Divider />}

          {/* Second Row */}
          {hasSecondRowContent && (
            <Grid container>
              {hasSecondaryContent ? (
                <Section
                  title="Secondary Survey"
                  panelData={panelData.secondary}
                  borderRight={hasPlanContent}
                />
              ) : null}

              {hasPlanContent ? (
                <Section title="Plan" panelData={panelData.plan} />
              ) : null}
            </Grid>
          )}

          {/* Add divider between rows only if both have content */}
          {hasSecondRowContent && hasThirdRowContent && <Divider />}

          {/* Third Row */}
          {hasThirdRowContent && (
            <Grid container>
              {hasSoapierContent ? (
                <Section
                  title="SOAPIER"
                  panelData={panelData.soapier}
                  borderRight={hasDiagnosisContent}
                />
              ) : null}

              {hasDiagnosisContent ? (
                <Section title="Diagnosis" panelData={panelData.diagnosis} />
              ) : null}
            </Grid>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};
