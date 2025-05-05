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
import { encounters } from "@/constants";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { getObservations } from "@/helpers";
import { useClinicalNotes } from "@/hooks/useClinicalNotes";
import { useReactToPrint } from "react-to-print";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { getPatientLabOrder } from "@/hooks/labOrder";

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
    console.log(
      "🚀 ~ getEncountersByType ~ patientHistory:",
      patientHistory[0]?.obs
    );
    return patientHistory[0]?.obs || [];
  };

  const encounterData = {
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
      data: getEncountersByType(encounters.VITALS),
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
        // ...getEncountersByType(encounters.LAB_ORDERS_PLAN),
        ...getEncountersByType(encounters.BEDSIDE_INVESTIGATION_PLAN),
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
      data: getEncountersByType(encounters.FINANCING),
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
      data: getEncountersByType(encounters.FINANCING),
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
  const contentRef = useRef<HTMLDivElement>(null); // <--- move here
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
  });
  // if (historyLoading) {
  //   return <ProfilePanelSkeletonLoader />;
  // }

  // Handle accordion expansion
  const handleChange = (panel: any) => (_: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Function to render grouped items by heading
  const renderGroupedItems = (data: any[]) => {
    if (!data || data.length === 0) return null;

    // Group items by their heading
    const groupedItems: Record<string, any[]> = {};

    data.forEach((item) => {
      const headingName =
        item?.names && item.names[0]?.name ? item.names[0].name : "Other";
      if (!groupedItems[headingName]) {
        groupedItems[headingName] = [];
      }
      groupedItems[headingName].push(item);
    });

    // Render each group with heading appearing only once
    return Object.entries(groupedItems).map(([heading, items], groupIndex) => (
      <Box
        key={`group-${groupIndex}`}
        className="clinical-note-group"
        sx={{
          marginBottom: "16px",
          borderBottom:
            groupIndex < Object.keys(groupedItems).length - 1
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
            height: "24px", // Set fixed height to align with first value
          }}
        >
          <Box component="span" sx={{ flexGrow: 1 }}>
            {heading}
          </Box>
        </Typography>

        {/* Center separator with increased size */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "24px", // Match the height of the heading
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
          {items.map((item, itemIndex) => (
            <Box
              key={`item-${groupIndex}-${itemIndex}`}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: itemIndex < items.length - 1 ? "10px" : 0,
                height: itemIndex === 0 ? "24px" : "auto", // First item aligned with heading
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
                  display: items.length > 1 ? "block" : "none",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  textAlign: "left",
                  lineHeight: "1.5",
                  paddingTop: itemIndex === 0 ? "2px" : 0, // First item aligned with heading
                }}
              >
                {item?.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    ));
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
          onDownload={handlePrint} // <--- pass handler to child
        />
      </WrapperBox>
      {Object.entries(encounterData).map(
        ([panelId, { title, data }]) =>
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
              </AccordionDetails>
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
