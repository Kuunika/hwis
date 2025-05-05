import {
  FormFieldContainerMultiple,
  FormikInit,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { getInitialValues } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { getActivePatientDetails } from "@/hooks";
import {
  addEncounter,
  fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import React from "react";
import * as yup from "yup";
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
// Define type for section keys
type SectionKey =
  | "arterialBloodGas"
  | "metabolicValues"
  | "acidBaseStatus"
  | "oximetryValues"
  | "electrolyteValues"
  | "temperatureCorrectedValues"
  | "pregnancyTest"
  | "dipstick"
  | "additionalTests";

// Define types for form field
interface FormField {
  name: string;
  label: string;
  // Add other properties as needed
}

// Define types for section state
interface SectionState {
  open: boolean;
  selectedFields: Record<string, boolean>;
}

const formConfig = {
  mrdt: {
    name: concepts.MRDT,
    label: "MRDT",
    coded: true,
  },
  positive: {
    name: concepts.POSITIVE,
    label: "Positive",
  },
  negative: {
    name: concepts.NEGATIVE,
    label: "Negative",
  },
  indeterminate: {
    name: concepts.INDETERMINATE,
    label: "Indeterminate",
  },
  PH: {
    name: concepts.PH,
    label: "pH",
  },
  PCO2: {
    name: concepts.PCO2,
    label: "pCO2",
  },
  PO2: {
    name: concepts.PO2,
    label: "pO2",
  },
  BASE_EXCESS: {
    name: concepts.BASE_EXCESS,
    label: "Base Excess",
  },
  LACTATE: {
    name: concepts.LACTATE,
    label: "Lactate",
  },
  glucose: {
    name: concepts.GLUCOSE,
    label: "Glucose",
  },
  HCO3: {
    name: concepts.HCO3,
    label: "HCO-3",
  },
  ANION_GAPC: {
    name: concepts.ANION_GAPC,
    label: "Anion gapc",
  },
  MOSMC: {
    name: concepts.MOSMC,
    label: "mOsmc",
  },
  SO2E: {
    name: concepts.SO2E,
    label: "sO2e",
  },
  FO2HBE: {
    name: concepts.FO2HBE,
    label: "FO2Hbe",
  },
  FHHBE: {
    name: concepts.FHHBE,
    label: "FHHBe",
  },
  CK: {
    name: concepts.CK,
    label: "cK",
  },
  CNA: {
    name: concepts.CNA,
    label: "cNa",
  },
  CA2: {
    name: concepts.CA2,
    label: "Ca2+",
  },
  CCL: {
    name: concepts.CCL,
    label: "cCl-",
  },
  P50E: {
    name: concepts.P50E,
    label: "p50e",
  },
  pregnancyTest: {
    name: concepts.PREGNANCY_TEST,
    label: "Pregnancy Test",
    coded: true,
  },
  hiv: {
    name: concepts.HIV,
    label: "HIV",
    coded: true,
  },
  vdrl: {
    name: concepts.VDRL,
    label: "VDRL",
    coded: true,
  },
  urobilinogen: {
    name: concepts.UROBILINOGEN,
    label: "Urobilinogen",
  },
  leukocytes: {
    name: concepts.LEUKOCYTES,
    label: "Leukocytes",
  },
  bilirubin: {
    name: concepts.BILIRUBIN,
    label: "Bilirubin",
  },
  specificGravity: {
    name: concepts.SPECIFIC_GRAVITY,
    label: "Specific Gravity",
  },
  nitrite: {
    name: concepts.NITRITE,
    label: "Nitrite",
  },
  ketones: {
    name: concepts.KETONES,
    label: "Ketones",
  },
  blood: {
    name: concepts.BLOOD,
    label: "Blood",
  },
  protein: {
    name: concepts.PROTEIN,
    label: "Protein",
  },
  pocus: {
    name: concepts.POINT_OF_CARE_ULTRASOUND,
    label: "Point of care ultrasound",
  },
  ecg: {
    name: concepts.ECG,
    label: "ECG",
  },
  pefr: {
    name: concepts.PEFR,
    label: "PEFR",
  },
  other: {
    name: concepts.OTHER,
    label: "Other",
  },
};

const testStatusOptions = [
  { value: concepts.POSITIVE, label: "Positive" },
  { value: concepts.NEGATIVE, label: "Negative" },
  { value: concepts.INDETERMINATE, label: "Indeterminate" },
];
const formValues = getInitialValues(formConfig);

export const BedsideTestPlanForm = () => {
  const { activeVisit, patientId, gender } = getActivePatientDetails();

  const { mutate, isPending, isSuccess } = fetchConceptAndCreateEncounter();
  const createObservationsObject = (dateTime: any): any[] => {
    const observations: any[] = [];

    // Helper function to add section data if it has selected fields
    const addSectionIfHasValues = (
      sectionKey: SectionKey,
      sectionTitle: string,
      fields: FormField[]
    ) => {
      // Filter only selected fields in this section
      const selectedFields = fields.filter(
        (field) => sections[sectionKey].selectedFields[field.name]
      );

      // Only add section if it has selected fields
      if (selectedFields.length > 0) {
        observations.push({
          concept: concepts.BEDSIDE_INVESTIGATIONS,
          obsDatetime: dateTime,
          value: sectionTitle,
          groupMembers: selectedFields.map((field) => ({
            concept: field.name,
            obsDatetime: dateTime,
            value: true, // Or any other value you want to assign
          })),
        });
      }
    };

    // Add all sections with their corresponding titles
    addSectionIfHasValues(
      "arterialBloodGas",
      "Arterial Blood Gas",
      fieldsBySection.arterialBloodGas
    );
    addSectionIfHasValues(
      "metabolicValues",
      "Metabolic Values",
      fieldsBySection.metabolicValues
    );
    addSectionIfHasValues(
      "acidBaseStatus",
      "Acid base status",
      fieldsBySection.acidBaseStatus
    );
    addSectionIfHasValues(
      "oximetryValues",
      "Oximetry Values",
      fieldsBySection.oximetryValues
    );
    addSectionIfHasValues(
      "electrolyteValues",
      "Electrolyte Values",
      fieldsBySection.electrolyteValues
    );
    addSectionIfHasValues(
      "temperatureCorrectedValues",
      "Temperature Corrected Values",
      fieldsBySection.temperatureCorrectedValues
    );
    addSectionIfHasValues("dipstick", "Dipstick", fieldsBySection.dipstick);
    addSectionIfHasValues(
      "additionalTests",
      "Additional Tests",
      fieldsBySection.additionalTests
    );

    // Add individual checkboxes if they're checked
    if (mrdtChecked) {
      observations.push({
        concept: formConfig.mrdt.name,
        obsDatetime: dateTime,
        value: true,
      });
    }

    if (hivChecked) {
      observations.push({
        concept: formConfig.hiv.name,
        obsDatetime: dateTime,
        value: true,
      });
    }

    if (vdrlChecked) {
      observations.push({
        concept: formConfig.vdrl.name,
        obsDatetime: dateTime,
        value: true,
      });
    }

    // Special handling for pregnancy test if gender is Female
    if (gender === "Female") {
      const pregnancyTestOptions = Object.entries(
        sections.pregnancyTest.selectedFields
      )
        .filter(
          ([key, isSelected]) =>
            isSelected && key.startsWith(`${formConfig.pregnancyTest.name}-`)
        )
        .map(([key]) => {
          // Extract the option value from the key (e.g., "pregnancyTest-positive" → "positive")
          const optionValue = key.split("-")[1];
          return {
            concept: `${formConfig.pregnancyTest.name}-${optionValue}`,
            obsDatetime: dateTime,
            value: true,
          };
        });

      if (pregnancyTestOptions.length > 0) {
        observations.push({
          concept: concepts.DESCRIPTION,
          obsDatetime: dateTime,
          value: "Pregnancy Test",
          groupMembers: pregnancyTestOptions,
        });
      }
    }

    return observations;
  };

  const handleSubmit = (event: any): void => {
    if (event) {
      event.preventDefault();
    }

    const dateTime = getDateTime();
    const obs = createObservationsObject(dateTime);

    mutate({
      encounterType: encounters.BEDSIDE_INVESTIGATION_PLAN,
      visit: activeVisit,
      patient: patientId,
      encounterDatetime: dateTime,
      obs,
    });
    resetAllFormStates();
  };

  const resetAllFormStates = (): void => {
    // Reset individual checkboxes
    setMRDTChecked(false);
    setHivChecked(false);
    setVdrlChecked(false);

    // Reset all section states to initial values
    setSections((prev) => {
      const resetState = {} as Record<SectionKey, SectionState>;

      // For each section, reset to initial state with all checkboxes unchecked
      (Object.keys(fieldsBySection) as SectionKey[]).forEach((section) => {
        resetState[section] = initializeSectionState(fieldsBySection[section]);
      });

      return resetState;
    });

    // Optionally, you could also close all sections
    // Or keep them open, depending on your UX preference
  };
  const initializeSectionState = (fields: FormField[]): SectionState => {
    const selectedFields: Record<string, boolean> = {};
    fields.forEach((field) => {
      selectedFields[field.name] = false;
    });
    return { open: false, selectedFields };
  };

  // Group fields by section for easier initialization
  const fieldsBySection: Record<SectionKey, FormField[]> = {
    arterialBloodGas: [
      formConfig.PH,
      formConfig.PCO2,
      formConfig.PO2,
      formConfig.BASE_EXCESS,
    ],
    metabolicValues: [formConfig.LACTATE, formConfig.glucose],
    acidBaseStatus: [formConfig.HCO3, formConfig.ANION_GAPC, formConfig.MOSMC],
    oximetryValues: [formConfig.SO2E, formConfig.FO2HBE, formConfig.FHHBE],
    electrolyteValues: [
      formConfig.CK,
      formConfig.CNA,
      formConfig.CA2,
      formConfig.CCL,
    ],
    temperatureCorrectedValues: [
      formConfig.PH,
      formConfig.PCO2,
      formConfig.PO2,
      formConfig.P50E,
    ],
    pregnancyTest: [formConfig.pregnancyTest],
    dipstick: [
      formConfig.urobilinogen,
      formConfig.PH,
      formConfig.leukocytes,
      formConfig.glucose,
      formConfig.specificGravity,
      formConfig.protein,
      formConfig.nitrite,
      formConfig.ketones,
      formConfig.bilirubin,
      formConfig.blood,
    ],
    additionalTests: [
      formConfig.pocus,
      formConfig.ecg,
      formConfig.pefr,
      formConfig.other,
    ],
  };

  // Initialize state
  const initialSections: Record<SectionKey, SectionState> = {} as Record<
    SectionKey,
    SectionState
  >;
  (Object.keys(fieldsBySection) as SectionKey[]).forEach((section) => {
    initialSections[section] = initializeSectionState(fieldsBySection[section]);
  });

  // Add separate state for HIV and VDRL checkboxes as main checkboxes
  const [hivChecked, setHivChecked] = React.useState(false);
  const [mrdtChecked, setMRDTChecked] = React.useState(false);
  const [vdrlChecked, setVdrlChecked] = React.useState(false);
  const [sections, setSections] =
    React.useState<Record<SectionKey, SectionState>>(initialSections);
  // const [gender, setGender] = React.useState<string>(""); // For gender-specific fields

  // Toggle section open/closed
  const toggleSection = (section: SectionKey): void => {
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        open: !prev[section].open,
      },
    }));
  };

  // Toggle all fields in a section
  const toggleAllFields = (section: SectionKey): void => {
    const currentSection = sections[section];
    const fieldsInSection = fieldsBySection[section];

    // Check if all fields are selected
    const allSelected = fieldsInSection.every(
      (field) => currentSection.selectedFields[field.name]
    );

    // Toggle to opposite state (all selected -> none selected, or some/none selected -> all selected)
    const newSelectedState = !allSelected;

    const updatedSelectedFields = { ...currentSection.selectedFields };
    fieldsInSection.forEach((field) => {
      updatedSelectedFields[field.name] = newSelectedState;
    });

    // Update state
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        selectedFields: updatedSelectedFields,
        open: true, // Always open when toggling all
      },
    }));
  };

  // Toggle a single field
  const toggleField = (section: SectionKey, fieldName: string): void => {
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        selectedFields: {
          ...prev[section].selectedFields,
          [fieldName]: !prev[section].selectedFields[fieldName],
        },
      },
    }));
  };

  // Check if all fields in a section are selected
  const areAllFieldsSelected = (section: SectionKey): boolean => {
    const sectionState = sections[section];
    const fields = fieldsBySection[section];
    return fields.every((field) => sectionState.selectedFields[field.name]);
  };

  // Check if some but not all fields are selected
  const areSomeFieldsSelected = (section: SectionKey): boolean => {
    const sectionState = sections[section];
    const fields = fieldsBySection[section];
    const selectedCount = fields.filter(
      (field) => sectionState.selectedFields[field.name]
    ).length;
    return selectedCount > 0 && selectedCount < fields.length;
  };

  // Props for the CheckboxGroup component
  interface CheckboxGroupProps {
    title: string;
    section: SectionKey;
    conditionalRender?: boolean;
  }

  // Checkbox Group Component
  const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    title,
    section,
    conditionalRender = true,
  }) => {
    if (!conditionalRender) return null;

    const sectionState = sections[section];
    const allSelected = areAllFieldsSelected(section);
    const someSelected = areSomeFieldsSelected(section);
    const fields = fieldsBySection[section];

    return (
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={() => toggleAllFields(section)}
              sx={{ color: "GrayText" }}
            />
          }
          label={
            <Typography
              color="GrayText"
              onClick={() => toggleSection(section)}
              sx={{
                fontSize: 16,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {title}
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
            {fields.map((field) => {
              return (
                <FormControlLabel
                  key={field.name}
                  control={
                    <Checkbox
                      checked={sectionState.selectedFields[field.name]}
                      onChange={() => toggleField(section, field.name)}
                      name={field.name}
                      id={field.name}
                    />
                  }
                  label={field.label}
                />
              );
            })}
          </Box>
        </Collapse>
      </Box>
    );
  };

  // For test status options (former radio buttons for pregnancy test)
  const TestStatusOption: React.FC<{
    section: SectionKey;
    field: FormField;
    optionValue: string;
    label: string;
  }> = ({ section, field, optionValue, label }) => {
    // Create a unique identifier for this specific option
    const optionId = `${field.name}-${optionValue}`;

    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={sections[section].selectedFields[optionId] || false}
            onChange={() => toggleField(section, optionId)}
            name={optionId}
            id={optionId}
          />
        }
        label={label}
      />
    );
  };

  // Additional component for pregnancy test field that had radio options
  const PregnancyTestField: React.FC<{ conditionalRender?: boolean }> = ({
    conditionalRender = true,
  }) => {
    if (!conditionalRender) return null;

    const section = "pregnancyTest";
    const field = formConfig.pregnancyTest;
    const sectionState = sections[section];

    return (
      <Box sx={{ mb: 1, pl: 4 }}>
        <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
          {testStatusOptions.map((option) => (
            <TestStatusOption
              key={`${field.name}-${option.value}`}
              section={section}
              field={field}
              optionValue={option.value}
              label={option.label}
            />
          ))}
        </Box>
      </Box>
    );
  };
  return (
    <>
      <FormGroup>
        <Box sx={{ mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={mrdtChecked}
                onChange={() => setMRDTChecked(!mrdtChecked)}
                sx={{ color: "GrayText" }}
                name={formConfig.mrdt.name}
                id={formConfig.mrdt.name}
              />
            }
            label={
              <Typography sx={{ fontSize: 16 }} color="GrayText">
                {formConfig.mrdt.label}
              </Typography>
            }
          />
        </Box>
        <CheckboxGroup title="Arterial Blood Gas" section="arterialBloodGas" />

        <CheckboxGroup title="Metabolic Values" section="metabolicValues" />

        <CheckboxGroup title="Acid Base Status" section="acidBaseStatus" />

        <CheckboxGroup title="Oximetry Values" section="oximetryValues" />

        <CheckboxGroup title="Electrolyte Values" section="electrolyteValues" />

        <CheckboxGroup
          title="Temperature Corrected Values"
          section="temperatureCorrectedValues"
        />

        {/* HIV as a main checkbox */}
        <Box sx={{ mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hivChecked}
                onChange={() => setHivChecked(!hivChecked)}
                sx={{ color: "GrayText" }}
                name={formConfig.hiv.name}
                id={formConfig.hiv.name}
              />
            }
            label={
              <Typography sx={{ fontSize: 16 }} color="GrayText">
                {formConfig.hiv.label}
              </Typography>
            }
          />
        </Box>

        {/* VDRL as a main checkbox */}
        <Box sx={{ mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={vdrlChecked}
                onChange={() => setVdrlChecked(!vdrlChecked)}
                sx={{ color: "GrayText", fontSize: 16 }}
                name={formConfig.vdrl.name}
                id={formConfig.vdrl.name}
              />
            }
            label={
              <Typography sx={{ fontSize: 16 }} color="GrayText">
                {formConfig.vdrl.label}
              </Typography>
            }
          />
        </Box>

        {/* Pregnancy Test as a main checkbox with options */}
        {gender === "Female" && (
          <Box sx={{ mb: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={areAllFieldsSelected("pregnancyTest")}
                  indeterminate={
                    areSomeFieldsSelected("pregnancyTest") &&
                    !areAllFieldsSelected("pregnancyTest")
                  }
                  onChange={() => toggleAllFields("pregnancyTest")}
                  sx={{ color: "GrayText" }}
                />
              }
              label={
                <Typography
                  variant="h6"
                  color="GrayText"
                  onClick={() => toggleSection("pregnancyTest")}
                  sx={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {formConfig.pregnancyTest.label}
                  {sections.pregnancyTest.open ? (
                    <ExpandLess sx={{ ml: 1, fontSize: 20 }} />
                  ) : (
                    <ExpandMore sx={{ ml: 1, fontSize: 20 }} />
                  )}
                </Typography>
              }
            />

            <Collapse in={sections.pregnancyTest.open}>
              <PregnancyTestField />
            </Collapse>
          </Box>
        )}

        <CheckboxGroup title="Dipstick" section="dipstick" />

        <CheckboxGroup title="Additional Tests" section="additionalTests" />
      </FormGroup>
      <Box sx={{ mb: 1 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            handleSubmit("");
          }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};
