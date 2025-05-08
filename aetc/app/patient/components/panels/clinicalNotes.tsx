import { MainButton, WrapperBox } from "@/components";
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
type PanelData = {
  title: string;
  data: any[];
  useValue?: boolean;
};
export const ClinicalNotes = () => {
  const [filterSoapierState, setFilterSoapierState] = useState(false);
  const [filterAETCState, setFilterAETCState] = useState(false);
  const { handleSubmit } = useSubmitEncounter(
    encounters.CLINICAL_NOTES,
    () => ""
  );
  const [expanded, setExpanded] = useState("panel1");
  const { params } = useParameters();
  const patientId = params.id as string;
  const { notes: clinicalNotes, refresh } = useClinicalNotes(patientId);
  const {
    data: labOrders,
    isPending,
    isSuccess,
  } = getPatientLabOrder(params?.id as string);
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
  const encounterData: Record<string, PanelData> = {
    panel1: {
      title: "Triage",
      data: [
        ...getEncountersByType(encounters.TRIAGE_RESULT),
        ...getEncountersByType(encounters.PRESENTING_COMPLAINTS),
      ],
    },
    panel2: {
      title: "History of presenting complain",
      data: [getEncountersByType(encounters.SURGICAL_NOTES_TEMPLATE_FORM)],
    },
    panel3: {
      title: "Vitals",
      data: getNewVitalSigns(),
    },
    panel4: {
      title: "Past Medical History",
      data: getEncountersByType(encounters.MEDICAL_IN_PATIENT),
    },
    panel5: {
      title: "Drug History",
      data: getEncountersByType(encounters.MEDICAL_IN_PATIENT),
    },
    panel7: {
      title: "Plan",
      data: [
        ...getEncountersByType(encounters.BEDSIDE_INVESTIGATION_PLAN),
        ...getEncountersByType(encounters.LAB_ORDERS_PLAN),
      ],
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
    },
    panel10: {
      title: "Diagnosis",
      data: [
        ...getEncountersByType(encounters.OUTPATIENT_DIAGNOSIS),
        ...getEncountersByType(encounters.DIAGNOSIS),
      ],
    },
    panel11: {
      title: "Laboratory or Radiology finding",
      data: [
        ...getEncountersByType(encounters.BED_SIDE_TEST),
        ...getEncountersByType(encounters.LAB),
      ],
    },
    panel12: {
      title: "Outcome/Disposition",
      data: getEncountersByType(encounters.DISPOSITION),
    },
  };

  useEffect(() => {
    refresh();
  }, []);

  const addClinicalNote = (note: string) => {
    const data = { "Clinical notes construct": note };
    handleSubmit(getObservations(data, getDateTime())).then(() => refresh());
  };
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
  });

  // Handle accordion expansion
  const handleChange = (panel: any) => (_: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Function to render grouped items by heading
  const renderGroupedItems = (data: any[]) => {
    if (!data || data.length === 0) return null;

    // First, separate items with children and those without
    let itemsWithChildren: any = [];
    itemsWithChildren = data.filter(
      (item) => Array.isArray(item.children) && item.children.length > 0
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
    // Group children by their parent value
    const groupedChildren: Record<string, any[]> = {};

    children.forEach((child) => {
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
        />
      </WrapperBox>
      {Object.entries(encounterData).map(
        ([panelId, { title, data }]) =>
          data.length > 0 && (
            <Accordion defaultExpanded>
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
              </AccordionSummary>
              <AccordionDetails>
                {renderGroupedItems(data.flat())}
                {/* {title === "Plan" && (
                  <InvestigationPlanNotes children={data.flat()} />
                )} */}
              </AccordionDetails>
              <div>
                <div></div>
                <div></div>
              </div>
            </Accordion>
          )
      )}
      <style jsx>{`
        @media print {
          .print-only {
            display: block !important; /* Ensure visibility in print */
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
}: {
  onAddNote: (value: any) => any;
  filterSoapierState: boolean;
  filterAETCState: boolean;
  setFilterSoapierState: (value: boolean) => void;
  setFilterAETCState: (value: boolean) => void;
  onDownload: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // Ref for printing
  const contentRef = useRef<HTMLDivElement>(null);
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
