"use client";
import { MainTypography, WrapperBox } from "@/components";
import { PatientInfoTab } from "@/components";
import { FaAngleLeft } from "react-icons/fa6";
import PresentingComplaintsPanel from "./components/pastPresentingComplaints";
import { useNavigation } from "@/hooks";
import DrugHistoryPanel from "./components/drugHistory";
import { Box, Button } from "@mui/material";
import PastMedicalHistoryPanel from "./components/pastMedicalHistory";
import PastSurgicalHistoryPanel from "./components/pastSurgicalHistory";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import AllergiesPanel from "./components/allergies";

function InPatientAdmission() {

  const { navigateBack } = useNavigation();
  const printRef = useRef(null);
  const [showAllPanels, setShowAllPanels] = useState({
    presentingComplaints: false,
    pastMedicalHistory: false,
    drugHistory: false,
    pastSurgicalHistory: false,
    allergies: false,
  });
  
  const togglePanel = (panel: keyof typeof showAllPanels) => {
    setShowAllPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "In-Patient Template Form",
    onBeforeGetContent: () =>
      new Promise((resolve) => {
        setShowAllPanels({
          presentingComplaints: true,
          pastMedicalHistory: true,
          drugHistory: true,
          pastSurgicalHistory: true,
          allergies: true,
        });
        setTimeout(resolve, 100);
      }),
    onAfterPrint: () =>
      setShowAllPanels({
        presentingComplaints: false,
        pastMedicalHistory: false,
        drugHistory: false,
        pastSurgicalHistory: false,
        allergies: false,
      }),
  });

  
  return (
    <>
      <PatientInfoTab />
      <WrapperBox
  
  sx={{
    display: { lg: "flex", xs: "none" },
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    pt: "2ch",
    pl: "2ch",
    mb: "2ch",
  }}
>
  <div style={{display: "flex"}}>
  <MainTypography
    sx={{
      width: "24px",
      height: "24px",
      fontSize: "20px",
      fontWeight: 400,
    }}
  >
    <FaAngleLeft />
  </MainTypography>
  <MainTypography
    sx={{
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "21px",
      letterSpacing: "0em",
      textAlign: "left",
      paddingTop: "1px",
    }}
    onClick={() => navigateBack()}
  >
    Back
  </MainTypography>
  </div>
  <Button sx={{mr:'15px'}} onClick={handlePrint}>DOWNLOAD PDF</Button>
</WrapperBox>
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, 
    gap: "1.5ch",
    gridAutoFlow: "dense",
    pl: "2ch",
    pr: "2ch",
    alignItems: "start",
  }}
  ref={printRef}
>

<WrapperBox sx={{ width: "100%" }}>
  <PresentingComplaintsPanel
    showForPrinting={showAllPanels.presentingComplaints}
    toggleShow={() => togglePanel("presentingComplaints")}
  />
</WrapperBox>

<WrapperBox sx={{ width: "100%" }}>
  <PastMedicalHistoryPanel
  />
</WrapperBox>

<WrapperBox sx={{ width: "100%", gridColumn: "1 / -1" }}>
  <DrugHistoryPanel
    showForPrinting={showAllPanels.drugHistory}
    toggleShow={() => togglePanel("drugHistory")}
  />
</WrapperBox>

<WrapperBox sx={{ width: "100%", gridColumn: "1 / -1" }}>
  <PastSurgicalHistoryPanel
    showForPrinting={showAllPanels.pastSurgicalHistory}
    toggleShow={() => togglePanel("pastSurgicalHistory")}
  />
</WrapperBox>

<WrapperBox sx={{ width: "100%", gridColumn: "1 / -1" }}>
  <AllergiesPanel
  />
</WrapperBox>
</Box>
    </>
  );
}


export default InPatientAdmission;