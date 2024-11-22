import { MainTypography } from "@/components";
import {
  FaPlus,
  FaMinus,
  FaWpforms,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa6"; // Import FaMinus for collapse state
import { useNavigation } from "@/hooks";
import { Box, Typography, Collapse } from "@mui/material";
import { useState } from "react";

export const ConsultationCard = ({
  title,
  links,
  disabled,
  onClick,
}: {
  title: string;
  disabled?: boolean;
  links: Array<{ title: string; link: string; id?: any }>;
  onClick?: (params: any) => void;
}) => {
  const { navigateTo } = useNavigation();
  const [display, setDisplay] = useState(false);
  const disabledStyles = disabled
    ? {
        color: "gray", // Custom color for text
        backgroundColor: "lightgrey", // Custom background color
        cursor: "not-allowed",
        textTransform: "capitalize",
        borderRadius: "1px",
      }
    : {};

  const isMultiple = links.length > 1;

  return (
    <Box>
      <Box
        onClick={() => {
          if (isMultiple) return setDisplay(!display);
          navigateTo(links[0].link);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          px: "8px",
          py: "16px",
          backgroundColor: "#DDEEDD",
          borderRadius: "4px",
          color: "#006401",
          cursor: "pointer",
          mb: "4px",
          transition: "background-color 0.3s, color 0.3s",
          ...disabledStyles,
        }}
      >
        {isMultiple && (
          <Box
            sx={{
              transition: "transform 0.3s ease",
              transform: display ? "rotate(360deg)" : "rotate(0deg)",
            }}
          >
            {display ? <FaAngleUp /> : <FaAngleDown />}
          </Box>
        )}
        <MainTypography
          sx={{
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "17px",
            letterSpacing: "0em",
            textAlign: "left",
            ml: "1ch",
          }}
        >
          {isMultiple ? title : links[0].title}
        </MainTypography>
      </Box>

      <Collapse in={display} timeout={300}>
        {links.map(({ title, link, id }) => (
          <Row
            id={id}
            title={title}
            link={link}
            key={link + title}
            onClick={onClick}
          />
        ))}
      </Collapse>
    </Box>
  );
};

const Row = ({
  title,
  link,
  onClick,
  id,
}: {
  id?: any;
  title: string;
  link: string;
  onClick?: (params: any) => void;
}) => {
  const { navigateTo } = useNavigation();
  return (
    <Box
      onClick={() => {
        navigateTo(link);
        if (onClick) onClick(id);
      }}
      sx={{
        padding: "1ch",
        cursor: "pointer",
        my: "0.2ch",
        backgroundColor: "#fff",
        ml: "4ch",
        borderRadius: "0.5ch",
        border: "1px solid #ccc",
        transition: "background-color 0.3s, transform 0.3s", // Smooth hover effect
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <FaWpforms style={{ marginRight: "8px" }} />
        {title}
      </Typography>
    </Box>
  );
};
