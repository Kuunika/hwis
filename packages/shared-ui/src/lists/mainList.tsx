import { Box, SxProps, Typography } from "@mui/material";
import { FC } from "react";

type ListItem = {
  id: string | number;
  label: string;
};

type MainListProp = {
  listItems: ListItem[];
  sx?: SxProps;
  onClick?: (id: string | number) => void;
};

export const MainList: FC<MainListProp> = ({ listItems, onClick, sx }) => {
  return (
    <Box>
      {listItems.map(({ id, label }) => (
        <ListItem
          onClick={() => onClick && onClick(id)}
          key={id}
          id={id}
          label={label}
          sx={sx}
        />
      ))}
    </Box>
  );
};

type ListItemProps = {
  onClick?: () => void;
  sx?: SxProps;
};

const ListItem: FC<ListItemProps> = ({ id, label, onClick, sx }) => {
  const handleClick = () => onClick && onClick();

  return (
    <Typography
      onClick={handleClick}
      variant={"subtitle1"}
      sx={{ cursor: "pointer", ...sx }}
    >
      {label}
    </Typography>
  );
};
