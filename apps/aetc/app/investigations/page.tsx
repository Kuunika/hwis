"use client";
import {
  InformationBox,
  InformationRow,
  InvestigationsForm,
} from "./components";

export default function Investigations() {
  const initialValues = {};

  const handleSubmit = () => {};
  return (
    <>
      <InvestigationsForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </>
  );
}
