import { MainButton, PatientInfoTab, WrapperBox } from "@/components";
import { Panel } from ".";
import { FaExpandAlt, FaPlus, FaRegChartBar } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect, useMemo, useRef } from "react";
import MarkdownEditor from "@/components/markdownEditor";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
} from "@mui/material";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { useParameters, useSubmitEncounter } from "@/hooks";
import { encounters, concepts } from "@/constants";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { getObservations } from "@/helpers";
import { useClinicalNotes } from "@/hooks/useClinicalNotes";
import { useReactToPrint } from "react-to-print";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { getPatientLabOrder } from "@/hooks/labOrder";
import { getAllObservations } from "@/hooks/obs";
import { InvestigationPlanNotes } from "../clinicalNotes/InvestigationPlan";
import { PrintClinicalNotes } from "./printClinicalNotes";

type PanelData = {
  title: string;
  data: any[];
  useValue?: boolean;
  removeObs?: string[]; // Add removeObs property to PanelData type
};

// New component for Laboratory or Radiology finding
const LaboratoryRadiologyFindings = ({ data }: any) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Ensure data is actually an array before processing
  const safeData = Array.isArray(data) ? data : [];

  // Group lab results by test type
  const groupedResults = safeData.reduce((acc, item) => {
    // Skip null or undefined items
    if (!item) return acc;

    const testName = item?.names?.[0]?.name || "Other";
    if (!acc[testName]) {
      acc[testName] = [];
    }
    acc[testName].push(item);
    return acc;
  }, {});

  return (
    <Box sx={{ padding: "10px 0" }}>
      {Object.entries(groupedResults).map(([testName, results], index) => (
        <Box
          key={`lab-group-${index}`}
          sx={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              borderBottom: "1px solid #e0e0e0",
              paddingBottom: "8px",
              marginBottom: "10px",
            }}
          >
            {testName}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {Array.isArray(results) &&
              results.map((result, idx) => (
                <Box
                  key={`result-${idx}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {result.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#7f8c8d" }}>
                    {getHumanReadableDateTime(result.obs_datetime)}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const filterObservationsByName = (observations: any, filterNames = []) => {
  if (!observations || !Array.isArray(observations)) return [];

  return observations.filter((obs) => {
    // Check if observation's name is in the filter list
    const obsName = obs?.names?.[0]?.name || "";
    const shouldKeep = !filterNames.some((filterName: any) =>
      obsName.toLowerCase().includes(filterName.toLowerCase())
    );

    // If observation has children, filter those too
    if (
      shouldKeep &&
      obs.children &&
      Array.isArray(obs.children) &&
      obs.children.length > 0
    ) {
      obs.children = filterObservationsByName(obs.children, filterNames);
    }

    return shouldKeep;
  });
};

export const ClinicalNotes = () => {
  const [filterSoapierState, setFilterSoapierState] = useState(false);
  const [filterAETCState, setFilterAETCState] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false); // Changed to false initially
  const { handleSubmit } = useSubmitEncounter(
    encounters.CLINICAL_NOTES,
    () => ""
  );
  const { params } = useParameters();
  const patientId = params.id as string;
  const { notes: clinicalNotes, refresh } = useClinicalNotes(patientId);
  const [printoutTitle, setPrintoutTitle] = useState("All");


  const contentRef = useRef<HTMLDivElement>(null);

  // Refresh encounter data when component mounts or filters change
  useEffect(() => {
    // Fetch data whenever component mounts
    refresh();

    // Also refreshes when filters change
    const intervalId = setInterval(() => {
      refresh();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [refresh, filterSoapierState, filterAETCState]);

  const getEncountersByType = (encounterTypeUuid: any) => {
    const {
      data: patientHistory,
      isLoading: historyLoading,
    }: { data: any; isLoading: any } = getPatientsEncounters(
      patientId,
      `encounter_type=${encounterTypeUuid}`
    );
    if (!patientHistory) return [];
    return patientHistory[0]?.obs || [];
  };

  const getLatestValue = (obsData: any) => {
    if (!obsData?.length) return null;
    const latestObsMap = new Map();

    // Find the most recent observation for each concept_id
    obsData.forEach((observation: any) => {
      const { concept_id, obs_datetime } = observation;
      const currentLatest = latestObsMap.get(concept_id);

      if (
        !currentLatest ||
        new Date(obs_datetime) > new Date(currentLatest.obs_datetime)
      ) {
        latestObsMap.set(concept_id, observation);
      }
    });

    // Get the full observation objects, not just the keys
    const latestObservations = Array.from(latestObsMap.values());

    return latestObservations;
  };

  const getObsByConceptName = (obsData: any) => {
    const { data: obs }: any = getAllObservations(patientId, obsData);
    return obs?.data || [];
  };

  const getNewVitalSigns = () => {
    const allObs: any = [
      ...getObsByConceptName(concepts.HEART_RATE),
      ...getObsByConceptName(concepts.RESPIRATORY_RATE),
      ...getObsByConceptName(concepts.BLOOD_OXYGEN_SATURATION),
      ...getObsByConceptName(concepts.TEMPERATURE),
      ...getObsByConceptName(concepts.GLUCOSE),
      ...getObsByConceptName(concepts.AVPU),
      ...getObsByConceptName(concepts.SYSTOLIC_BLOOD_PRESSURE),
      ...getObsByConceptName(concepts.DIASTOLIC_BLOOD_PRESSURE),
    ];
    return getLatestValue(allObs) || [];
  };

  // Generate base encounter data with all possible panels and their removeObs arrays
  const baseEncounterData: Record<string, PanelData> = {
    panel14: {
      title: "Clinical Notes",
      data: getEncountersByType(encounters.CLINICAL_NOTES),
      removeObs: ["image part", "image part 2"], // Example headings to remove
    },
    panel13: {
      title: "SOAPIER Notes",
      data: [
        ...getEncountersByType(encounters.NURSING_CARE_NOTES),
        ...getEncountersByType(encounters.PRESCRIPTIONS),
        ...getEncountersByType(encounters.DISPENSING),
      ],
      removeObs: ["nursing chart", "medication chart"], // Example headings to remove
    },
    panel1: {
      title: "Triage",
      data: [
        ...getEncountersByType(encounters.TRIAGE_RESULT),
        ...getEncountersByType(encounters.PRESENTING_COMPLAINTS),
      ],
      removeObs: [], // No specific headings to remove
    },
    panel2: {
      title: "History of presenting complain",
      data: [getEncountersByType(encounters.SURGICAL_NOTES_TEMPLATE_FORM)],
      removeObs: [], // No specific headings to remove
    },
    panel3: {
      title: "Vitals",
      data: getNewVitalSigns(),
      removeObs: [], // No specific headings to remove
    },
    panel4: {
      title: "Past Medical History",
      data: getEncountersByType(encounters.MEDICAL_IN_PATIENT),
      removeObs: [], // No specific headings to remove
    },
    panel5: {
      title: "Drug History",
      data: getEncountersByType(encounters.MEDICAL_IN_PATIENT),
      removeObs: [], // No specific headings to remove
    },
    panel7: {
      title: "Plan",
      data: [
        ...getEncountersByType(encounters.BEDSIDE_INVESTIGATION_PLAN),
        ...getEncountersByType(encounters.LAB_ORDERS_PLAN),
      ],
      removeObs: [], // No specific headings to remove
    },
    panel8: {
      title: "Primary Survey",
      data: [
        ...getEncountersByType(encounters.AIRWAY_ASSESSMENT),
        ...getEncountersByType(encounters.BREATHING_ASSESSMENT),
        ...getEncountersByType(encounters.CIRCULATION_ASSESSMENT),
        ...getEncountersByType(encounters.PRIMARY_DISABILITY_ASSESSMENT),
        ...getEncountersByType(encounters.EXPOSURE_ASSESSMENT),
      ],
      removeObs: ["Image Part Name"], // No specific headings to remove
    },
    panel9: {
      title: "Secondary Survey",
      data: [
        ...getEncountersByType(encounters.GENERAL_INFORMATION_ASSESSMENT),
        ...getEncountersByType(encounters.HEAD_AND_NECK_ASSESSMENT),
        ...getEncountersByType(encounters.CHEST_ASSESSMENT),
        ...getEncountersByType(encounters.ABDOMEN_AND_PELVIS_ASSESSMENT),
        ...getEncountersByType(encounters.EXTREMITIES_ASSESSMENT),
        ...getEncountersByType(encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT),
      ],
      removeObs: [
        "Image Part Name",
        "Abnormalities",
        "Clinician notes",
        "Other",
      ], // No specific headings to remove
    },
    panel10: {
      title: "Diagnosis",
      data: [
        ...getEncountersByType(encounters.OUTPATIENT_DIAGNOSIS),
        ...getEncountersByType(encounters.DIAGNOSIS),
      ],
      removeObs: [], // No specific headings to remove
    },
    panel11: {
      title: "Laboratory or Radiology finding",
      data: [
        ...getEncountersByType(encounters.BED_SIDE_TEST),
        ...getEncountersByType(encounters.LAB),
      ],
      removeObs: [], // No specific headings to remove
    },
    panel12: {
      title: "Outcome/Disposition",
      data: getEncountersByType(encounters.DISPOSITION),
      removeObs: [], // No specific headings to remove
    },
  };

  // Process encounter data based on filters and removeObs arrays
  const getFilteredEncounterData = (
    baseData: any,
    showSoapierOnly: any,
    showAETC: any
  ) => {
    // Start with a copy of the base data
    const filteredData = { ...baseData };

    // Apply panel-specific filters to all panels based on removeObs property
    Object.keys(filteredData).forEach((panelId) => {
      const panel = filteredData[panelId];
      if (panel && Array.isArray(panel.data) && panel.data.length > 0) {
        // If panel has removeObs property, filter out those observation names
        if (
          panel.removeObs &&
          Array.isArray(panel.removeObs) &&
          panel.removeObs.length > 0
        ) {
          filteredData[panelId].data = filterObservationsByName(
            panel.data,
            panel.removeObs
          );
        }
      }
    });

    // Apply global filters
    if (showSoapierOnly) {
      // Only show SOAPIER Notes when filterSoapierState is true
      const result: any = {};
      if (filteredData.panel13) {
        result.panel13 = filteredData.panel13;
      }
      return result;
    } else if (showAETC) {
      // Remove Clinical Notes and SOAPIER Notes panels when filterAETCState is true
      delete filteredData.panel14;
      delete filteredData.panel13;
    }

    return filteredData;
  };

  // Filter encounter data based on filter states and removeObs arrays
  const encounterData = useMemo(() => {
    return getFilteredEncounterData(
      baseEncounterData,
      filterSoapierState,
      filterAETCState
    );
  }, [baseEncounterData, filterSoapierState, filterAETCState]);

  const addClinicalNote = (note: string) => {
    const data = { "Clinical notes construct": note };
    handleSubmit(getObservations(data, getDateTime())).then(() => refresh());
  };

  // Handle accordion expansion
  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);

      // Refresh data when accordion is opened
      if (isExpanded) {
        refresh();
      }
    };

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
  });

  // Function to render grouped items by heading
  const renderGroupedItems = (data: any[]) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    // First, separate items with children and those without
    let itemsWithChildren: any = [];
    itemsWithChildren = data.filter(
      (item) => item && Array.isArray(item.children) && item.children.length > 0
    );

    const regularItems = data.filter(
      (item) => !item.children || item.children.length === 0
    );

    // Process items with children
    const parentElements = itemsWithChildren.map(
      (parentItem: any, index: number) => {
        // Add parent reference to children for use in renderChildrenByHeading
        const childrenWithParentRef = parentItem.children.map((child: any) => ({
          ...child,
          parent: {
            value: parentItem.value,
            names: parentItem.names,
          },
        }));

        return (
          <Box key={`parent-item-${index}`} sx={{ marginBottom: "24px" }}>
            {/* Render children with parent reference */}
            {renderChildrenByHeading(childrenWithParentRef)}
          </Box>
        );
      }
    );

    // Render regular items (without children)
    const regularItemsElement =
      regularItems.length > 0 ? renderRegularItems(regularItems, 0) : null;

    // Combine both types of elements
    return (
      <>
        {parentElements}
        {regularItemsElement}
      </>
    );
  };

  // Function to group and render children by their headings
  const renderChildrenByHeading = (children: any[]) => {
    // Ensure children is an array
    if (!children || !Array.isArray(children)) {
      return null;
    }

    // Group children by their parent value
    const groupedChildren: Record<string, any[]> = {};

    children.forEach((child) => {
      if (!child) return; // Skip null or undefined children
      const parentValue = child.parent?.value || "Other";
      if (!groupedChildren[parentValue]) {
        groupedChildren[parentValue] = [];
      }
      groupedChildren[parentValue].push(child);
    });

    // Render each parent value as a group
    return Object.entries(groupedChildren).map(
      ([parentValue, childItems], index) => (
        <Box
          key={`child-group-${index}`}
          className="clinical-note-group"
          sx={{
            marginBottom: "16px",
            borderBottom:
              index < Object.keys(groupedChildren).length - 1
                ? "1px solid #e0e0e0"
                : "none",
            paddingBottom: "16px",
            display: "flex",
          }}
        >
          {/* Left side: Parent Value */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "#3a3a3a",
              width: "30%",
              paddingRight: "8px",
              display: "flex",
              alignItems: "center",
              height: "24px",
            }}
          >
            <Box component="span" sx={{ flexGrow: 1 }}>
              {parentValue}
            </Box>
          </Typography>

          {/* Center separator */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "24px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#777",
                fontWeight: 400,
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              :
            </Typography>
          </Box>

          {/* Right side: Child names and values */}
          <Box sx={{ width: "calc(70% - 40px)" }}>
            {childItems.map((child, itemIndex) => {
              const childName =
                child.names && child.names[0]?.name ? child.names[0].name : "";
              return (
                <Box
                  key={`child-value-${index}-${itemIndex}`}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom:
                      itemIndex < childItems.length - 1 ? "10px" : 0,
                    height: itemIndex === 0 ? "24px" : "auto",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      minWidth: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#3f51b5",
                      marginRight: "10px",
                      marginTop: itemIndex === 0 ? "10px" : "8px",
                      display: childItems.length > 1 ? "block" : "none",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#555",
                      textAlign: "left",
                      lineHeight: "1.5",
                      paddingTop: itemIndex === 0 ? "2px" : 0,
                      fontWeight: "600",
                      display: "inline",
                    }}
                  >
                    {childName}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )
    );
  };

  // Helper function to handle regular items (without children)
  const renderRegularItems = (items: any[], groupIndex: number) => {
    // Group items by their heading
    const groupedItems: Record<string, any[]> = {};

    items.forEach((item) => {
      const headingName =
        item?.names && item.names[0]?.name ? item.names[0].name : "Other";
      if (!groupedItems[headingName]) {
        groupedItems[headingName] = [];
      }
      groupedItems[headingName].push(item);
    });

    // Render each group with heading appearing only once
    return Object.entries(groupedItems).map(
      ([heading, groupItems], subGroupIndex) => (
        <Box
          key={`group-${groupIndex}-${subGroupIndex}`}
          className="clinical-note-group"
          sx={{
            marginBottom: "16px",
            borderBottom:
              subGroupIndex < Object.keys(groupedItems).length - 1
                ? "1px solid #e0e0e0"
                : "none",
            paddingBottom: "16px",
            display: "flex",
          }}
        >
          {/* Left side: Heading appears only once */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "#3a3a3a",
              width: "30%",
              paddingRight: "8px",
              display: "flex",
              alignItems: "center",
              height: "24px",
            }}
          >
            <Box component="span" sx={{ flexGrow: 1 }}>
              {heading}
            </Box>
          </Typography>

          {/* Center separator */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "24px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#777",
                fontWeight: 400,
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              :
            </Typography>
          </Box>

          {/* Right side: Values */}
          <Box sx={{ width: "calc(70% - 40px)" }}>
            {groupItems.map((item, itemIndex) => (
              <Box
                key={`item-${groupIndex}-${itemIndex}`}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: itemIndex < groupItems.length - 1 ? "10px" : 0,
                  height: itemIndex === 0 ? "24px" : "auto",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    minWidth: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#3f51b5",
                    marginRight: "10px",
                    marginTop: itemIndex === 0 ? "10px" : "8px",
                    display: groupItems.length > 1 ? "block" : "none",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    textAlign: "left",
                    lineHeight: "1.5",
                    paddingTop: itemIndex === 0 ? "2px" : 0,
                  }}
                >
                  {item?.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )
    );
  };

  return (
    <Panel title="">
      <WrapperBox display={"flex"} justifyContent={"space-between"}>
        <AddClinicalNotes
          onAddNote={addClinicalNote}
          filterSoapierState={filterSoapierState}
          filterAETCState={filterAETCState}
          setFilterSoapierState={setFilterSoapierState}
          setFilterAETCState={setFilterAETCState}
          onDownload={handlePrint}
          onClickFilterButton={setPrintoutTitle}
        />
      </WrapperBox>
      <div ref={contentRef} className="print-only">
        <div>
          <PatientInfoTab />
          <div
            style={{
              fontWeight: 700,
              fontSize: "20px",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            Clinical Notes ({printoutTitle})
          </div>
        </div>
        <PrintClinicalNotes data={encounterData} />
      </div>
      {Object.entries(encounterData).map(
        ([panelId, { title, data }]: any) =>
          data.length > 0 && (
            <Accordion
              key={panelId}
              expanded={expanded === panelId}
              onChange={handleChange(panelId)}
            >
              <AccordionSummary
                expandIcon={
                  <ArrowForwardIosSharpIcon
                    sx={{ fontSize: "0.9rem", color: "#3f51b5" }}
                  />
                }
                aria-controls={`${panelId}-content`}
                id={`${panelId}-header`}
                sx={{
                  minHeight: "54px",
                  "&.Mui-expanded": { minHeight: "54px" },
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "98%",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#2c3e50",
                      fontSize: "1.05rem",
                      letterSpacing: "0.2px",
                    }}
                    component="span"
                  >
                    {title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#7f8c8d",
                      fontSize: "14px",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {encounterData[panelId]?.data[0]?.created_by && (
                      <>
                        ~ {encounterData[panelId]?.data[0]?.created_by} -{" "}
                        {getHumanReadableDateTime(
                          encounterData[panelId]?.data[0]?.obs_datetime
                        )}
                      </>
                    )}
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {/* Use custom component for Laboratory/Radiology panel */}
                {title === "Laboratory or Radiology finding"
                  ? // <LaboratoryRadiologyFindings
                    //   data={Array.isArray(data) ? data.flat() : []}
                    // />
                    ""
                  : renderGroupedItems(Array.isArray(data) ? data.flat() : [])}
              </AccordionDetails>
            </Accordion>
          )
      )}

      <style jsx>{`
        @media print {
          .print-only {
            display: block !important; /* Ensure visibility in print */
          }

          /* Make sure accordions are visible in print */
          :global(.MuiCollapse-hidden) {
            visibility: visible !important;
            display: block !important;
            height: auto !important;
          }

          :global(.MuiAccordionSummary-content) {
            margin: 12px 0 !important; /* Ensure proper spacing */
          }
        }

        .print-only {
          display: none; /* Hide on screen */
        }

        /* Additional global styles */
        :global(.MuiAccordionDetails-root) {
          padding: 16px 20px 24px;
        }

        :global(.clinical-note-group) {
          margin-bottom: 12px;
        }

        :global(.MuiAccordion-root) {
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
          border-radius: 6px !important;
          overflow: hidden;
          margin-bottom: 12px;
        }

        :global(.MuiAccordionSummary-root) {
          background-color: #f7f9fc;
          border-bottom: 1px solid #e0e0e0;
        }
      `}</style>
    </Panel>
  );
};

const AddClinicalNotes = ({
  onAddNote,
  filterSoapierState,
  filterAETCState,
  setFilterSoapierState,
  setFilterAETCState,
  onDownload,
  onClickFilterButton
}: {
  onAddNote: (value: any) => any;
  filterSoapierState: boolean;
  filterAETCState: boolean;
  setFilterSoapierState: (value: boolean) => void;
  setFilterAETCState: (value: boolean) => void;
  onDownload: () => void;
  onClickFilterButton: (value: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // Ref for printing
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (values: any) => {
    setAnchorEl(null);
    onAddNote(values);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          width: "100%",
        }}
      >
        <MainButton
          aria-describedby={id}
          title="Add Notes"
          variant="contained"
          onClick={handleClick}
          startIcon={<FaPlus />}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textTransform: "none",
            px: 3,
            py: 1,
            maxWidth: "calc(100% - 40px)",
            borderRadius: "8px",
            "& .MuiButton-startIcon": {
              marginRight: "8px",
              "& svg": {
                fontSize: "14px",
              },
            },
          }}
        />

        <div>
          <Button
            onClick={onDownload}
            sx={{
              color: "white",
              backgroundColor: "primary.main",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "110px",
              "&:hover": {
                backgroundColor: "rgb(0, 70, 0)",
              },
            }}
          >
            Download PDF
          </Button>
          <span
            style={{
              width: "10px",
              borderRight: "1px solid #000",
              marginRight: "10px",
              height: "30px",
              paddingTop: "5px",
              paddingBottom: "5px",
            }}
          ></span>
          <Button
            onClick={() => {
              setFilterSoapierState(true);
              setFilterAETCState(false);
              onClickFilterButton("SOAPIER Notes");
            }}
            sx={{
              backgroundColor: filterSoapierState ? "rgb(221, 238, 221)" : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "120px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            SOAPIER Notes
          </Button>
          <Button
            onClick={() => {
              setFilterAETCState(true);
              setFilterSoapierState(false);
              onClickFilterButton("AETC");
            }}
            sx={{
              backgroundColor: filterAETCState ? "rgb(221, 238, 221)" : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "110px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            AETC
          </Button>
          <Button
            onClick={() => {
              setFilterSoapierState(false);
              setFilterAETCState(false);
              onClickFilterButton("All");
            }}
            sx={{
              backgroundColor:
                !filterSoapierState && !filterAETCState
                  ? "rgb(221, 238, 221)"
                  : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "110px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            All
          </Button>
        </div>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MarkdownEditor onSubmit={onSubmit} />
      </Popover>
    </>
  );
};
