import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { CSSTransition } from "react-transition-group";
import "./slider.css";

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
  const [inProp, setInProp] = useState(true);

  const handleSlideChange = (index: number) => {
    setInProp(false);
    setTimeout(() => {
      setActiveIndex(index);
      setInProp(true);
    }, 300);
  };

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
            onClick={() => handleSlideChange(index)}
          >
            {slide.label}
          </Button>
        ))}
      </Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "200px", // Ensure consistent height
        }}
      >
        {slides.map((slide, index) => (
          <CSSTransition
            key={slide.id}
            in={index === activeIndex}
            timeout={300} // Match animation duration
            classNames="slide"
            unmountOnExit={false} // Do not unmount slides
          >
            <Box
              sx={{
                position: index === activeIndex ? "relative" : "absolute",
                width: "100%",
                height: "100%",
                opacity: index === activeIndex ? 1 : 0,
                transition: "opacity 300ms ease-in-out",
              }}
            >
              {slide.content}
            </Box>
          </CSSTransition>
        ))}
      </Box>
    </Box>
  );
};

export default ComponentSlider;
