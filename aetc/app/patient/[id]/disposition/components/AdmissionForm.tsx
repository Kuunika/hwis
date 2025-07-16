"use client";

import React, { useEffect, useState } from "react";

import * as Yup from "yup";

import { getActivePatientDetails } from "@/hooks";
import {
  MainGrid,
  FormikInit,
  TextInputField,
  SearchComboBox,
} from "@/components";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { useServerTime } from "@/contexts/serverTimeContext";
import { Visit } from "@/interfaces";
import { concepts, encounters } from "@/constants";
import { AccordionWithMedication } from "./AccordionWithMedication";
import { AccordionComponent } from "@/components/accordion";

export default function AdmissionForm({
  openPatientSummary,
}: {
  openPatientSummary: () => void;
}) {
  const { params } = useParameters();
  const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
  const { ServerTime } = useServerTime();
  const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
  const { data: patientVisits } = getPatientVisitTypes(params.id as string);

  useEffect(() => {
    if (patientVisits) {
      const active = patientVisits.find((visit) => !visit.date_stopped);
      if (active) setActiveVisit(active as unknown as Visit);
    }
  }, [patientVisits]);

  const handleSubmit = async (values: any) => {
    const currentDateTime = ServerTime.getServerTimeString();

    const obs = [
      {
        concept: concepts.ADMISSION,
        value: concepts.ADMISSION,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.WARD,
        value: values.wardName,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.BED_NUMBER,
        value: values.bedNumber,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.REASON_FOR_ADMISSION,
        value: values.reasonForAdmission,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.SPECIALITY_DEPARTMENT,
        value: values.specialtyInvolved,
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

      openPatientSummary();
    } catch (error) {
      console.error("Error submitting Admission information: ", error);
    }
  };

  const sections = [
    {
      id: "admission",
      title: <h2>Admission</h2>,
      content: <AdmissionFormContent onSubmit={handleSubmit} />,
    },
    {
      id: "medications",
      title: <h2>Prescribe Medications</h2>,
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

const initialValues = {
  wardName: "",
  bedNumber: "",
  reasonForAdmission: "",
  specialtyInvolved: "",
};

const validationSchema = Yup.object({
  wardName: Yup.string().required("Ward Name is required"),
  reasonForAdmission: Yup.string().required("Reason for Admission is required"),
  specialtyInvolved: Yup.string().required("Specialty Involved is required"),
});

const wardOptions = [
  {
    id: concepts.TWO_A_ONCOLOGY_WARD_GENERAL_WARD_HIGH_DEPENDENCY_UNIT,
    label: "2A Oncology Ward (General ward/High Dependency Unit)",
  },
  {
    id: concepts.TWO_B_RENAL_AND_DERMATOLOGY_WARD,
    label: "2B Renal and Dermatology Ward",
  },
  {
    id: concepts.SIX_A_FEMALE_ORTHOPAEDIC_WARD,
    label: "6A Female Orthopaedic Ward",
  },
  {
    id: concepts.FOUR_A_FEMALE_MEDICAL_WARD_GENERAL_WARD_HIGH_DEPENDENCY_UNIT,
    label: "4A Female Medical Ward (General ward/High Dependency Unit)",
  },
  {
    id: concepts.GYNECOLOGY_WARD_GENERAL_WARD_HIGH_DEPENDENCY_UNIT,
    label: "Gynecology Ward (General ward/High Dependency Unit)",
  },
  {
    id: concepts.LABOUR_WARD_GENERAL_WARD_HIGH_DEPENDENCY_UNIT,
    label: "Labour Ward (General ward/High Dependency Unit)",
  },
  {
    id: concepts.THREE_B_FEMALE_MEDICAL_WARD_GENERAL_WARD_HIGH_DEPENDENCY_UNIT,
    label: "3B Female Medical Ward (General ward/High Dependency Unit)",
  },
  { id: concepts.THREE_A_TB_WARD, label: "3A TB Ward" },
  {
    id: concepts.THREE_A_HDRU_HIGH_DEPENDENCY_RESPIRATORY_UNIT,
    label: "3A HDRU (High Dependency Respiratory Unit)",
  },
  {
    id: concepts.FIVE_A_MALE_SURGICAL_WARD_GENERAL_WARD_HIGH_DEPENDENCY_UNIT,
    label: "5A Male Surgical Ward (General ward/High Dependency Unit)",
  },
  {
    id: concepts.FIVE_B_FEMALE_SURGICAL_WARD_GENERAL_WARD_HIGH_DEPENDENCY_UNIT,
    label: "5B Female Surgical Ward (General ward/High Dependency Unit)",
  },
  { id: concepts.FIVE_B_ORTHOPAEDIC_WARD, label: "5B Orthopaedic Ward" },
  {
    id: concepts.FIVE_B_NEUROSURGICAL_WARD_GENERAL_WARD_HIGH_DEPENDENCY_UNIT,
    label: "5B Neurosurgical Ward (General ward/High Dependency Unit)",
  },
  { id: concepts.INTENSIVE_CARE_UNIT_ICU, label: "Intensive Care Unit (ICU)" },
  { id: concepts.THEATRE, label: "Theatre" },
  { id: concepts.ENT, label: "ENT" },
  { id: concepts.OPHTHALMOLOGY, label: "Ophthalmology" },
];

const specialtyOptions = [
  { id: concepts.MEDICINE, label: "Medicine" },
  { id: concepts.GENERAL_SURGERY, label: "General Surgery" },
  { id: concepts.ORTHOPEDICS, label: "Orthopedics" },
  { id: concepts.NEUROSURGERY, label: "Neurosurgery" },
  {
    id: concepts.EAR_NOSE_AND_THROAT_ENT,
    label: "Ear, Nose, and Throat (ENT)",
  },
  {
    id: concepts.DENTAL_AND_MAXILLOFACIAL_SURGERY,
    label: "Dental and Maxillofacial Surgery",
  },
  { id: concepts.OPHTHALMOLOGY, label: "Ophthalmology" },
  { id: concepts.PSYCHIATRY, label: "Psychiatry" },
  {
    id: concepts.GYNAECOLOGY_AND_OBSTETRICS,
    label: "Gynecology and Obstetrics",
  },
  { id: concepts.CRITICAL_CARE, label: "Critical Care" },
  { id: concepts.ONCOLOGY, label: "Oncology" },
];

function AdmissionFormContent({
  onSubmit,
}: {
  onSubmit: (values: typeof initialValues) => void;
}) {
  const { gender } = getActivePatientDetails();
  const [filteredWardOptions, setFilteredWardOptions] = useState(wardOptions);

  useEffect(() => {
    const femaleOnlyLabels = [
      "6A Female Orthopaedic Ward",
      "4A Female Medical Ward (General ward/High Dependency Unit)",
      "Gynecology Ward (General ward/High Dependency Unit)",
      "Labour Ward (General ward/High Dependency Unit)",
      "3B Female Medical Ward (General ward/High Dependency Unit)",
      "5B Female Surgical Ward (General ward/High Dependency Unit)",
    ];

    if (gender === "Male") {
      setFilteredWardOptions(
        wardOptions.filter((ward) => !femaleOnlyLabels.includes(ward.label))
      );
    } else {
      setFilteredWardOptions(wardOptions);
    }
  }, [gender]);

  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      submitButtonText="Submit"
    >
      <MainGrid container spacing={2}>
        <MainGrid item xs={12} lg={6}>
          <SearchComboBox
            name="wardName"
            label="Ward Name"
            options={filteredWardOptions}
            multiple={false}
          />
        </MainGrid>

        <MainGrid item xs={12} lg={6}>
          <TextInputField
            id="bedNumber"
            name="bedNumber"
            label="Bed Number"
            placeholder="Enter Bed Number"
            sx={{ width: "100%" }}
          />
        </MainGrid>

        <MainGrid item xs={12}>
          <TextInputField
            id="reasonForAdmission"
            name="reasonForAdmission"
            label="Reason for Admission"
            placeholder="Provide reason for admission"
            rows={4}
            multiline
            sx={{ width: "100%" }}
          />
        </MainGrid>

        <MainGrid item xs={12}>
          <SearchComboBox
            name="specialtyInvolved"
            label="Specialty Involved"
            options={specialtyOptions}
            multiple={false}
          />
        </MainGrid>
      </MainGrid>
    </FormikInit>
  );
}
