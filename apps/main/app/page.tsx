"use client";
import MainStepper from '../../../packages/shared-ui/src/newStepper/MainStepper';
export default function Page() {
  return (
    <div
      style={{
        margin: -4,
        padding: -4,
        backgroundColor: "#f0f0f0",
        minHeight: "110vh",
      }}
    >
      <MainStepper />
    </div>
  );
}
