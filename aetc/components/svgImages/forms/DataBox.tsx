import { FormValueLabel } from "@/interfaces";
import { Box, Typography } from "@mui/material";

export const DataBox = ({ labelValue }: { labelValue: FormValueLabel }) => {
  const renderValues = (values: any) => {
    if (Array.isArray(values)) {
      return values.reduce((acc, current, currentIndex) => {
        const separator = currentIndex == 0 ? "" : ",";
        return `${acc}${separator} ${current.label}`;
      }, "");
    }
    return values;
  };

  return (
    <Box border="solid black 1px" p="2ch" m="1px">
      <Typography variant="h6">{labelValue.section}</Typography>
      <Box>
        {labelValue.formValues.map(({ label, value }) => {
          return (
            <Box display="flex" alignItems="center">
              <Typography variant="body2">{label}</Typography>:
              <Typography ml={1} variant="body2">
                {renderValues(value)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
