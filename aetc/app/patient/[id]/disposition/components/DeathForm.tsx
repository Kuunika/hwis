"use client";

import {
  MainGrid,
  MainPaper,
  FormikInit,
  TextInputField,
  SearchComboBox,
  FormDatePicker,
  RadioGroupInput,
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
import { AccordionComponent } from "@/components/accordion";
import { AccordionWithMedication } from "./AccordionWithMedication"; // ✅ Included
import { useServerTime } from "@/contexts/serverTimeContext";

const mortuaryOptions = [
  { id: concepts.QECH, label: "QECH" },
  { id: concepts.COM, label: "COM" },
  { id: concepts.MTHUNZI, label: "Mthunzi" },
  { id: concepts.OTHER, label: "Other (Specify)" },
];

const relationshipOptions = [
  { id: concepts.RELATIONSHIP_SPOUSE, label: "Spouse" },
  { id: concepts.RELATIONSHIP_PARENT, label: "Parent" },
  { id: concepts.RELATIONSHIP_SIBLING, label: "Sibling" },
  { id: concepts.RELATIONSHIP_UNCLE, label: "Uncle" },
  { id: concepts.RELATIONSHIP_COUSIN, label: "Cousin" },
  { id: concepts.RELATIONSHIP_OTHER, label: "Other" },
];

const validationSchema = Yup.object({
  causeOfDeath: Yup.string().required("Cause of Death is required"),
  familyInformed: Yup.string().required(
    "Please specify if family has been informed"
  ),
  relationshipToDeceased: Yup.string().required(
    "Relationship to Deceased is required"
  ),
  mortuary: Yup.string().required("Mortuary is required"),
  lastOfficeConducted: Yup.string().required("Last office status is required"),
  healthWorkerName: Yup.string().required("Name of health worker is required"),
  lastOfficeDate: Yup.date().required(
    "Date and Time of Last Office is required"
  ),
});

const initialValues = {
  causeOfDeath: "",
  familyInformed: "",
  relationshipToDeceased: "",
  mortuary: "",
  lastOfficeConducted: "",
  healthWorkerName: "",
  lastOfficeDate: "",
};

export default function DeathForm({
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
        concept: concepts.DEATH,
        value: concepts.DEATH,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.CAUSE_OF_DEATH,
        value: values.causeOfDeath,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.FAMILY_INFORMED,
        value: values.familyInformed,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.RELATIONSHIP_TO_DECEASED,
        value: values.relationshipToDeceased,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.MORTUARY,
        value: values.mortuary,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.LAST_OFFICE_CONDUCTED,
        value: values.lastOfficeConducted,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.NAME_OF_HEALTH_WORKER_WHO_CONDUCTED_LAST_OFFICE,
        value: values.healthWorkerName,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.DATE_OF_LAST_OFFICE,
        value: values.lastOfficeDate,
        obsDatetime: currentDateTime,
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
      // toast.success("Death Form information submitted successfully!");
      // Close the visit after successfully submitting the encounter
      // if (activeVisit?.uuid) {
      //     closeVisit(activeVisit.uuid);
      // }
      // Redirect to assessments page
      // navigateTo("/dispositions");
      openPatientSummary();
    } catch (error) {
      console.error("Error submitting Death form information: ", error);
      // toast.error("Failed to submit Death Form information.");
    }
  };

  const sections = [
    {
      id: "deathForm",
      title: <h2>Death Form</h2>,
      content: <DeathFormContent handleSubmit={handleSubmit} />,
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

function DeathFormContent({
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
              id="causeOfDeath"
              name="causeOfDeath"
              label="Cause of Death"
              placeholder="Enter the cause of death"
              rows={4}
              multiline
              sx={{ width: "100%" }}
            />
          </MainGrid>

          <MainGrid item xs={12} md={6}>
            <RadioGroupInput
              name="familyInformed"
              label="Has the family been informed?"
              options={[
                { value: concepts.YES, label: "Yes" },
                { value: concepts.NO, label: "No" },
              ]}
            />
          </MainGrid>

          <MainGrid item xs={12} md={6}>
            <SearchComboBox
              name="relationshipToDeceased"
              label="If yes, relationship to deceased"
              options={relationshipOptions}
              sx={{ width: "100%" }}
              multiple={false}
            />
          </MainGrid>

          <MainGrid item xs={12} md={6}>
            <SearchComboBox
              name="mortuary"
              label="Mortuary to take the deceased"
              options={mortuaryOptions}
              sx={{ width: "100%" }}
              multiple={false}
            />
          </MainGrid>

          <MainGrid item xs={12} md={6}>
            <RadioGroupInput
              name="lastOfficeConducted"
              label="Was the last office conducted?"
              options={[
                { value: concepts.YES, label: "Yes" },
                { value: concepts.NO, label: "No" },
              ]}
            />
          </MainGrid>

          <MainGrid item xs={12} md={6}>
            <TextInputField
              id="healthWorkerName"
              name="healthWorkerName"
              label="Name of Health Worker who conducted the last office"
              placeholder="Enter health worker's name"
              sx={{ width: "100%" }}
            />
          </MainGrid>

          <MainGrid item xs={12} md={6}>
            <FormDatePicker
              name="lastOfficeDate"
              label="Date of Last Office"
              sx={{ width: "100%" }}
            />
          </MainGrid>
        </MainGrid>
      </MainPaper>
    </FormikInit>
  );
}
