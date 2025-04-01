import {
  FieldsContainer,
  FormDatePicker,
  FormFieldContainerMultiple,
  FormikInit,
  FormTimePicker,
  GenericDialog,
  RadioGroupInput,
  TextInputField,
  UnitInputField,
} from "@/components";

import { concepts, encounters, NO, YES } from "@/constants";
import { getInitialValues, getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { getActivePatientDetails } from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { useEffect } from "react";
import { RecordForm } from "./cprRecordForm";
import { EndCPRForm } from "./endCprForm";
import { BasicDetailsForm } from "./cprBasicDetailsForm";
import { CPRRecordTable } from "./cprRecordsTable";

const CPRForm = ({
  onClose,
  patientuuid,
  visituuid,
}: {
  onClose: () => void;
  patientuuid?: string;
  visituuid?: string;
}) => {
  const { mutate, isSuccess } = fetchConceptAndCreateEncounter();

  //   const obsDatetime = getDateTime();
  //   const formValues = { ...values };

  //   let recordsObservation = [];

  //   if (Array.isArray(formValues.records)) {
  //     recordsObservation = formValues.records.map(
  //       (record: any, index: number) => {
  //         const interventionsObs = record.Interventions.map((v: any) => ({
  //           concept: concepts.INTERVENTION_NOTES,
  //           value: v.id,
  //           obsDatetime,
  //         }));
  //         const rhythmObs = record.rhythm.map((v: any) => ({
  //           concept: concepts.RHYTHM,
  //           value: v.id,
  //           obsDatetime,
  //         }));

  //         return {
  //           concept: concepts.OTHER,
  //           value: `record ${index}`,
  //           groupMembers: [
  //             {
  //               concept: concepts.TIME,
  //               value: record.time,
  //               obsDatetime,
  //             },
  //             {
  //               concept: concepts.SHOCK_ENERGY,
  //               value: record.shockEnergy,
  //               obsDatetime,
  //             },
  //             {
  //               concept: concepts.MEDICATION,
  //               value: record.medication,
  //               obsDatetime,
  //             },
  //             {
  //               concept: concepts.MEDICATION_DOSE,
  //               value: record.dose,
  //               obsDatetime,
  //             },
  //             {
  //               concept: concepts.MEDICATION_ROUTE,
  //               value: record.route,
  //               obsDatetime,
  //             },

  //             {
  //               concept: concepts.OCCURRENCES,
  //               value: record.occurrences,
  //             },
  //             ...interventionsObs,
  //             ...rhythmObs,
  //           ],
  //         };
  //       }
  //     );
  //   }

  //   const teamMembersObs = formValues[form.teamMembers.name].map((v: any) => ({
  //     concept: concepts.COMPLAINTS,
  //     value: v.id,
  //     obsDatetime,
  //   }));

  //   delete formValues.records;
  //   delete formValues.medications;
  //   delete formValues[concepts.TEAM_MEMBERS];
  //   delete formValues[concepts.REVERSIBLE_CAUSES];

  //   const observations = getObservations(formValues, obsDatetime);

  //   mutate({
  //     encounterType: encounters.CPR,
  //     patient: patientId ? patientId : patientuuid,
  //     visit: activeVisit ? activeVisit : visituuid,
  //     encounterDatetime: obsDatetime,
  //     obs: [...observations, ...recordsObservation, ...teamMembersObs],
  //   });
  // };

  const handleRecordSubmit = (values: any) => {};

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  return (
    <>
      <BasicDetailsForm onSubmit={() => {}} />
      <br />
      <CPRRecordTable patientId={patientuuid as string} />
      <RecordForm
        onSubmit={handleRecordSubmit}
        visitUuid={visituuid}
        patientUuid={patientuuid}
      />
      <br />
      <EndCPRForm onSubmit={() => {}} />
    </>
  );
};

export const CPRDialogForm = ({
  open,
  onClose,
  patientuuid,
  visituuid,
}: {
  open: boolean;
  onClose: () => void;
  patientuuid?: string;
  visituuid?: string;
}) => {
  return (
    <GenericDialog maxWidth="md" open={open} title="CPR" onClose={onClose}>
      <CPRForm
        visituuid={visituuid}
        patientuuid={patientuuid}
        onClose={onClose}
      />
    </GenericDialog>
  );
};
