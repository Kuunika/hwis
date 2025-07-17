import {
  FormFieldContainerMultiple,
  FormikInit,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { getDateTime } from "@/helpers/dateTime";
import { getActivePatientDetails } from "@/hooks";
import { Bounce, toast } from "react-toastify";
import {
  addEncounter,
  fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Collapse,
  Button,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";

// Define type for section keys
type SectionKey =
  | "arterialVenousBloodGasMain" // New top-level section
  | "bloodGasValues"
  | "oximetryValues"
  | "electrolyteValues"
  | "metabolicValues"
  | "temperatureCorrectedValues"
  | "acidBaseStatus";

// Define types for form field
interface FormField {
  name: string; // This will now be the same as label and the concept name
  label: string;
}

// Define types for section state
interface SectionState {
  open: boolean;
  selectedFields: Record<string, boolean>; // Keys will be the labels (which are now also the names)
}

// This object centralizes the definition of concept names (which are also their labels).
// This ensures consistency and avoids hardcoding strings directly in formConfig.
const bloodGasConcepts = {
  PH: "pH",
  PCO2: "pCO₂ (mmHg)",
  PO2: "pO₂ (mmHg)",
  CTHB: "c_tHb (g/dL)",
  SO2: "sO₂ (%)",
  FO2HB: "FO₂Hb (%)",
  FHHB: "FHHb (%)",
  FMETHB: "FmetHb (%)",
  CK: "cK⁺ (mmol/L)",
  CNA: "cNa⁺ (mmol/L)",
  CA2: "cCa²⁺ (mmol/L)",
  CCL: "cCl⁻ (mmol/L)",
  GLU: "cGlu (mmol/L)",
  LAC: "cLac (mmol/L)",
  CTBIL: "ctBil (µmol/L)",
  PH_T: "pH (T)",
  PCO2_T: "pCO₂ (T) mmHg",
  PO2_T: "pO₂ (T) mmHg",
  P50E: "P50e",
  BASE_EXCESS: "cBaseExcess (Ecf)c",
  HCO3: "cHCO₃⁻ (P,st)c",
  ANION_GAP: "Amion Gap",
  MOSM: "cmOSm",
};

// formConfig now uses the centralized bloodGasConcepts for both name and label
const formConfig = {
  PH: { name: bloodGasConcepts.PH, label: bloodGasConcepts.PH },
  PCO2: { name: bloodGasConcepts.PCO2, label: bloodGasConcepts.PCO2 },
  PO2: { name: bloodGasConcepts.PO2, label: bloodGasConcepts.PO2 },
  CTHB: { name: bloodGasConcepts.CTHB, label: bloodGasConcepts.CTHB },
  SO2E: { name: bloodGasConcepts.SO2, label: bloodGasConcepts.SO2 },
  FO2HBE: { name: bloodGasConcepts.FO2HB, label: bloodGasConcepts.FO2HB },
  FHHBE: { name: bloodGasConcepts.FHHB, label: bloodGasConcepts.FHHB },
  FMETHB: { name: bloodGasConcepts.FMETHB, label: bloodGasConcepts.FMETHB },
  CK: { name: bloodGasConcepts.CK, label: bloodGasConcepts.CK },
  CNA: { name: bloodGasConcepts.CNA, label: bloodGasConcepts.CNA },
  CA2: { name: bloodGasConcepts.CA2, label: bloodGasConcepts.CA2 },
  CCL: { name: bloodGasConcepts.CCL, label: bloodGasConcepts.CCL },
  glucose: { name: bloodGasConcepts.GLU, label: bloodGasConcepts.GLU },
  LACTATE: { name: bloodGasConcepts.LAC, label: bloodGasConcepts.LAC },
  CTBIL: { name: bloodGasConcepts.CTBIL, label: bloodGasConcepts.CTBIL },
  PH_T: { name: bloodGasConcepts.PH_T, label: bloodGasConcepts.PH_T },
  PCO2_T: { name: bloodGasConcepts.PCO2_T, label: bloodGasConcepts.PCO2_T },
  PO2_T: { name: bloodGasConcepts.PO2_T, label: bloodGasConcepts.PO2_T },
  P50E: { name: bloodGasConcepts.P50E, label: bloodGasConcepts.P50E },
  BASE_EXCESS: { name: bloodGasConcepts.BASE_EXCESS, label: bloodGasConcepts.BASE_EXCESS },
  HCO3: { name: bloodGasConcepts.HCO3, label: bloodGasConcepts.HCO3 },
  ANION_GAPC: { name: bloodGasConcepts.ANION_GAP, label: bloodGasConcepts.ANION_GAP },
  MOSMC: { name: bloodGasConcepts.MOSM, label: bloodGasConcepts.MOSM },
};

// Define the structure of the form sections, including parent-child relationships
const sectionDefinitions: { [key in SectionKey]: { title: string; fields?: FormField[]; subSections?: SectionKey[] } } = {
  arterialVenousBloodGasMain: {
    title: "Arterial/Venous Blood Gas",
    subSections: [
      "bloodGasValues",
      "oximetryValues",
      "electrolyteValues",
      "metabolicValues",
      "temperatureCorrectedValues",
      "acidBaseStatus",
    ],
  },
  bloodGasValues: {
    title: "Blood Gas Values",
    fields: [formConfig.PH, formConfig.PCO2, formConfig.PO2],
  },
  oximetryValues: {
    title: "Oximetry Values",
    fields: [formConfig.CTHB, formConfig.SO2E, formConfig.FO2HBE, formConfig.FHHBE, formConfig.FMETHB],
  },
  electrolyteValues: {
    title: "Electrolyte Values",
    fields: [formConfig.CK, formConfig.CNA, formConfig.CA2, formConfig.CCL],
  },
  metabolicValues: {
    title: "Metabolic Values",
    fields: [formConfig.glucose, formConfig.LACTATE, formConfig.CTBIL],
  },
  temperatureCorrectedValues: {
    title: "Temperature Corrected Values",
    fields: [formConfig.PH_T, formConfig.PCO2_T, formConfig.PO2_T, formConfig.P50E],
  },
  acidBaseStatus: {
    title: "Acid Base Status",
    fields: [formConfig.BASE_EXCESS, formConfig.HCO3, formConfig.ANION_GAPC, formConfig.MOSMC],
  },
};

export const BedsideTestPlanForm = () => {
  const { activeVisit, patientId, gender } = getActivePatientDetails();
  const { mutate, isPending, isSuccess } = fetchConceptAndCreateEncounter();

  // Initialize state for all sections (leaf sections will have selectedFields)
  const initializeSectionState = useCallback((): Record<SectionKey, SectionState> => {
    const initialState: Record<SectionKey, SectionState> = {} as Record<SectionKey, SectionState>;
    (Object.keys(sectionDefinitions) as SectionKey[]).forEach((key) => {
      const sectionDef = sectionDefinitions[key];
      initialState[key] = {
        open: false,
        selectedFields: {},
      };
      if (sectionDef.fields) {
        sectionDef.fields.forEach((field) => {
          initialState[key].selectedFields[field.name] = false; // Use field.name (which is now the label) as the key
        });
      }
    });
    return initialState;
  }, []);

  const [sections, setSections] = useState<Record<SectionKey, SectionState>>(initializeSectionState);

  // Helper to reset all form states
  const resetAllFormStates = useCallback(() => {
    setSections(initializeSectionState()); // Re-initialize all sections
  }, [initializeSectionState]);

  // Handle form submission
  const createObservationsObject = useCallback(() => {
    const observations: any[] = [];
    const dateTime = getDateTime();

    // Helper to add observations for a given section's selected fields
    const addSectionObservations = (sectionKey: SectionKey) => {
      const sectionDef = sectionDefinitions[sectionKey];
      const sectionState = sections[sectionKey];

      if (sectionDef.fields) { // Only process leaf sections with fields
        const selectedFields = sectionDef.fields.filter(
          (field) => sectionState.selectedFields[field.name] // Use field.name (which is now the label)
        );

        if (selectedFields.length > 0) {
          observations.push({
            concept: concepts.BEDSIDE_INVESTIGATIONS, // Group under a general concept
            obsDatetime: dateTime,
            value: sectionDef.title, // Use section title as value for grouping
            groupMembers: selectedFields.map((field) => ({
              concept: field.name, // Use field.name (which is now the label) as the concept
              obsDatetime: dateTime,
              value: true, // Indicates the test was selected/planned
            })),
          });
        }
      }
    };

    // Iterate through all leaf sections and add their selected fields
    sectionDefinitions.arterialVenousBloodGasMain.subSections?.forEach((key) => {
      addSectionObservations(key);
    });

    return observations;
  }, [sections]);


  const handleSubmit = useCallback((event: React.FormEvent | string): void => {
    if (typeof event !== 'string' && event) {
      event.preventDefault();
    }

    const obs = createObservationsObject();

    mutate({
      encounterType: encounters.BEDSIDE_INVESTIGATION_PLAN,
      visit: activeVisit,
      patient: patientId,
      encounterDatetime: getDateTime(),
      obs,
    });
    resetAllFormStates();
  }, [createObservationsObject, mutate, activeVisit, patientId, resetAllFormStates]);

  useEffect(() => {
    if (!isSuccess) return;
    toast.success("Bedside test plan submitted successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  }, [isSuccess]);

  // Toggle section open/closed
  const toggleSection = useCallback((sectionKey: SectionKey): void => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        open: !prev[sectionKey].open,
      },
    }));
  }, []);

  // Toggle a single field within a leaf section
  const toggleField = useCallback((sectionKey: SectionKey, fieldName: string): void => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        selectedFields: {
          ...prev[sectionKey].selectedFields,
          [fieldName]: !prev[sectionKey].selectedFields[fieldName],
        },
      },
    }));
  }, []);

  // Check if all fields in a leaf section are selected
  const areAllFieldsSelected = useCallback((sectionKey: SectionKey): boolean => {
    const sectionDef = sectionDefinitions[sectionKey];
    const sectionState = sections[sectionKey];
    if (!sectionDef.fields || sectionDef.fields.length === 0) return false; // Not applicable for parent sections or sections without fields
    return sectionDef.fields.every((field) => sectionState.selectedFields[field.name]); // Use field.name
  }, [sections]);

  // Check if some but not all fields in a leaf section are selected
  const areSomeFieldsSelected = useCallback((sectionKey: SectionKey): boolean => {
    const sectionDef = sectionDefinitions[sectionKey];
    const sectionState = sections[sectionKey];
    if (!sectionDef.fields || sectionDef.fields.length === 0) return false; // Not applicable for parent sections or sections without fields
    const selectedCount = sectionDef.fields.filter(
      (field) => sectionState.selectedFields[field.name] // Use field.name
    ).length;
    return selectedCount > 0 && selectedCount < sectionDef.fields.length;
  }, [sections]);

  // Toggle all fields in a leaf section
  const toggleAllFieldsInLeafSection = useCallback((sectionKey: SectionKey): void => {
    const sectionDef = sectionDefinitions[sectionKey];
    if (!sectionDef.fields) return; // Only for leaf sections

    const currentSectionState = sections[sectionKey];
    const allSelected = areAllFieldsSelected(sectionKey);
    const newSelectedState = !allSelected;

    const updatedSelectedFields = { ...currentSectionState.selectedFields };
    sectionDef.fields.forEach((field) => {
      updatedSelectedFields[field.name] = newSelectedState; // Use field.name
    });

    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        selectedFields: updatedSelectedFields,
        open: true, // Always open when toggling all
      },
    }));
  }, [sections, areAllFieldsSelected]);

  // Check if all fields in all child sections of a parent section are selected
  const areAllChildSectionsFieldsSelected = useCallback((parentSectionKey: SectionKey): boolean => {
    const parentDef = sectionDefinitions[parentSectionKey];
    if (!parentDef.subSections) return false;

    return parentDef.subSections.every(subSectionKey => {
      const subSectionDef = sectionDefinitions[subSectionKey];
      if (!subSectionDef.fields || subSectionDef.fields.length === 0) return true; // If sub-section has no fields, consider it "selected"
      return areAllFieldsSelected(subSectionKey);
    });
  }, [areAllFieldsSelected]);

  // Check if some fields in child sections of a parent section are selected
  const areSomeChildSectionsFieldsSelected = useCallback((parentSectionKey: SectionKey): boolean => {
    const parentDef = sectionDefinitions[parentSectionKey];
    if (!parentDef.subSections) return false;

    let selectedCount = 0;
    let totalCount = 0;

    parentDef.subSections.forEach(subSectionKey => {
      const subSectionDef = sectionDefinitions[subSectionKey];
      if (subSectionDef.fields) {
        totalCount += subSectionDef.fields.length;
        selectedCount += subSectionDef.fields.filter(
          field => sections[subSectionKey].selectedFields[field.name] // Use field.name
        ).length;
      }
    });
    return selectedCount > 0 && selectedCount < totalCount;
  }, [sections]);

  // Toggle all fields in all child sections of a parent section
  const toggleAllChildSectionsFields = useCallback((parentSectionKey: SectionKey): void => {
    const parentDef = sectionDefinitions[parentSectionKey];
    if (!parentDef.subSections) return;

    const allChildrenSelected = areAllChildSectionsFieldsSelected(parentSectionKey);
    const newSelectedState = !allChildrenSelected;

    setSections(prevSections => {
      const updatedSections = { ...prevSections };
      parentDef.subSections?.forEach(subSectionKey => {
        const subSectionDef = sectionDefinitions[subSectionKey];
        if (subSectionDef.fields) {
          const updatedSelectedFields = { ...updatedSections[subSectionKey].selectedFields };
          subSectionDef.fields.forEach(field => {
            updatedSelectedFields[field.name] = newSelectedState; // Use field.name
          });
          updatedSections[subSectionKey] = {
            ...updatedSections[subSectionKey],
            selectedFields: updatedSelectedFields,
            open: true, // Always open child sections when parent is toggled
          };
        }
      });
      // Also open the parent section itself
      updatedSections[parentSectionKey] = {
        ...updatedSections[parentSectionKey],
        open: true,
      };
      return updatedSections;
    });
  }, [areAllChildSectionsFieldsSelected]);

  // Component for rendering a leaf checkbox group
  const CheckboxGroup: React.FC<{ sectionKey: SectionKey }> = ({ sectionKey }) => {
    const sectionDef = sectionDefinitions[sectionKey];
    const sectionState = sections[sectionKey];
    const allSelected = areAllFieldsSelected(sectionKey);
    const someSelected = areSomeFieldsSelected(sectionKey);

    return (
      <Box sx={{ mb: 1, ml: 2 }}> {/* Indent leaf sections */}
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={() => toggleAllFieldsInLeafSection(sectionKey)}
              sx={{ color: "GrayText" }}
            />
          }
          label={
            <Typography
              color="GrayText"
              onClick={() => toggleSection(sectionKey)}
              sx={{
                fontSize: 16,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {sectionDef.title}
              {sectionState.open ? (
                <ExpandLess sx={{ ml: 1, fontSize: 20 }} />
              ) : (
                <ExpandMore sx={{ ml: 1, fontSize: 20 }} />
              )}
            </Typography>
          }
        />

        <Collapse in={sectionState.open}>
          <Box sx={{ pl: 4, mt: 1 }}>
            {sectionDef.fields?.map((field) => (
              <FormControlLabel
                key={field.name}
                control={
                  <Checkbox
                    checked={sectionState.selectedFields[field.name]} // Use field.name
                    onChange={() => toggleField(sectionKey, field.name)} // Use field.name
                    name={field.name}
                    id={field.name}
                  />
                }
                label={field.label}
              />
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };

  // Component for rendering a parent checkbox group (e.g., Arterial/Venous Blood Gas)
  const ParentCheckboxGroup: React.FC<{ sectionKey: SectionKey }> = ({ sectionKey }) => {
    const sectionDef = sectionDefinitions[sectionKey];
    const sectionState = sections[sectionKey]; // Parent section's open state
    const allChildrenSelected = areAllChildSectionsFieldsSelected(sectionKey);
    const someChildrenSelected = areSomeChildSectionsFieldsSelected(sectionKey);

    return (
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={allChildrenSelected}
              indeterminate={someChildrenSelected && !allChildrenSelected}
              onChange={() => toggleAllChildSectionsFields(sectionKey)}
              sx={{ color: "GrayText" }}
            />
          }
          label={
            <Typography
              color="GrayText"
              onClick={() => toggleSection(sectionKey)}
              sx={{
                fontSize: 16,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {sectionDef.title}
              {sectionState.open ? (
                <ExpandLess sx={{ ml: 1, fontSize: 20 }} />
              ) : (
                <ExpandMore sx={{ ml: 1, fontSize: 20 }} />
              )}
            </Typography>
          }
        />
        <Collapse in={sectionState.open}>
          <Box sx={{ pl: 4, mt: 1 }}>
            {sectionDef.subSections?.map((subSectionKey) => (
              <CheckboxGroup key={subSectionKey} sectionKey={subSectionKey} />
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <>
      <ContainerLoaderOverlay loading={isPending}>
        <FormGroup>
          {/* New Top-Level Arterial/Venous Blood Gas Group */}
          <ParentCheckboxGroup sectionKey="arterialVenousBloodGasMain" />
        </FormGroup>
        <Box sx={{ mb: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </ContainerLoaderOverlay>
    </>
  );
};
