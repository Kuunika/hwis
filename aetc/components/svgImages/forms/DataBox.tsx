import { useState } from "react";
import { FormValueLabel } from "@/interfaces";
import { Box, Typography, IconButton, Collapse, Button } from "@mui/material";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export const DataBox = ({
  labelValue,
  maxWidth = "250px",
  onDelete,
}: {
  labelValue: FormValueLabel;
  maxWidth?: string;
  onDelete?: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const renderValues = (values: any) => {
    if (Array.isArray(values)) {
      return values.reduce((acc, current, currentIndex) => {
        const separator = currentIndex === 0 ? "" : ", ";
        return `${acc}${separator}${current.label}`;
      }, "");
    }
    return values;
  };

  return (
    <Box
      maxWidth={expanded ? "100%" : maxWidth}
      flexGrow={expanded ? 1 : 0}
      sx={{
        width: "100%",
        minWidth: "250px",
        transition: "max-width 0.3s ease",
        border: "1px solid #E0E0E0",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        m: "8px 2px",
        bgcolor: "white",
      }}
    >
      {/* Section Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p="16px"
        sx={{ cursor: "pointer" }}
        onClick={handleToggle}
      >
        <Typography variant="h6" fontWeight="600">
          {labelValue.section}
        </Typography>
        <IconButton size="small" aria-label="expand">
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </IconButton>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box p="16px">
          {labelValue.formValues.map(({ label, value }, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="flex-start"
              justifyContent="space-between"
              my={1}
              borderBottom="1px solid #F0F0F0"
              py={1}
            >
              <Typography
                variant="body2"
                fontWeight="500"
                color="textSecondary"
                flex="1"
              >
                {label}:
              </Typography>
              <Typography
                variant="body2"
                flex="2"
                ml={2}
                color="textPrimary"
                whiteSpace="normal"
              >
                {renderValues(value)}
              </Typography>
            </Box>
          ))}
        </Box>
        {onDelete && (
          <Button sx={{ color: "red" }} onClick={onDelete}>
            Delete
          </Button>
        )}
      </Collapse>
    </Box>
  );
};
