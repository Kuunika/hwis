"use client";
import { useState } from "react";
import {
  MainButton,
  BaseTable,
  Stepper,
  StepperContainer,
} from "shared-ui/src";

export default function Page() {
  const columns = [{ field: "name" }, { field: "lastName" }];
  const [active, setActive] = useState(0);
  const steps = [
    { id: 1, label: "step one" },
    { id: 2, label: "step two" },
    { id: 3, label: "step three" },
  ];

  const rows = [{ id: 1 }];

  return (
    <StepperContainer steps={steps} active={active}>
      <>
        <BaseTable columns={columns} rows={rows} />
        <MainButton
          title="step 1"
          onClick={() => setActive(1)}
          variant="primary"
        />
      </>
      <MainButton
        title="step 2"
        onClick={() => setActive(2)}
        variant="secondary"
      />
      <MainButton title="step 3" onClick={() => {}} variant="primary" />
    </StepperContainer>
  );
}
