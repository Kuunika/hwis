import {
  FormFieldContainerMultiple,
  FormikInit,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { concepts, encounters } from "@/constants";
import { getInitialValues } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { getActivePatientDetails } from "@/hooks";
import {
  addEncounter,
  fetchConceptAndCreateEncounter,
  getPatientsEncounters,
} from "@/hooks/encounter";
import { Box, Button, Typography } from "@mui/material";
import { Form } from "formik";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import * as yup from "yup";

const testStatusOptions = [
  { value: concepts.POSITIVE, label: "Positive" },
  { value: concepts.NEGATIVE, label: "Negative" },
  { value: concepts.INDETERMINATE, label: "Indeterminate" },
];

export const BedsideTestForm = ({ onClose }: { onClose?: () => void }) => {
  const { activeVisit, patientId } = getActivePatientDetails();

  const { mutate, isPending, isSuccess } = fetchConceptAndCreateEncounter();
  const { data: encounterData, refetch } = getPatientsEncounters(
    patientId as string,
    `encounter_type=${encounters.BEDSIDE_INVESTIGATION_PLAN}`
  );

  useEffect(() => {
    refetch();
  });
  console.log("🚀 ~ BedsideTestForm ~ bedsideTest:", encounterData);

  const [formStructure, setFormStructure] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [validationSchema, setValidationSchema] = useState(yup.object());

  // Process the encounter data to build form structure
  useEffect(() => {
    if (encounterData && encounterData?.length > 0) {
      const structure: any = [];
      const values: any = {};
      const validationRules: any = {};

      // Define validation rules mapping
      const validationConfig: any = {
        // Arterial Blood Gas
        "Arterial Blood Gas_pH": yup.number().min(7.35).max(7.45).label("pH"),
        "Arterial Blood Gas_PCO2": yup.number().min(35).max(45).label("PCO2"),
        "Arterial Blood Gas_PO2": yup.number().min(75).max(100).label("PO2"),
        "Arterial Blood Gas_Base Excess": yup
          .number()
          .min(-4)
          .max(2)
          .label("Base Excess"),
        "Arterial Blood Gas_LACTATE": yup
          .number()
          .min(0)
          .max(2)
          .label("Lactate"),
        "Arterial Blood Gas_SO2E": yup.number().min(95).max(100).label("SO2E"),
        "Arterial Blood Gas_P50E": yup.number().min(24).max(28).label("P50E"),
        "Arterial Blood Gas_HCO3": yup.number().min(3).max(7).label("HCO3"),

        // Electrolyte Values
        "Electrolyte Values_CK": yup.number().min(3.5).max(5.5).label("CK"),
        "Electrolyte Values_CNA": yup.number().min(135).max(145).label("CNA"),
        "Electrolyte Values_CA2": yup.number().label("CA2"),
        "Electrolyte Values_CCL": yup.number().label("CCL"),
        "Electrolyte Values_glucose": yup
          .number()
          .min(3)
          .max(7)
          .label("Glucose"),
        "Electrolyte Values_ANION_GAPC": yup.number().label("Anion Gap"),
        "Electrolyte Values_MOSMC": yup.number().label("MOSMC"),
        "Electrolyte Values_FO2HBE": yup.number().label("FO2HBE"),
        "Electrolyte Values_FHHBE": yup.number().label("FHHBE"),

        // Dipstick
        Dipstick_urobilinogen: yup.string().label("Urobilinogen"),
        Dipstick_leukocytes: yup.string().label("Leukocytes"),
        Dipstick_bilirubin: yup.string().label("Bilirubin"),
        Dipstick_glucose: yup.string().label("Glucose"),
        "Dipstick_Specific Gravity": yup.string().label("Specific Gravity"),
        Dipstick_protein: yup.string().label("Protein"),
        Dipstick_nitrite: yup.string().label("Nitrite"),
        Dipstick_ketones: yup.string().label("Ketones"),
        Dipstick_blood: yup.string().label("Blood"),

        // Tests
        mrdt: yup.string().required().label("MRDT"),
        pregnancyTest: yup.string().label("Pregnancy Test"),
        hiv: yup.string().label("HIV"),
        vdrl: yup.string().label("VDRL"),
        pocus: yup.string().label("POCUS"),
        ecg: yup.string().label("ECG"),
        other: yup.string().label("Other"),
      };

      // Helper function to determine field type
      const getFieldType = (fieldName: any, label: any) => {
        if (
          label.includes("HIV") ||
          label.includes("Test") ||
          label.includes("MRDT") ||
          fieldName.includes("Pregnancy test") ||
          fieldName.includes("vdrl") ||
          fieldName.includes("pocus") ||
          fieldName.includes("ecg")
        ) {
          return "radio";
        }

        // Check if field should be numeric
        if (
          fieldName.includes("pH") ||
          fieldName.includes("PCO2") ||
          fieldName.includes("PO2") ||
          fieldName.includes("CK") ||
          fieldName.includes("CNA") ||
          fieldName.includes("glucose") ||
          fieldName.includes("BASE_EXCESS") ||
          fieldName.includes("LACTATE")
        ) {
          return "number";
        }

        return "text";
      };

      // Helper function to process individual obs
      const processObs = (obs: any) => {
        // Simple validity check
        if (!obs) return null;

        // If it's a standalone test (like MRDT, HIV)
        if (!obs.children || obs.children.length === 0) {
          const label =
            obs.names && obs.names[0]
              ? obs.names[obs.names.length - 1].name
              : `Field ${obs.concept_id}`;
          const fieldName = `${label}`;

          // Add to values
          values[fieldName] = obs.value || "";

          // Apply validation from config or default
          const fieldNameKey = fieldName.toLowerCase().replace(/\s+/g, "");
          validationRules[fieldName] =
            validationConfig[fieldName] ||
            validationConfig[fieldNameKey] ||
            yup.string();

          // Determine field type
          const fieldType = getFieldType(fieldName, label);

          // Return appropriate component
          if (fieldType === "radio") {
            return {
              type: "radio",
              name: fieldName,
              label: label,
              options: testStatusOptions,
            };
          }

          // Default to text field
          return {
            type: fieldType,
            name: fieldName,
            label: label,
            multiline: label.includes("Notes") || label.includes("Description"),
          };
        }

        // If it's a section with children
        const sectionItems: any = [];

        // Process each child in the section
        obs.children.forEach((child: any) => {
          const label =
            child.names && child.names[0]
              ? child.names[0].name
              : `Field ${child.concept_id}`;
          const fieldName: any = `${obs.value}_${label}`;

          // Add to values
          values[fieldName] = child.value || "";

          // Apply validation from config or default
          validationRules[fieldName] =
            validationConfig[fieldName] || yup.string();

          // Determine field type
          const fieldType = getFieldType(fieldName, label);

          // Add field to section
          sectionItems.push({
            type: fieldType,
            name: fieldName,
            label: label,
          });
        });

        // Return section with its children
        return {
          type: "section",
          title: obs.value,
          items: sectionItems,
        };
      };
      const latestDatetime = encounterData[0]?.obs.reduce((latest, item) => {
        return new Date(item.obs_datetime) > new Date(latest)
          ? item.obs_datetime
          : latest;
      }, encounterData[0]?.obs[0]?.obs_datetime);

      // Step 2: Filter all objects that have that latest obs_datetime
      const latestItems = encounterData[0]?.obs.filter(
        (item) => item.obs_datetime === latestDatetime
      );
      console.log("🚀 ~ useEffect ~ latestItems:", latestItems);
      // Process all observations
      if (latestItems && Array.isArray(latestItems)) {
        latestItems.forEach((obs) => {
          const processedObs = processObs(obs);
          if (processedObs) {
            structure.push(processedObs);
          }
        });
      }

      // Properly set state with processed data
      setFormStructure(structure);
      setInitialValues(values);

      // Create validation schema with error handling
      try {
        if (Object.keys(validationRules).length > 0) {
          const schema = yup.object().shape(validationRules);
          setValidationSchema(schema);
          console.log("Validation schema created successfully");
        } else {
          console.warn("No validation rules defined");
          setValidationSchema(yup.object());
        }
      } catch (error) {
        console.error("Error creating validation schema:", error);
        setValidationSchema(yup.object());
      }
    }
  }, [encounterData]);

  // Debug to check if validation schema and initial values are set properly
  useEffect(() => {
    console.log("Current validation schema:", validationSchema);
    console.log("Current initial values:", initialValues);
  }, [validationSchema, initialValues]);

  // Render form components based on structure
  const renderFormComponent = (component: any) => {
    if (!component) return null;

    switch (component.type) {
      case "section":
        return (
          <Box key={component.title} sx={{ mb: 4 }}>
            <Typography variant="h6" color="GrayText" sx={{ mb: 2 }}>
              {component.title}
            </Typography>
            {component.items.length > 0 && (
              <FormFieldContainerMultiple>
                {component.items.map((item: any) => renderFormComponent(item))}
              </FormFieldContainerMultiple>
            )}
          </Box>
        );

      case "text":
        return (
          <TextInputField
            key={component.name}
            id={component.name}
            name={component.name}
            label={component.label}
            multiline={component.multiline}
            rows={component.multiline ? 4 : 1}
          />
        );

      case "number":
        return (
          <TextInputField
            key={component.name}
            id={component.name}
            name={component.name}
            label={component.label}
            type="number"
          />
        );

      case "radio":
        return (
          <RadioGroupInput
            key={component.name}
            name={component.name}
            label={component.label}
            options={component.options || testStatusOptions}
          />
        );

      default:
        return null;
    }
  };

  const transformLabValues = (
    inputObj: any,
    dateTime = new Date().toISOString()
  ) => {
    // Extract concept groups from the keys
    const groups: any = {};

    for (const key in inputObj) {
      // Split the key by underscore to get the group name and concept
      const [groupName, ...conceptParts] = key.split("_");
      const concept = conceptParts.join("_"); // Rejoin in case concept had underscores

      // Initialize group if it doesn't exist
      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      // Add the concept and value to the group
      groups[groupName].push({
        concept: concept,
        obsDatetime: dateTime,
        value: inputObj[key],
      });
    }

    // Create the final structure as an array of objects
    const result = [];

    for (const groupName in groups) {
      result.push({
        concept: concepts.DESCRIPTION || "DESCRIPTION",
        obsDatetime: dateTime,
        value: groupName,
        group_members: groups[groupName],
      });
    }

    return result;
  };
  useEffect(() => {
    if (!isSuccess) return;
    toast.success("Bedside test submitted successfully!", {
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
  const handleSubmit = (values: any) => {
    const dateTime = getDateTime();
    const transformedData = transformLabValues(values, dateTime);
    if (transformedData.length > 0) {
      mutate({
        encounterType: encounters.BED_SIDE_TEST,
        visit: activeVisit,
        patient: patientId,
        encounterDatetime: dateTime,
        obs: transformedData,
      });
    }
    onClose?.();
  };

  return (
    <ContainerLoaderOverlay loading={isPending}>
      <FormikInit
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        initialValues={initialValues} // Fixed: pass actual object not empty string
      >
        <Form>
          {formStructure.map((component) => renderFormComponent(component))}
        </Form>
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
