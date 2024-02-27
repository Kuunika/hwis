import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { MainButton, MainTypography, WrapperBox } from "shared-ui/src";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { FaRegCheckSquare, FaRegSquare, FaSearch } from "react-icons/fa";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { LabRequest } from "@/interfaces";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  addRequest: (value: LabRequest) => void
}

export function LabRequestModal({ onClose, open, addRequest }: SimpleDialogProps) {
  const [searchSample, setSearchSample] = React.useState<string>("");
  const [searchSampleTypes, setSearchSampleTypes] = React.useState<string>("");
  const [searchSpecimenSites, setSearchSpecimenSites] =
    React.useState<string>("");
  const [request, setRequest] = React.useState<any>({})


  const handleClose = () => {
    console.log("closed");
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog maxWidth="lg" fullWidth={true} onClose={handleClose} open={open}>
      <DialogTitle>Lab Order</DialogTitle>
      <DialogContent>
        <WrapperBox display={"flex"}>
          <WrapperBox
            sx={{ width: { xs: "40%", lg: "30%" }, borderRight: "solid #e0e0e0 1px", px: "1ch" }}
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
            <TestList onSelectTest={(test: string | number) => setRequest((req: any) => ({ ...req, test }))} />
          </WrapperBox>
          <WrapperBox
            sx={{
              display: "flex",
              flexDirection: "column",
              width: { xs: "60%", lg: "70%" },
              px: "1ch",
            }}
          >
            <WrapperBox sx={{ mb: "2ch" }}>
              <MainButton
                sx={{ borderRadius: "1px" }}
                title={"Send Order"}
                onClick={() => addRequest({ ...request, id: Math.random(), status: "pending..." })}
              />
              <MainButton
                variant="secondary"
                sx={{ borderRadius: "1px", mx: "0.5ch" }}
                title={"Cancel Order"}
                onClick={handleListItemClick}
              />
            </WrapperBox>
            <WrapperBox sx={{ display: "flex", flexWrap: "wrap" }}>
              <WrapperBox sx={{ flex: { xs: '1 0 40%', lg: 1 }, mb: { xs: "3ch" } }}>
                <MainTypography variant="h5">Sample</MainTypography>
                <SearchInput setSearch={setSearchSample} />
                <ListSelect
                  onSelectItem={(sample: string | number) => setRequest((req: any) => ({ ...req, sample }))}
                  height="25ch"
                  list={samples}
                  search={searchSample}
                />
              </WrapperBox>
              <WrapperBox sx={{ flex: { xs: '1 0 40%', lg: 1 }, mx: 1 }}>
                <MainTypography variant="h5">Sample Types</MainTypography>
                <SearchInput setSearch={setSearchSampleTypes} />
                <ListSelect
                  onSelectItem={(sampleType: string | number) => { setRequest((req: any) => ({ ...req, sampleType })) }}
                  height="25ch"
                  list={sampleTypes}
                  search={searchSampleTypes}
                />
              </WrapperBox>
              <WrapperBox sx={{ flex: { xs: '1 0 40%', lg: 1 } }}>
                <MainTypography variant="h5">Specimen Site</MainTypography>
                <SearchInput setSearch={setSearchSpecimenSites} />
                <ListSelect
                  onSelectItem={(specimen: string | number) => { setRequest((req: any) => ({ ...req, specimen })) }}
                  height="25ch"
                  list={specimenSites}
                  search={searchSpecimenSites}
                />
              </WrapperBox>
            </WrapperBox>
          </WrapperBox>
        </WrapperBox>
      </DialogContent>
    </Dialog>
  );
}

// registration workflow, patient lists(screening, assessments, triage), dde search workflow,
// lab request form

export const TestList = ({ onSelectTest }: { onSelectTest: (test: string | number) => void }) => {
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
  const [search, setSearch] = React.useState<string>("");

  return (
    <WrapperBox>
      <br />
      <MainTypography variant="h5" sx={{ my: "1ch" }}>
        Tests
      </MainTypography>
      <SearchInput setSearch={setSearch} placeHolder="search test" />
      <br />
      <ListSelect onSelectItem={onSelectTest} list={commonLabTests} search={search} />
    </WrapperBox>
  );
};

export const SearchInput = ({
  setSearch,
  placeHolder = "search",
}: {
  setSearch: (search: string) => void;
  placeHolder?: string;
}) => {
  return (
    <FormControl sx={{ width: "100%", mb: "2ch" }} variant="outlined">
      <OutlinedInput
        id="outlined-adornment-weight"
        size="small"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(event.target.value);
        }}
        endAdornment={
          <InputAdornment position="end">
            <FaSearch />
          </InputAdornment>
        }
        placeholder={placeHolder}
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          "aria-label": "weight",
        }}
      />
    </FormControl>
  );
};

export const ListSelect = ({
  list,
  search = "",
  height = "50ch",
  onSelectItem
}: {
  list: Array<string>;
  search?: string;
  height?: string;
  onSelectItem: (item: string | number) => void
}) => {
  const [selected, setSelected] = React.useState<string>("");
  return (
    <WrapperBox
      sx={{
        overflowY: "scroll",
        height,
      }}
    >
      {list
        .filter((test) => test.toLowerCase().includes(search.toLowerCase()))
        .map((lab) => (
          <WrapperBox
            key={lab}
            onClick={() => { setSelected(lab); onSelectItem(lab) }}
            sx={{
              display: "flex",
              alignItems: "center",
              py: "1ch",
              px: "0.5ch",
              cursor: "pointer",
              backgroundColor: lab == selected ? "#DDEEDD" : "",
              color: lab == selected ? "#006401" : "",
            }}
          >
            {lab == selected ? <FaRegCheckSquare /> : <FaRegSquare />}
            <MainTypography sx={{ ml: "1ch" }}>{lab}</MainTypography>
          </WrapperBox>
        ))}
    </WrapperBox>
  );
};

const sampleTypes = [
  "Blood",
  "Urine",
  "Stool",
  "Saliva",
  "Sputum",
  "Tissue",
  "Cerebrospinal Fluid (CSF)",
  "Swabs",
  "Synovial Fluid",
  "Other Body Fluids (e.g., pleural fluid, peritoneal fluid, amniotic fluid)",
];

// Samples
const samples = [
  "Whole Blood",
  "Serum",
  "Plasma",
  "Red Blood Cells (RBCs)",
  "White Blood Cells (WBCs)",
  "Platelets",
  "Midstream urine",
  "First morning urine",
  "Random urine",
  "Fecal matter",
  "Saliva",
  "Induced Sputum",
  "Spontaneous Sputum",
  "Tissue biopsy",
  "Cerebrospinal Fluid",
  "Throat swab",
  "Nasal swab",
  "Skin swab",
  "Wound swab",
  "Joint Fluid",
];

// Specimen Sites
const specimenSites = [
  "Vein",
  "Artery",
  "Bladder",
  "Rectum",
  "Mouth",
  "Lung",
  "Brain",
  "Nasopharynx",
  "Skin",
  "Wound",
  "Joint",
];
