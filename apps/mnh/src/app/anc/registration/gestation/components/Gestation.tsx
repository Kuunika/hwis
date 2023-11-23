import React from 'react'
import { FormikInit, RadioGroupInput, TextInputField } from 'shared-ui/src';
import * as yup from "yup";
import { Box } from "@mui/material";


    type Props = {
      onSubmit: (values: any) => void;
      initialValues: any
    };

    const form = {
      weekOfVisit: {
        name: "weekOfVisit",
        label: "Week of first visit (0 - 12, 13+)",
      },
      pregnancyTest: {
        name: "pregnancyTest",
        label: "Pregnancy test in 1st Semester ",
      },
      weightInfo: {
        name: "weightInfo",
        label: "Weight (kgs) ",
      },
      heightInfo: {
        name: "heightInfo",
        label: "Height (cm) ",
      },
      pulseRate: {
        name: "pulseRate",
        label: "Pulse rate ",
      },
      bloodPressure: {
        name: "pregnancyTest",
        label: "Pregnancy test in 1st Semester ",
      },
      preEclampsia: {
        name: "preEclampsia",
        label: "Pre-eclampsia",
      },
      generalCondition: {
        name: "generalCondition",
        label: "General condition",
      }
    };
    const schema=yup.object({
        [form.weekOfVisit.name]:yup.string().required().label(form.weekOfVisit.label),
        [form.pregnancyTest.name]:yup.string().required().label(form.pregnancyTest.label),
        [form.weightInfo.name]:yup.string().required().label(form.weightInfo.label),
        [form.heightInfo.name]:yup.string().required().label(form.heightInfo.label),
        [form.pulseRate.name]:yup.string().required().label(form.pulseRate.label),
        [form.bloodPressure.name]:yup.string().required().label(form.bloodPressure.label),
        [form.preEclampsia.name]:yup.string().required().label(form.preEclampsia.label),
        [form.generalCondition.name]:yup.string().required().label(form.generalCondition.label) 
    })

const Gestation = ({ onSubmit,initialValues }: Props) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <Box>
        <TextInputField
          name={form.weekOfVisit.name}
          label={form.weekOfVisit.label}
          id={form.weekOfVisit.name}
        />
        <RadioGroupInput
          name={form.pregnancyTest.name}
          label={form.pregnancyTest.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <TextInputField
          name={form.weightInfo.name}
          label={form.weightInfo.label}
          id={form.weightInfo.name}
        />
        <TextInputField
          name={form.heightInfo.name}
          label={form.heightInfo.label}
          id={form.heightInfo.name}
        />
        <TextInputField
          name={form.pulseRate.name}
          label={form.pulseRate.label}
          id={form.pulseRate.name}
        />
        <TextInputField
          name={form.bloodPressure.name}
          label={form.bloodPressure.label}
          id={form.bloodPressure.name}
        />
        <RadioGroupInput
          name={form.preEclampsia.name}
          label={form.preEclampsia.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <TextInputField
          name={form.generalCondition.name}
          label={form.generalCondition.label}
          id={form.generalCondition.name}
        />
      </Box>
    </FormikInit>
  );
};

export default Gestation
