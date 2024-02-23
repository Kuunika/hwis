import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { MainTypography, WrapperBox } from "shared-ui/src";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { FaRegCheckSquare, FaRegSquare, FaSearch } from "react-icons/fa";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

export function LabRequestModal(props: SimpleDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    console.log("closed");
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog
      fullScreen={false}
      maxWidth="lg"
      fullWidth={true}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>Lab Order</DialogTitle>
      <DialogContent>
        <WrapperBox display={"flex"}>
          <WrapperBox
            sx={{ width: "30%", borderRight: "solid #e0e0e0 1px", px: "1ch" }}
          >
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Test Type
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Bedside"
                  control={<Radio />}
                  label="Bedside"
                />
                <FormControlLabel value="Lab" control={<Radio />} label="Lab" />
                <FormControlLabel
                  value="Radiology"
                  control={<Radio />}
                  label="Radiology"
                />
              </RadioGroup>
            </FormControl>
            <TestList />
          </WrapperBox>
          <WrapperBox sx={{ width: "70%" }}></WrapperBox>
        </WrapperBox>
      </DialogContent>
    </Dialog>
  );
}

export const TestList = () => {
  const commonLabTests = [
    "Complete Blood Count (CBC)",
    "Basic Metabolic Panel (BMP)",
    "Comprehensive Metabolic Panel (CMP)",
    "Lipid Panel",
    "Thyroid Stimulating Hormone (TSH)",
    "Liver Function Tests (LFTs)",
    "Urinalysis (UA)",
    "Blood Glucose Test",
    "Electrolyte Panel",
    "Coagulation Panel",
    "Serum Lipase",
    "Cultures (e.g., blood culture, urine culture)",
    "Arterial Blood Gas (ABG)",
    "C-reactive Protein (CRP)",
    "Erythrocyte Sedimentation Rate (ESR)",
    "Troponin Test",
    "Prothrombin Time (PT)",
    "Activated Partial Thromboplastin Time (aPTT)",
    "D-Dimer Test",
    "Hemoglobin A1c (HbA1c)",
    "Prostate-Specific Antigen (PSA) Test",
    "HIV Test",
    "Hepatitis Panel",
    "Serum Creatinine",
    "Blood Urea Nitrogen (BUN)",
    "Amylase",
    "Lipase",
    "Creatine Kinase (CK) Test",
    "Ferritin Test",
    "Folate Test",
    "Vitamin B12 Test",
    "Iron Panel",
    "Magnesium Test",
    "Phosphorus Test",
    "Potassium Test",
    "Sodium Test",
    "Calcium Test",
    "Hematocrit Test",
    "Hemoglobin Test",
    "Platelet Count",
    "White Blood Cell (WBC) Count",
    "Red Blood Cell (RBC) Count",
    "Cholesterol Test",
    "High-Density Lipoprotein (HDL) Test",
    "Low-Density Lipoprotein (LDL) Test",
    "Triglycerides Test",
  ];
  const [selected, setSelected] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");

  return (
    <WrapperBox>
      <br />
      <MainTypography variant="h5" sx={{ my: "1ch" }}>
        Tests
      </MainTypography>
      <FormControl sx={{ width: "100%", mb: "2ch" }} variant="outlined">
        <OutlinedInput
          id="outlined-adornment-weight"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
          }}
          endAdornment={
            <InputAdornment position="end">
              <FaSearch />
            </InputAdornment>
          }
          placeholder="search test"
          aria-describedby="outlined-weight-helper-text"
          inputProps={{
            "aria-label": "weight",
          }}
        />
      </FormControl>
      <br />

      <WrapperBox
        sx={{
          overflowY: "scroll",
          height: "50ch",
        }}
      >
        {commonLabTests
          .filter((test) => test.toLowerCase().includes(search.toLowerCase()))
          .map((lab) => (
            <WrapperBox
              onClick={() => setSelected(lab)}
              sx={{
                display: "flex",
                alignItems: "center",
                py: "1ch",
                px: "0.5ch",
                cursor: "pointer",
                backgroundColor: lab == selected ? "#e0e0e0" : "",
              }}
            >
              {lab == selected ? <FaRegCheckSquare /> : <FaRegSquare />}
              <MainTypography sx={{ ml: "1ch" }}>{lab}</MainTypography>
            </WrapperBox>
          ))}
      </WrapperBox>
    </WrapperBox>
  );
};
