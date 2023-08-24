import React from "react";
import { MainButton } from "shared-ui/src";
import { defaultTheme } from "shared-ui/src";

export default function PatientNav() {
  let titles = [
    "Clinical Notes",
    "Investigations",
    "Results",
    "Medications",
    "Dispositions",
  ];

  return (
    <div>
      {titles.map((title, index) => {
        return (
          <MainButton
            key={index}
            variant="secondary"
            title={title}
            onClick={() => {}}
            sx={{ backgroundColor: "red" }}
          />
        );
      })}
    </div>
  );
}
