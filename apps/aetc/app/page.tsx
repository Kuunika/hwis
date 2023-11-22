"use client";

import { useState } from "react";
import { MainButton, MainGrid, NewStepperContainer } from "shared-ui/src";

export default function Home() {
  const [active, setActive] = useState(0);
  const steps = [
    { id: 1, label: "Vitals and other measures" },
    { id: 2, label: "Provisional Diagnosis" },
    { id: 3, label: "Investigations" },
  ];
  return (
    <>
      <MainGrid container>
        <MainGrid item lg={1}></MainGrid>
        <MainGrid item lg={9}>
          <br />
          <br />
          <NewStepperContainer title="Test" steps={steps} active={active}>
            <>
              <MainButton title={"next"} onClick={() => setActive(1)} />
            </>
            <>
              <MainButton title={"next"} onClick={() => setActive(2)} />
            </>
            <>
              <MainButton title={"complete"} onClick={() => setActive(2)} />
            </>
          </NewStepperContainer>
        </MainGrid>
        <MainGrid item lg={2}></MainGrid>
      </MainGrid>
    </>
  );
}
