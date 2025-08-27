"use client";

import {
  MainGrid,
  MainPaper,
  FormikInit,
  TextInputField,
  FormDatePicker,
  FormTimePicker,
} from "@/components";

import * as Yup from "yup";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { useEffect, useState } from "react";
import { Visit } from "@/interfaces";
import { closeCurrentVisit } from "@/hooks/visit";
import { useNavigation } from "@/hooks";
import { AccordionWithMedication } from "./AccordionWithMedication";
import { useServerTime } from "@/contexts/serverTimeContext";
import { AccordionComponent } from "@/components/accordion";

const validationSchema = Yup.object({
  lastSeenLocation: Yup.string().required("Last Seen Location is required"),
  dateAbsconded: Yup.date().required("Date of Absconding is required"),
  timeAbsconded: Yup.string().required("Time of Absconding is required"),
});

const initialValues = {
  lastSeenLocation: "",
  dateAbsconded: "",
  timeAbsconded: "",
};

export default function AbscondedForm({
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
        concept: concepts.ABSCONDED,
        value: concepts.ABSCONDED,
        obsDatetime: currentDateTime,
        groupMembers: [
          {
            concept: concepts.LAST_SEEN_LOCATION,
            value: values.lastSeenLocation,
            obsDatetime: currentDateTime,
          },
          {
            concept: concepts.DATE_OF_ABSCONDING,
            value: values.dateAbsconded,
            obsDatetime: currentDateTime,
          },
          {
            concept: concepts.TIME_OF_ABSCONDING,
            value: values.timeAbsconded,
            obsDatetime: currentDateTime,
          },
        ],
      },
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
      openPatientSummary();
    } catch (error) {
      console.error("Error submitting Absconded information: ", error);
    }
  };

  const sections = [
    {
      id: "abscondedForm",
      title: <h2>Absconded Form</h2>,
      content: <AbscondedFormContent handleSubmit={handleSubmit} />,
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

function AbscondedFormContent({
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
              id="lastSeenLocation"
              name="lastSeenLocation"
              label="Last Seen Location"
              placeholder="Enter the last known location"
              sx={{ width: "100%" }}
            />
          </MainGrid>

          <MainGrid item xs={12} md={6}>
            <FormDatePicker
              name="dateAbsconded"
              label="Date of Absconding"
              sx={{ width: "100%" }}
            />
          </MainGrid>

          <MainGrid item xs={12} md={6}>
            <FormTimePicker
              name="timeAbsconded"
              label="Time of Absconding"
              sx={{ width: "100%" }}
            />
          </MainGrid>
        </MainGrid>
      </MainPaper>
    </FormikInit>
  );
}
