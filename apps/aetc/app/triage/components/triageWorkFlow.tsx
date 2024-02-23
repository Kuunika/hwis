"use client";
import { useEffect, useState } from "react";
import { NewStepperContainer, StepperContainer } from "shared-ui/src";
import {
  AirwayAndBreathingForm,
  BloodCirculationForm,
  ConsciousnessForm,
  PersistentPainForm,
  PresentingComplaintsForm,
  TriageContainer,
} from ".";
import { VitalsForm } from "@/app/vitals/components/vitalsForm";
import { useNavigation, useParameters } from "@/hooks";

import { concepts, encounters } from "@/constants";
import { getObservations,  } from "@/helpers";
import { addEncounter } from "@/hooks/encounter";
import { useFormLoading } from "@/hooks/formLoading";
import { CustomizedProgressBars } from "@/components/loader";
import { FormError } from "@/components/formError";
import { OperationSuccess } from "@/components/operationSuccess";
import { getDateTime } from "@/helpers/dateTime";
import { getPatientsWaitingForTriage } from "@/hooks/patientReg";
import { TriageResult } from "@/interfaces";

export default function TriageWorkFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const { params } = useParameters();
  const [triageResult, setTriageResult] = useState<TriageResult>("");
  const { data: triageList } = getPatientsWaitingForTriage();
  const {
    loading,
    setLoading,
    completed,
    setCompleted,
    message,
    setMessage,
    showForm,
    setShowForm,
    error,
    setError,
  } = useFormLoading();

  const {
    mutate: createPresenting,
    isSuccess: presentingCreated,
    isPending: creatingPresenting,
    isError: presentingError,
  } = addEncounter();
  const {
    mutate: createVitals,
    isSuccess: vitalsCreated,
    isPending: creatingVitals,
    isError: vitalsError,
  } = addEncounter();
  const {
    mutate: createAirway,
    isSuccess: airwayCreated,
    isPending: creatingAirway,
    isError: airwayError,
  } = addEncounter();
  const {
    mutate: createBlood,
    isSuccess: bloodCreated,
    isPending: creatingBlood,
    isError: bloodError,
  } = addEncounter();
  const {
    mutate: createDisability,
    isSuccess: disabilityCreated,
    isPending: creatingDisability,
    isError: disabilityError,
  } = addEncounter();
  const {
    mutate: createPain,
    isSuccess: painCreated,
    isPending: creatingPain,
    isError: painError,
  } = addEncounter();

  const { navigateTo } = useNavigation();

  const steps = [
    { id: 6, label: "Presenting Complaints" },
    { id: 5, label: "Vitals Signs" },
    { id: 1, label: "Airway/Breathing" },
    { id: 2, label: "Blood Circulation" },
    { id: 3, label: "Disability" },
    { id: 4, label: "Persistent Pain/Other Concerns" },
  ];

  const patient = triageList?.find((d) => d.uuid == params.id);
  const dateTime = getDateTime();

  useEffect(() => {
    if (presentingCreated) {
      setCompleted(1);
      setMessage("adding vitals...");

      createVitals({
        encounterType: encounters.VITALS,
        visit: patient?.visit_uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: getObservations(formData.vitals, dateTime),
      });
    }
  }, [presentingCreated]);

  useEffect(() => {
    if (vitalsCreated) {
      setCompleted(2);
      setMessage("adding airway...");

      createAirway({
        encounterType: encounters.AIRWAY_ASSESSMENT,
        visit: patient?.visit_uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: getObservations(formData.airway, dateTime),
      });
    }
  }, [vitalsCreated]);

  useEffect(() => {
    if (airwayCreated) {
      setCompleted(3);
      setMessage("adding blood circulation data...");

      createBlood({
        encounterType: encounters.BLOOD_CIRCULATION,
        visit: patient?.visit_uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: getObservations(formData.bloodCirculation, dateTime),
      });
    }
  }, [airwayCreated]);

  useEffect(() => {
    if (bloodCreated) {
      setCompleted(4);
      setMessage("adding disability...");

      createDisability({
        encounterType: encounters.DISABILITY_ASSESSMENT,
        visit: patient?.visit_uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: getObservations(formData.disability, dateTime),
      });
    }
  }, [bloodCreated]);

  useEffect(() => {
    if (disabilityCreated) {
      setCompleted(5);
      setMessage("adding pain and persistent...");

      createPain({
        encounterType: encounters.PERSISTENT_PAIN,
        visit: patient?.visit_uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: getObservations(formData.pain, dateTime),
      });
    }
  }, [disabilityCreated]);

  useEffect(() => {
    if (painCreated) {
      setLoading(false);
      setCompleted(6);
    }
  }, [painCreated]);

  useEffect(() => {
    const error =
      presentingError ||
      vitalsError ||
      airwayError ||
      bloodError ||
      disabilityError ||
      painError;

    setError(error);
  }, [
    presentingError,
    vitalsError,
    airwayError,
    bloodError,
    disabilityError,
    painError,
  ]);

  const handlePersistentPain = (values: any) => {
    formData["pain"] = values;
    setLoading(true);
    setShowForm(false);
    setMessage("adding complaints...");
    createPresenting({
      encounterType: encounters.PRESENTING_COMPLAINTS,
      visit: patient?.visit_uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: formData.presentingComplaints,
    });
  };

  const handleVitalsSubmit = (values: any) => {
    formData["vitals"] = values;
    setActiveStep(2);
  };

  const handleAirwaySubmit = (values: any) => {
    formData["airway"] = values;
    setActiveStep(3);
  };
  const handleBloodCirculationSubmit = (values: any) => {
    formData["bloodCirculation"] = values;
    setActiveStep(4);
  };
  const handleDisabilitySubmit = (values: any) => {
    formData["disability"] = values;
    setActiveStep(5);
  };

  const handlePresentComplaints = (values: any) => {
    formData["presentingComplaints"] = values[concepts.COMPLAINTS].map(
      (v: any) => ({
        concept: concepts.COMPLAINTS,
        value: v.id,
        obsDatetime: dateTime,
      })
    );
    setActiveStep(1);
  };
  return (
    <>
      {showForm && (
        <>
          {triageResult && (
            <>
              <TriageContainer
                onCompleteTriage={() => {}}
                result={triageResult}
                message={"Interventions"}
              />
              <br />
            </>
          )}
          <NewStepperContainer
            setActive={(value) => {
              setActiveStep(value);
            }}
            title="Triage"
            steps={steps}
            active={activeStep}
            onBack={() => navigateTo("/patient")}
          >
            <PresentingComplaintsForm onSubmit={handlePresentComplaints} />
            <VitalsForm
              triageResult={triageResult}
              setTriageResult={setTriageResult}
              initialValues={{}}
              onSubmit={handleVitalsSubmit}
            />
            <AirwayAndBreathingForm onSubmit={handleAirwaySubmit} />
            <BloodCirculationForm onSubmit={handleBloodCirculationSubmit} />
            <ConsciousnessForm onSubmit={handleDisabilitySubmit} />
            <PersistentPainForm onSubmit={handlePersistentPain} />
          </NewStepperContainer>
        </>
      )}
      {completed == 6 && (
        <OperationSuccess
          title="Patient Triaged Successful"
          primaryActionText="Triage more patients"
          secondaryActionText="Go Home"
          onPrimaryAction={() => {
            setShowForm(true);
            setCompleted(0);
            navigateTo("/triage");
          }}
          onSecondaryAction={() => {}}
        />
      )}

      {error && (
        <FormError
          error={message}
          onPrimaryAction={() => {
            setError(false);
            setCompleted(0);
            setLoading(false);
            setShowForm(true);
          }}
          onSecondaryAction={() => {
            setCompleted(0);
            setShowForm(true);
            setLoading(false);
            setError(false);
          }}
        />
      )}

      {loading && !error && (
        <>
          <br />
          <br />
          <CustomizedProgressBars
            message={message}
            progress={(completed / 6) * 100}
          />
        </>
      )}
    </>
  );
}
