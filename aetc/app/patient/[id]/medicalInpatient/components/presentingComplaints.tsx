import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts, encounters } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import { getInitialValues, mapSearchComboOptionsToConcepts } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { getObservation } from "@/helpers/emr";
import { useSubmitEncounter } from "@/hooks";
import { usePresentingComplaints } from "@/hooks/usePresentingComplaints";
import { useState } from "react";
import * as Yup from "yup";

const form = {
  complaints: {
    name: concepts.PRESENTING_COMPLAINTS,
    label: "Presenting Complaints",
  },
  history: {
    name: concepts.PRESENTING_HISTORY,
    label: "History of Presenting Complaints",
  },
};

const schema = Yup.object().shape({
  [form.complaints.name]: Yup.array().required().label(form.complaints.label),
  [form.history.name]: Yup.string().label(form.history.label),
});
const initialValues = getInitialValues(form);

export const PresentingComplaints = ({
  onSubmit,
}: {
  onSubmit: (values: any) => void;
}) => {
    const { ServerTime } = useServerTime();
  const { presentingComplaints } = usePresentingComplaints();

  const handleSubmit = (values: any) => {
    const formValues = { ...values };

    const obsDatetime = ServerTime.getServerTimeString()

    const complaintsObs = mapSearchComboOptionsToConcepts(
      formValues[form.complaints.name],
      form.complaints.name,
      obsDatetime
    );

    const obs = [
      {
        concept: form.complaints.name,
        value: form.complaints.name,
        groupMembers: complaintsObs,
        obsDatetime: obsDatetime,
      },
      {
        concept: form.history.name,
        value: formValues[form.history.name],
        obsDatetime,
      },
    ];

    onSubmit(obs);
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButtonText="next"
    >
      <SearchComboBox
        name={form.complaints.name}
        options={presentingComplaints}
        multiple
        label={form.complaints.label}
      />
      <br />
      <TextInputField
        multiline
        rows={5}
        name={form.history.name}
        label={form.history.label}
        id={form.history.name}
        sx={{ width: "100%" }}
      />
    </FormikInit>
  );
};
