// components/FormRenderer.tsx
import React from "react";
import {
  FormFieldContainerMultiple,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import { Box, Typography } from "@mui/material";
import { getTestStatusOptions } from "@/config/testOptions";

interface FormRendererProps {
  formStructure: any[];
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  formStructure,
}) => {
  const testStatusOptions = getTestStatusOptions();

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

  return (
    <>{formStructure.map((component) => renderFormComponent(component))}</>
  );
};
