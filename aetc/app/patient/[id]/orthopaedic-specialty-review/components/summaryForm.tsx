import { FormikInit, TextInputField } from "@/components";
import { concepts, encounters, templateForms } from "@/constants";
import { getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";

import { useSubmitEncounter } from "@/hooks";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  [concepts.NOTES]: Yup.string().required("Required"),
});

export const SummaryForm = () => {
  const { handleSubmit } = useSubmitEncounter(
    encounters.TEMPLATE_NOTES,
    () => {}
  );

  const handleSubmitNotes = (values: any) => {
    const obsDateTime = getDateTime();
    const obs = [
      {
        concept: concepts.NOTES,
        value: templateForms.ORTHOPAEDIC_SPECIALTY_REVIEW,
        obsDateTime,
        groupMembers: getObservations(values, obsDateTime),
      },
    ];
    console.log({ obs });
    handleSubmit(obs);
  };

  return (
    <FormikInit
      initialValues={{ [concepts.NOTES]: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmitNotes}
    >
      <TextInputField
        multiline
        name={concepts.NOTES}
        label="General Notes"
        id={concepts.NOTES}
        rows={5}
        sx={{ width: "100%" }}
      />
    </FormikInit>
  );
};
