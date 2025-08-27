import { ReactNode } from "react";
import { BasePopover } from "../popover";
import { Box, Typography } from "@mui/material";

type Prop = {
  handleClose: () => void;
  anchorEl: any;
  selectedSection: any;
  section: any;
  children: ReactNode;
  width?: string;
};

export const SVGPopover = ({
  handleClose,
  anchorEl,
  section,
  selectedSection,
  children,
  width = "30ch",
}: Prop) => {
  return (
    <BasePopover
      onClose={handleClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Box sx={{ padding: "1ch", width }}>
        <Typography variant="h5">{selectedSection.label}</Typography>
        <Typography>{section?.notes}</Typography>
        <Typography>
          {section?.description?.reduce(
            (acc: any, item: any) => {
              return acc + "," + item.id;
            },
            [""]
          )}
        </Typography>
        {children}
      </Box>
    </BasePopover>
  );
};
