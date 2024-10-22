import { FormValueLabel } from "@/interfaces";
import { Box, Typography } from "@mui/material";

export const DataBox = ({ labelValue }: { labelValue: FormValueLabel }) => {
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
      width="100%"
      maxWidth="250px"
      border="1px solid #E0E0E0"
      p="6px"
      m="2px"
      bgcolor="white"
    >
      <Typography variant="h6" fontWeight="600" gutterBottom>
        {labelValue.section}
      </Typography>
      <Box>
        {labelValue.formValues.map(({ label, value }, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            borderBottom="1px solid #F0F0F0"
          >
            <Typography
              variant="body2"
              fontWeight="500"
              color="textSecondary"
              flex="2"
            >
              {label}:
            </Typography>
            <Typography
              variant="body2"
              flex="2"
              ml={2}
              color="textPrimary"
              //   wordBreak="break-word"
              whiteSpace="normal"
            >
              {renderValues(value)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
