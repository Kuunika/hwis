import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SearchComboBox, FormikInit, MainButton } from "@/components";
import * as Yup from "yup";

import { getInitialValues, notify } from "@/helpers";
import { NO, YES, concepts } from "@/constants";
import { TextInputDisplay } from "@/components/form/textInputDisplay";
import { getConceptFromCacheOrFetch } from "@/hooks/encounter";
import { useServerTime } from "@/contexts/serverTimeContext";
import { usePresentingComplaints } from "@/hooks/usePresentingComplaints";

type Prop = {
  onSubmit: (values: any) => void;
  setTriageResult: (triage: any, name: string) => void;
  triageResult: string;
  getFormValues: (values: any) => void;
};
const form = {
  complaints: {
    name: concepts.PRESENTING_COMPLAINTS,
    label: "Complaints",
  },
};

const schema = Yup.object().shape({
  [form.complaints.name]: Yup.array().required().label(form.complaints.label),
});

const initialValues = getInitialValues(form);

export const PresentingComplaintsForm = ({
  onSubmit,
  setTriageResult,
  getFormValues,
}: Prop) => {
  const { ServerTime } = useServerTime();
  const { presentingComplaints } = usePresentingComplaints();
  const [otherPresenting, setOtherPresenting] = useState([]);
  const [showInputTextDisplay, setShowInputTextDisplay] = useState(false);

  const handleValueChange = async (values: Array<any>) => {
    const carbon = await getConceptFromCacheOrFetch(
      concepts.CARBON_MONOXIDE_POISONING
    );
    const trauma = await getConceptFromCacheOrFetch(
      concepts.INJURY_MAJOR_TRAUMA_PENETRATING
    );
    const poisoning = await getConceptFromCacheOrFetch(concepts.POISONING);
    const vomiting = await getConceptFromCacheOrFetch(concepts.VOMITING_BLOOD);
    const other = await getConceptFromCacheOrFetch(concepts.OTHER);

    const triage = [
      carbon?.data[0]?.names[0]?.uuid,
      trauma?.data[0]?.names[0]?.uuid,
      poisoning?.data[0]?.names[0]?.uuid,
      vomiting?.data[0]?.names[0]?.uuid,
    ];

    setShowInputTextDisplay(
      Boolean(values.find((v) => v.id == other.data[0]?.names[0]?.uuid))
    );

    triage.forEach((triage) => {
      const found = values.find((v) => {
        return v.id == triage;
      });

      if (found) {
        setTriageResult("red", triage);
      } else {
        setTriageResult("", triage);
      }
    });
  };

  const handleSubmit = (values: any) => {
    const dateTime = ServerTime.getServerTimeString();

    const other = otherPresenting.map((value) => ({
      value,
      concept: concepts.OTHER,
      dateTime,
    }));
    const formattedObs = values[concepts.PRESENTING_COMPLAINTS].map(
      (v: any) => ({
        concept: concepts.PRESENTING_COMPLAINTS,
        value: v.id,
        obsDatetime: dateTime,
      })
    );
    // values[form.complaints.name] = [...values[form.complaints.name], ...other];
    onSubmit([...formattedObs, ...other]);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButton={false}
      submitButtonText="next"
      getFormValues={getFormValues}
    >
      <SearchComboBox
        getValue={handleValueChange}
        name={form.complaints.name}
        label={form.complaints.label}
        options={presentingComplaints}
      />
      <br />

      {showInputTextDisplay && (
        <TextInputDisplay getValues={setOtherPresenting} />
      )}
      <br />

      <MainButton title={"next"} type="submit" onClick={() => {}} />
    </FormikInit>
  );
};
