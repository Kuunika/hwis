import { encounters } from "@/constants";

import { getPatientsEncounters } from "@/hooks/encounter";
import { useVisitDates } from "@/contexts/visitDatesContext";
import { useParameters, useSubmitEncounter } from "@/hooks";
import { MultiColumnNotes } from "./multiColumnDisplay";
import { PatientInfoTab, WrapperBox } from "@/components";
import { Panel } from "./panel";
import { formatClinicalNotesData } from "./formatters/formatClinicalNotes";
import { AddClinicalNotes } from "./addClinicalData";
import { getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { useClinicalNotes } from "@/hooks/useClinicalNotes";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { GyneacologyNotesPDFRef } from "../../[id]/gyneacology/components/generateGyneacologyNotesPDF";
import { MedicalInpatientNotesPDFRef } from "../../[id]/medicalInpatient/components/generateMedicalInpatientNotesPDF";
import { SurgicalNotesPDFRef } from "../../[id]/surgicalNotes/components/generateSurgicalNotesPDF";

export const ClinicalNotesUpdated = () => {
  const { params } = useParameters();
  const patientId = params.id as string;
  const { notes: clinicalNotes, refresh } = useClinicalNotes(patientId);
  const { selectedVisit } = useVisitDates();
  const [printoutTitle, setPrintoutTitle] = useState("All");
  const [filterSoapierState, setFilterSoapierState] = useState(false);
  const [filterAETCState, setFilterAETCState] = useState(false);
  const [filterSurgicalState, setFilterSurgicalState] = useState(false); // New state for surgical notes
  const [filterGyneacologyState, setFilterGyneacologyState] = useState(false); // New state for gyneacology notes
  const [filterMedicalInpatientState, setFilterMedicalInpatientState] =
    useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const pdfRef = useRef<SurgicalNotesPDFRef>(null);
  const gyneacologyRef = useRef<GyneacologyNotesPDFRef>(null);
  const medicalInpatientRef = useRef<MedicalInpatientNotesPDFRef>(null);
  const [loading, setLoading] = useState(true);

  const { handleSubmit } = useSubmitEncounter(
    encounters.CLINICAL_NOTES,
    () => ""
  );

  const printFunction = useReactToPrint({
    contentRef: contentRef,
  });

  // 2. REPLACE your current handlePrint function with this:
  const handlePrint = () => {
    // Check if surgical notes filter is active
    if (filterSurgicalState && pdfRef.current) {
      pdfRef.current.generatePDF();
    } else if (filterGyneacologyState && gyneacologyRef.current) {
      gyneacologyRef.current.generatePDF();
    } else if (filterMedicalInpatientState && medicalInpatientRef.current) {
      medicalInpatientRef.current.generatePDF();
    } else {
      // Use regular print for other cases (All, AETC, SOAPIER)
      printFunction();
    }
  };

  const getEncountersByType = (encounterTypeUuid: any) => {
    const {
      data: patientHistory,
      isLoading: historyLoading,
    }: { data: any; isLoading: any } = getPatientsEncounters(
      patientId,
      `encounter_type=${encounterTypeUuid}&visit=${selectedVisit?.uuid}`
    );
    if (!patientHistory) return [];
    return patientHistory[0]?.obs || [];
  };
  const addClinicalNote = (note: string) => {
    const data = { "Clinical notes construct": note };
    handleSubmit(getObservations(data, getDateTime())).then(() => refresh());
  };

const notesData = formatClinicalNotesData(getEncountersByType);


const filteredNotes= notesData.filter(notes=>{
    if (filterSoapierState) {
      return notes.title === "Soapier Notes";
    }
    if (filterAETCState) {
      return (
        notes.title === "Triage Information" ||
        notes.title === "Primary Survey" ||
        notes.title === "Secondary Survey" ||
        notes.title === "Patient Management Plan" ||
        notes.title === "Diagnosis" ||
        notes.title === "Investigation Plans"
      );
    }
    if (filterSurgicalState) {
      return notes.title === "Surgical Notes";
    }
    if (filterGyneacologyState) {
      return notes.title === "Gyneacology";
    }
    if (filterMedicalInpatientState) {
      return notes.title === "Medical Inpatient";
    }
    return true; // If no filters are active, include all notes
  });

  return (
    <Panel title="">
      <WrapperBox display={"flex"} justifyContent={"space-between"}>
        <AddClinicalNotes
          onAddNote={addClinicalNote}
          filterSoapierState={filterSoapierState}
          filterAETCState={filterAETCState}
          filterSurgicalState={filterSurgicalState} // Pass surgical filter state
          filterGyneacologyState={filterGyneacologyState}
          filterMedicalInpatientState={filterMedicalInpatientState}
          setFilterSoapierState={setFilterSoapierState}
          setFilterAETCState={setFilterAETCState}
          setFilterSurgicalState={setFilterSurgicalState} // Pass surgical filter setter
          setFilterGyneacologyState={setFilterGyneacologyState}
          setFilterMedicalInpatientState={setFilterMedicalInpatientState}
          onDownload={handlePrint}
          surgicalData={{
            title: "Surgical Notes",
            data: [
              ...getEncountersByType(encounters.SURGICAL_NOTES_TEMPLATE_FORM),
            ],
            removeObs: [],
          }} // ADD THIS LINE
          gyneacologyData={{
            title: "Gyneacology",
            data: [...getEncountersByType(encounters.GYNEACOLOGY_WARD)],
            removeObs: [],
          }}
          medicalInpatientData={{
            title: "Medical Inpatient",
            data: [...getEncountersByType(encounters.MEDICAL_IN_PATIENT)],
            removeObs: [],
          }}
          onClickFilterButton={setPrintoutTitle}
        />
      </WrapperBox>
      <div ref={contentRef}>
        <div>
          <PatientInfoTab />
          <div style={{ paddingTop: "10px" }}>
            <p
              style={{
                marginLeft: "10px",
              }}
            >
              Report type: {printoutTitle}
            </p>
            <div
              style={{
                fontWeight: 700,
                fontSize: "20px",
                // marginTop: "10px",
                textAlign: "center",
              }}
            >
              Clinical Notes
            </div>
          </div>
        </div>
        <MultiColumnNotes columns={2} data={filteredNotes} />
      </div>
    </Panel>
  );
};
