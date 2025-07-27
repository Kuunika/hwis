"use client";

import { MainGrid, MainPaper, FormikInit, TextInputField } from "@/components";

import * as Yup from "yup";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { useEffect, useState } from "react";
import { Visit } from "@/interfaces";
import { useNavigation } from "@/hooks";
import { AccordionWithMedication } from "./AccordionWithMedication";
import { useServerTime } from "@/contexts/serverTimeContext";
import { AccordionComponent } from "@/components/accordion";

const validationSchema = Yup.object({
  facilityName: Yup.string().required("Facility Name is required"),
  reason: Yup.string().required("Reason for Transfer is required"),
});

const initialValues = {
  facilityName: "",
  reason: "",
};

export default function TransferForm({
  openPatientSummary,
}: {
  openPatientSummary: () => void;
}) {
  const { params } = useParameters();
  const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
  const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
  const { data: patientVisits } = getPatientVisitTypes(params.id as string);
  const { ServerTime } = useServerTime();

  useEffect(() => {
    if (patientVisits) {
      const active = patientVisits.find((visit) => !visit.date_stopped);
      if (active) {
        setActiveVisit(active as unknown as Visit);
      }
    }
  }, [patientVisits]);

  const handleSubmit = async (values: any) => {
    const currentDateTime = ServerTime.getServerTimeString();

    const obs = [
      {
        concept: concepts.TRANSFER_OUT,
        value: concepts.TRANSFER_OUT,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.FACILITY_NAME,
        value: values.facilityName,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.REASON_FOR_TRANSFER,
        value: values.reason,
        obsDatetime: currentDateTime,
      },
      // { concept: concepts.TRANSFER_NOTES, value: values.transferNotes, obsDatetime: currentDateTime },
    ];

    const payload = {
      encounterType: encounters.DISPOSITION,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: currentDateTime,
      obs,
    };

    try {
      await submitEncounter(payload);
      // toast.success("Transfer information submitted successfully!");
      // Close the visit after successfully submitting the encounter
      // if (activeVisit?.uuid) {
      //     closeVisit(activeVisit.uuid);
      // }
      // navigateTo("/dispositions");
      openPatientSummary();
    } catch (error) {
      console.error("Error submitting Transfer information: ", error);
      // toast.error("Failed to submit Transfer information.");
    }
  };

  const sections = [
    {
      id: "transferForm",
      title: <h2>Transfer Out</h2>,
      content: <TransferFormContent handleSubmit={handleSubmit} />,
    },
    {
      id: "medication",
      title: <h2>Medication</h2>,
      content: <AccordionWithMedication />,
    },
  ];

  return (
    <MainGrid container spacing={2}>
      <MainGrid item xs={12}>
        <AccordionComponent sections={sections} />
      </MainGrid>
    </MainGrid>
  );
}

function TransferFormContent({
  handleSubmit,
}: {
  handleSubmit: (values: any) => void;
}) {
  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    >
      <MainPaper sx={{ p: 3 }}>
        <MainGrid container spacing={2}>
          <MainGrid item xs={12}>
            <TextInputField
              id="facilityName"
              name="facilityName"
              label="Facility Name"
              placeholder="Enter Facility Name"
              sx={{ width: "100%" }}
            />
          </MainGrid>

          <MainGrid item xs={12}>
            <TextInputField
              id="reason"
              name="reason"
              label="Reason for Transfer"
              placeholder="Provide reason for transfer"
              rows={4}
              multiline
              sx={{ width: "100%" }}
            />
          </MainGrid>
        </MainGrid>
      </MainPaper>
    </FormikInit>
  );
}
