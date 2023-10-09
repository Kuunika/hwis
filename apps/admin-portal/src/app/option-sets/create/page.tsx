"use client";
import { useState } from "react";
import {
  MainButton,
  MainPaper,
  MainTypography,
  StepperContainer,
  WrapperBox,
} from "shared-ui/src";

import * as UUID from "uuid";
import { TitleWithBack } from "@/components/common";
import { OptionForm, OptionSetForm } from "./components";
import { ListItem } from "@/components";

export default function () {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [options, setOptions] = useState<Array<any>>([]);

  const steps = [
    { id: 1, label: "Create Option Set" },
    { id: 2, label: "Options" },
  ];

  const handleSubmit = (values: any) => {
    fetch("http://localhost:3000/data-elements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, id: UUID.v4() }),
    }).then((response) => {
      console.log(response.json());
    });
  };

  const handleDelete = (id: string) => {
    console.log({ id });
    setOptions((opts) => opts.filter((opt) => opt.id != id));
  };
  return (
    <WrapperBox
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <MainPaper sx={{ p: 2, width: "40ch" }}>
        <TitleWithBack title="" />
        <br />
        <br />
        <StepperContainer steps={steps} active={activeStep}>
          <WrapperBox>
            <br />
            {/* <br />
            <MainTypography textAlign={"center"} variant="h5">
              Create Option Set
            </MainTypography>
            <br /> */}
            <OptionSetForm onSubmit={() => setActiveStep(1)} />
          </WrapperBox>
          <WrapperBox>
            <OptionForm
              onSubmit={(values) =>
                setOptions((opt) => [...opt, { id: UUID.v4(), ...values }])
              }
            />
            <MainButton title="submit" onClick={() => {}} />
            <br />
            <>
              {options.map((option) => (
                <ListItem
                  key={option.id}
                  title={option.label}
                  id={option.id}
                  subTitle={option.value}
                  onDelete={handleDelete}
                />
              ))}
            </>
          </WrapperBox>
        </StepperContainer>
      </MainPaper>
    </WrapperBox>
  );
}
