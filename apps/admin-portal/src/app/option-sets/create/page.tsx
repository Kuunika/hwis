"use client";
import { useState, useEffect } from "react";
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

import { useRouter } from "next/navigation";
import { useOptionSet } from "@/hooks";

export default function () {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [optionSet, setOptionSet] = useState({ label: "", description: "" });
  const [options, setOptions] = useState<Array<any>>([]);
  const router = useRouter();
  const { mutate, isSuccess } = useOptionSet().useAddOptionSet();

  const steps = [
    { id: 1, label: "create optionset" },
    { id: 2, label: "options" },
  ];

  useEffect(() => {
    if (isSuccess) return router.push("/option-sets");
  }, [isSuccess]);

  const handleSubmit = async () => {
    const mappedOptions = options.map((option) => ({
      label: option.label,
      value: option.value,
      hasWeight: option.hasWeight == "no" ? false : true,
    }));
    await mutate({ options: mappedOptions, ...optionSet });
  };

  const handleDelete = (id: string) => {
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
            <OptionSetForm
              onSubmit={(value: any) => {
                setOptionSet(value);
                setActiveStep(1);
              }}
            />
          </WrapperBox>
          <WrapperBox>
            <OptionForm
              onSubmit={(values) =>
                setOptions((opt) => [...opt, { id: UUID.v4(), ...values }])
              }
            />
            <MainButton title="submit" onClick={() => handleSubmit()} />
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
