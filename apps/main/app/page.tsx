"use client";
import { MainButton, BaseTable, Stepper } from "shared-ui/src";

export default function Page() {
  const columns = [{ field: "name" }];
  const steps = [
    { id: 1, label: "step one", active: false },
    { id: 2, label: "step two", active: true },
    { id: 3, label: "step three", active: false },
  ];

  return <Stepper steps={steps} />;
}
