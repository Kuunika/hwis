import React from 'react'
import { FormikInit } from 'shared-ui/src';
import * as yup from "yup";
import { Box } from "@mui/material";


    type Prop = {
      onSubmit: (values: any) => void;
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

    const initialValues = {
      weekOfVisit: "",
      pregnancyTest: "",
      weightInfo: "",
      heightInfo: "",
      pulseRate: "",
      bloodPressure: "",
      preEclampsia: "",
      generalCondition:"",
    };

const Gestation = ({onSubmit}:Prop) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
        <Box></Box>
    </FormikInit>
  );
}

export default Gestation
