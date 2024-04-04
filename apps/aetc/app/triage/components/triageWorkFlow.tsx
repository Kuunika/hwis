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
import { getObservations, } from "@/helpers";
import { addEncounter } from "@/hooks/encounter";
import { useFormLoading } from "@/hooks/formLoading";
import { CustomizedProgressBars } from "@/components/loader";
import { FormError } from "@/components/formError";
import { OperationSuccess } from "@/components/operationSuccess";
import { getDateTime } from "@/helpers/dateTime";
import { getPatientsWaitingForTriage } from "@/hooks/patientReg";
import { TriageResult } from "@/interfaces";
import { Bounce, ToastContainer, toast } from "react-toastify";

export default function TriageWorkFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const { params } = useParameters();
  const [triageResult, setTriageResult] = useState<TriageResult>("");
  const [continueTriage, setContinueTriage] = useState(false)
  const { data: triageList } = getPatientsWaitingForTriage();
  const [conceptTriageResult, setConceptTriageResult] = useState<any>({})


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

  const {
    mutate: createTriageResult,
    isSuccess: triageResultCreated,
    isPending: creatingTriageResult,
    isError: triageResultError,
  } = addEncounter();

  const { navigateTo, navigateBack } = useNavigation();

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
      setCompleted(6);
      setMessage("finalizing...");

      createTriageResult({
        encounterType: encounters.TRIAGE_RESULT,
        visit: patient?.visit_uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: [{
          concept: concepts.TRIAGE_RESULT,
          value: triageResult,
          obsDatetime: dateTime
        }]
      });
    }
  }, [painCreated]);

  useEffect(() => {
    if (triageResultCreated) {
      setCompleted(7);
      setLoading(false);
    }
  }, [triageResultCreated]);

  // useEffect(() => {
  //   if (painCreated) {
  //     setCompleted(6);
  //     setLoading(false);
  //   }
  // }, [painCreated]);

  useEffect(() => {
    const error =
      presentingError ||
      vitalsError ||
      airwayError ||
      bloodError ||
      disabilityError ||
      triageResultError ||
      painError


    setError(error);
  }, [
    presentingError,
    vitalsError,
    airwayError,
    bloodError,
    disabilityError,
    painError,
    triageResultError
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


  useEffect(() => {
    let tResult = '';
    const keys = Object.keys(conceptTriageResult);

    for (let i = 0; i < keys.length; i++) {

      if (conceptTriageResult[keys[i]] == 'red') {
        tResult = 'red';
        break;
      }
      if (conceptTriageResult[keys[i]] == 'yellow') {
        tResult = 'yellow';
      }

      if (tResult != 'yellow') {
        tResult = "green"
      }
    }

    setTriageResult(tResult as TriageResult)
  }, [conceptTriageResult])


  useEffect(() => {

    if (triageResult == 'red') {
      toast.error('Triage Red', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

    }
    if (triageResult == "yellow") {
      toast.warn('Triage Yellow', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }

  }, [triageResult])

  const checkTriageResult = (triage: TriageResult, name: string) => {
    setConceptTriageResult((concept: any) => {
      return { ...concept, [name]: triage }
    })

  }
  return (
    <>
      {showForm && (
        <>
          {triageResult && (
            <>
              <TriageContainer
                onCompleteTriage={() => { }}
                result={triageResult}
                message={"Interventions"}
                setContinueTriage={setContinueTriage}
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
            onBack={() => navigateBack()}
          >
            <PresentingComplaintsForm onSubmit={handlePresentComplaints} />
            <VitalsForm
              previous={() => setActiveStep(0)}
              triageResult={triageResult}
              setTriageResult={checkTriageResult}
              initialValues={{}}
              onSubmit={handleVitalsSubmit}
              continueTriage={continueTriage}
            />
            <AirwayAndBreathingForm
              previous={() => setActiveStep(1)}
              continueTriage={continueTriage}
              triageResult={triageResult}
              setTriageResult={checkTriageResult} onSubmit={handleAirwaySubmit} />
            <BloodCirculationForm
              previous={() => setActiveStep(2)}
              continueTriage={continueTriage}
              triageResult={triageResult}
              onSubmit={handleBloodCirculationSubmit} />
            <ConsciousnessForm
              previous={() => setActiveStep(3)}
              continueTriage={continueTriage}
              triageResult={triageResult}
              setTriageResult={checkTriageResult}
              onSubmit={handleDisabilitySubmit} />
            <PersistentPainForm
              previous={() => setActiveStep(4)}
              continueTriage={continueTriage}
              triageResult={triageResult}
              onSubmit={handlePersistentPain} />
          </NewStepperContainer>
        </>
      )}
      {completed == 7 && (
        <OperationSuccess
          title="Patient Triaged Successfully"
          primaryActionText="Triage more patients"
          secondaryActionText="Go Home"
          onPrimaryAction={() => {
            setShowForm(true);
            setCompleted(0);
            navigateTo("/triage");
          }}
          onSecondaryAction={() => navigateTo("/dashboard")}
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
            progress={(completed / 7) * 100}
          />
        </>
      )}
    </>
  );
}
