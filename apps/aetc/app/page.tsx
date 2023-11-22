"use client";
import { useState } from "react";
import { NewStepper, CustomizedAccordions, MainButton } from "shared-ui/src";

export default function Home() {
  const [active, setActive] = useState(0);
  const steps = [
    { id: 1, label: "Vitals and other measures" },
    { id: 2, label: "Provisional Diagnosis" },
    { id: 3, label: "Investigations" },
  ];
  return (
    <>
      <br />
      <br />
      <CustomizedAccordions title="Test" steps={steps} active={active}>
        <>
          <MainButton title={"next"} onClick={() => setActive(1)} />
        </>
        <>
          <MainButton title={"next"} onClick={() => setActive(2)} />
        </>
        <></>
      </CustomizedAccordions>
    </>
  );
}
