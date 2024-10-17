import { MainTypography, WrapperBox } from "@/components";
import { FaPlus, FaMinus, FaWpforms } from "react-icons/fa6"; // Import FaMinus for collapse state
import { useNavigation } from "@/hooks";
import { Box, Typography, Collapse } from "@mui/material";
import { useState } from "react";

export const ConsultationCard = ({
  title,
  links,
  disabled,
}: {
  title: string;
  disabled?: boolean;
  links: Array<{ title: string; link: string }>;
}) => {
  const [display, setDisplay] = useState(false);

  const { navigateTo } = useNavigation();
  const disabledStyles = disabled
    ? {
        color: "gray", // Custom color for text
        backgroundColor: "lightgrey", // Custom background color
        cursor: "not-allowed",
        textTransform: "capitalize",
        borderRadius: "1px",
      }
    : {};

  return (
    <Box>
      <Box
        onClick={() => {
          setDisplay(!display);
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
        <Box
          sx={{
            transition: "transform 0.3s ease",
            transform: display ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {display ? <FaMinus /> : <FaPlus />}
        </Box>
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
          {title}
        </MainTypography>
      </Box>

      <Collapse in={display} timeout={300}>
        {links.map(({ title, link }) => (
          <Row title={title} link={link} key={link} />
        ))}
      </Collapse>
    </Box>
  );
};

const Row = ({ title, link }: { title: string; link: string }) => {
  const { navigateTo } = useNavigation();
  return (
    <Box
      onClick={() => navigateTo(link)}
      sx={{
        padding: "1ch",
        cursor: "pointer",
        my: "0.2ch",
        backgroundColor: "#fff",
        ml: "5ch",
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
