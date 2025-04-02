import {
  FieldsContainer,
  FormDatePickerToday,
  FormFieldContainerMultiple,
  FormikInit,
  FormTimePickerNow,
  GenericDialog,
  RadioGroupInput,
  TextInputField,
  UnitInputField,
} from "@/components";

import { concepts, encounters, NO, YES } from "@/constants";
import {
  getInitialValues,
  getObservations,
  mapSearchComboOptionsToConcepts,
} from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { useSubmitEncounter } from "@/hooks";
import { useRef, useState } from "react";
import { RecordForm } from "./cprRecordForm";
import { EndCPRForm } from "./endCprForm";
import { BasicDetailsForm } from "./cprBasicDetailsForm";
import { CPRRecordTable } from "./cprRecordsTable";
import { useFindPatientEncounter } from "@/hooks/useFilterEncounter";
import { Obs } from "@/interfaces";

const CPRForm = ({
  onClose,
  patientuuid,
  visituuid,
}: {
  onClose: () => void;
  patientuuid?: string;
  visituuid?: string;
}) => {
  const [submittingRecord, setSubmittingRecord] = useState(false);
  const { handleSubmit } = useSubmitEncounter(
    encounters.CPR,
    () => {
      onClose();
    },
    patientuuid,
    visituuid
  );
  const basicFormRef = useRef<any>(null);
  const endFormRef = useRef<any>(null);
  const { dataObs, isLoading } = useFindPatientEncounter(
    patientuuid as string,
    encounters.CPR
  );

  const validateCprData = async () => {
    await basicFormRef?.current?.setTouched(
      Object.keys(basicFormRef?.current?.values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );

    await endFormRef?.current?.setTouched(
      Object.keys(endFormRef?.current?.values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );

    // Validate both forms
    const basicFormErrors = await basicFormRef?.current?.validateForm();
    const endFormErrors = await endFormRef?.current?.validateForm();

    if (
      Object.keys(basicFormErrors).length > 0 ||
      Object.keys(endFormErrors).length > 0
    ) {
      console.log("Validation failed:", { basicFormErrors, endFormErrors });
      return;
    }
    // If validation passes, submit forms
    await basicFormRef?.current?.submitForm();
    await endFormRef?.current?.submitForm();
  };

  const handleFormSubmit = () => {
    // Proceed with data processing
    const obsDatetime = getDateTime();
    const basicObs = getObservations(basicFormRef.current.values, obsDatetime);
    const formValues = { ...endFormRef.current.values };

    const teamMembersObs = mapSearchComboOptionsToConcepts(
      formValues[concepts.TEAM_MEMBERS],
      concepts.TEAM_MEMBERS,
      obsDatetime
    );

    delete formValues[concepts.TEAM_MEMBERS];

    const endCprObs = getObservations(formValues, obsDatetime);

    // extract cpr records and add them in one ob
    const records = dataObs.filter(
      (ob: Obs) =>
        ob.children.length > 0 &&
        ob.names.find(
          (name) => name.name.toLowerCase() == concepts.CPR_RECORD.toLowerCase()
        )
    );

    const copiedRecordsObs = records.map((ob: Obs) => {
      return {
        concept: concepts.CPR_RECORD,
        value: ob.value,
        obsDatetime: ob.obs_datetime,
        groupMembers: ob.children.map((child: Obs) => {
          return {
            concept: child.names[0].name,
            value: child.value,
            obsDatetime: child.obs_datetime,
          };
        }),
      };
    });

    const ob = {
      concept: concepts.CPR,
      value: obsDatetime,
      obsDatetime,
      groupMembers: [
        ...endCprObs,
        ...teamMembersObs,
        ...basicObs,
        ...copiedRecordsObs,
      ],
    };

    handleSubmit([ob]);
  };

  return (
    <>
      <BasicDetailsForm formRef={basicFormRef} onSubmit={() => {}} />
      <br />
      <CPRRecordTable
        submittingRecord={submittingRecord}
        patientId={patientuuid as string}
      />
      <RecordForm
        onSubmitRecord={setSubmittingRecord}
        visitUuid={visituuid}
        patientUuid={patientuuid}
      />
      <br />
      <EndCPRForm
        triggerValidate={validateCprData}
        formRef={endFormRef}
        onSubmit={handleFormSubmit}
      />
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
