import React from 'react';
import { FormikInit } from 'shared-ui/src';

type Props ={
    onSubmit: () => void;
    initialValues:any;
}
const form = {
  pallorInfo: {
    name: "pallorInfo",
    label: "Pallor present?",
  },
  oedemaPresent: {
    name: "oedemaPresent",
    label: "Oedema present?",
  },
  severityInfo: {
    name: "severityInfo",
    label: "Select severity",
  },
  coughInfo: {
    name: "coughtInfo",
    label: "Does the woman have a cough?",
  },
  durationInfo: {
    name: "durationInfo",
    label: "Duration of cough",
  },
  weightInfo: {
    name: "weightInfo",
    label: "Weight loss?",
  },
  feverInfo: {
    name: "feverInfo",
    label: "Fever?",
  },
  nightSweatsInfo: {
    name: "nightSweatsInfo",
    label: "Night sweats",
  },
  respiratoryRateInfo: {
    name: "respiratoryRateInfo",
    label: "Enter respiratory rate",
  },
};

const AncMatrix = ({onSubmit,initialValues}:Props) => {
  return (
    <FormikInit></FormikInit>
  );
}

export default AncMatrix;
