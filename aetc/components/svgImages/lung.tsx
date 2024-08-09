import { ReactSVG } from "react-svg";
import styles from "./styles/lung.module.css";
import { useEffect } from "react";
import {ReactComponent as ImportedSVG} from "../../assets/lung.svg"

export const LungImage = () => {
  useEffect(() => {
    const rightMiddleLobe = document.getElementById("right_middle_lobe-6");
    if (rightMiddleLobe) {
      rightMiddleLobe.style.fill = "yellow";
      rightMiddleLobe.style.cursor = "pointer";
    }
    console.log(rightMiddleLobe)
  }, []);

  return (
    <div>
      <ReactSVG
        src={"/lung.svg"}
        beforeInjection={(svg) => {
          svg.setAttribute("width", "500");
          svg.setAttribute("height", "500");
        }}
      />
    </div>
  );
};
