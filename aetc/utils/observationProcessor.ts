// utils/observationProcessor.ts
import * as yup from "yup";
import { getTestStatusOptions } from "@/config/testOptions";

// Helper function to determine field type
export const getFieldType = (fieldName: string, label: string): string => {
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
export const processObservations = (
  obs: any,
  values: any,
  validationRules: any,
  validationConfig: any
) => {
  // Simple validity check
  if (!obs) return null;

  const testStatusOptions = getTestStatusOptions();

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
        obs_id: obs.obs_id,
        options: testStatusOptions,
      };
    }

    // Default to text field
    return {
      type: fieldType,
      name: fieldName,
      label: label,
      obs_id: obs.obs_id,
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
    validationRules[fieldName] = validationConfig[fieldName] || yup.string();

    // Determine field type
    const fieldType = getFieldType(fieldName, label);

    // Add field to section
    sectionItems.push({
      type: fieldType,
      name: fieldName,
      label: label,
      obs_id: child.obs_id,
    });
  });

  // Return section with its children
  return {
    type: "section",
    title: obs.value,
    items: sectionItems,
  };
};
