"use client";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";

interface Slide {
  id: string | number;
  label: string;
  content: React.ReactNode;
}

interface Props {
  slides: Slide[];
}

const ComponentSlider = ({ slides }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {slides.map((slide, index) => (
          <Button
            key={slide.id}
            variant={index === activeIndex ? "contained" : "outlined"}
            onClick={() => setActiveIndex(index)}
          >
            {slide.label}
          </Button>
        ))}
      </Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "200px",
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            sx={{
              position: index === activeIndex ? "relative" : "absolute",
              width: "100%",
              height: "100%",
              opacity: index === activeIndex ? 1 : 0,
              transition: "opacity 300ms ease-in-out",
              pointerEvents: index === activeIndex ? "auto" : "none",
            }}
          >
            {slide.content}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ComponentSlider;
