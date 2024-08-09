"use client";
import { useEffect, useState } from "react";
import { GenericDialog, MainButton, NewStepperContainer } from "@/components";
import {
  AirwayAndBreathingForm,
  BloodCirculationForm,
  ConsciousnessForm,
  PersistentPainForm,
  PresentingComplaintsForm,
  TriageContainer,
} from ".";
import { VitalFormConfig, VitalsForm } from "@/app/vitals/components/vitalsForm";
import { useNavigation, useParameters } from "@/hooks";

import { concepts, encounters } from "@/constants";
import { getObservations, } from "@/helpers";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { useFormLoading } from "@/hooks/formLoading";
import { CustomizedProgressBars } from "@/components/loader";
import { FormError } from "@/components/formError";
import { OperationSuccess } from "@/components/operationSuccess";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { getPatientsWaitingForTriage, getPatientVisitTypes } from "@/hooks/patientReg";
import { ServiceAreaForm } from "./serviceAreaForm";
import { Encounter, TriageResult } from "@/interfaces";
import { Bounce, toast } from "react-toastify";
import { DisplayNone } from "@/components/displayNoneWrapper";
import { closeCurrentVisit } from "@/hooks/visit";

import { getObservationValue } from "@/helpers/emr";
import { PatientTriageBarcodePrinter } from "@/components/barcodePrinterDialogs";

export default function TriageWorkFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const { params } = useParameters();
  const [triageResult, setTriageResult] = useState<TriageResult>("");
  const [continueTriage, setContinueTriage] = useState(false)
  const { data: triageList } = getPatientsWaitingForTriage();
  const [conceptTriageResult, setConceptTriageResult] = useState<any>({})
  const [submittedSteps, setSubmittedSteps] = useState<Array<number>>([])

  const [presentingComplaints, setPresentingComplaints] = useState<any>({})
  const [vitals, setVitals] = useState<any>({})
  const [airway, setAirway] = useState({})
  const [circulation, setCirculation] = useState({})
  const [consciousness, setConsciousness] = useState({})
  const [persistentPain, setPersistentPain] = useState({})
  const [showModal, setShowModal] = useState(false);

  const [triagePrintOpen, setTriagePrintOpen] = useState(false)
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
    data: presentingComplaintsResponse
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
  const { data: patientVisits, isLoading, isSuccess } = getPatientVisitTypes(params?.id as string);
  const activeVisit = patientVisits?.find(d => !Boolean(d.date_stopped));


  const { mutate: closeVisit, isSuccess: visitClosed } = closeCurrentVisit();

  const { data } = getPatientsEncounters(params?.id as string);
  const [referral, setReferral] = useState<Encounter>()
  const [initialRegistration, setInitialRegistration] = useState<Encounter>()


  const getEncounterActiveVisit = (encounterType: string) => {
    return data?.filter(
      (d) => d?.encounter_type.uuid == encounterType
    ).find(d => d.visit_id == activeVisit?.visit_id);
  }

  const dateTime = getDateTime();


  useEffect(() => {
    setReferral(getEncounterActiveVisit(encounters.REFERRAL))
    setInitialRegistration(getEncounterActiveVisit(encounters.INITIAL_REGISTRATION))
  }, [data])

  const referralHealthFacility = getObservationValue(referral?.obs, concepts.REFERRED_FROM);

  useEffect(() => {
    if (presentingCreated) {
      setCompleted(1);
      setMessage("adding vitals...");

      createVitals({
        encounterType: encounters.VITALS,
        visit: activeVisit?.uuid,
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
        visit: activeVisit?.uuid,
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
        visit: activeVisit?.uuid,
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
        visit: activeVisit?.uuid,
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
        visit: activeVisit?.uuid,
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

      if (triageResult == 'green') {
        setShowModal(true);
      }
      createTriageResult({
        encounterType: encounters.TRIAGE_RESULT,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: [{
          concept: concepts.TRIAGE_RESULT,
          value: triageResult,
          obsDatetime: dateTime
        },
        {
          concept: concepts.PATIENT_REFERRED_TO,
          value: formData.serviceArea[concepts.PATIENT_REFERRED_TO],
          obsDatetime: getDateTime(),
        }
        ]
      });
    }

    setMessage("closing visit...");
    closeVisit(activeVisit?.uuid as string);
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
    setShowForm(false);
    if (triageResult == 'green') {
      setShowModal(true);
    }
    // setLoading(true);
    // 
    // setMessage("adding complaints...");
    // createPresenting({
    //   encounterType: encounters.PRESENTING_COMPLAINTS,
    //   visit: activeVisit?.uuid,
    //   patient: params.id,
    //   encounterDatetime: dateTime,
    //   obs: formData.presentingComplaints,
    // });
  };

  const handleVitalsSubmit = (values: any) => {
    formData["vitals"] = values;
    setActiveStep(2);
    setSubmittedSteps(steps => [...steps, 1])
  };

  const handleAirwaySubmit = (values: any) => {
    formData["airway"] = values;
    setActiveStep(3);
    setSubmittedSteps(steps => [...steps, 2])
  };
  const handleBloodCirculationSubmit = (values: any) => {
    formData["bloodCirculation"] = values;
    setActiveStep(4);
    setSubmittedSteps(steps => [...steps, 3])
  };
  const handleDisabilitySubmit = (values: any) => {
    formData["disability"] = values;
    setActiveStep(5);
    setSubmittedSteps(steps => [...steps, 4])
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
    setSubmittedSteps(steps => [...steps, 0])
  };

  const handleServiceArea = (values: any) => {
    formData["serviceArea"] = values;
    setMessage("adding next service area...");
    setLoading(true);

    setMessage("adding complaints...");
    createPresenting({
      encounterType: encounters.PRESENTING_COMPLAINTS,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: formData.presentingComplaints,
    });

    setShowModal(false);
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

  const handleClickAccordion = (activeStep: any) => {
    const found = submittedSteps.find(step => step == activeStep);

    if (found != undefined) setActiveStep(activeStep);

    // TODO: send a message that you can't move
  }

  const closeModal = () => {
    setShowModal(false);
    navigateBack();
  };


  const handleOnCompleteTriage = () => {
    handlePresentComplaints(presentingComplaints);
    handleAirwaySubmit(airway);
    handleBloodCirculationSubmit(circulation)
    handleDisabilitySubmit(circulation)
    handleVitalsSubmit(vitals)
    handlePersistentPain(persistentPain)
  }

  return (
    <>

      <DisplayNone hidden={!showForm}>
        {triageResult && (
          <>

            <TriageContainer
              onCompleteTriage={handleOnCompleteTriage}
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
          // onClickAccordion={handleClickAccordion}
          active={activeStep}
          onBack={() => navigateBack()}
        >
          <PresentingComplaintsForm getFormValues={setPresentingComplaints} triageResult={triageResult}
            setTriageResult={checkTriageResult} onSubmit={handlePresentComplaints} />
          <VitalsForm
            previous={() => setActiveStep(0)}
            triageResult={triageResult}
            setTriageResult={checkTriageResult}
            initialValues={{}}
            onSubmit={handleVitalsSubmit}
            continueTriage={continueTriage}
            getFormValues={setVitals}
          />
          <AirwayAndBreathingForm
            getFormValues={setAirway}
            previous={() => setActiveStep(1)}
            continueTriage={continueTriage}
            triageResult={triageResult}
            setTriageResult={checkTriageResult} onSubmit={handleAirwaySubmit} />

          <BloodCirculationForm
            previous={() => setActiveStep(2)}
            getFormValues={setCirculation}
            continueTriage={continueTriage}
            triageResult={triageResult}
            setTriageResult={checkTriageResult}
            onSubmit={handleBloodCirculationSubmit} />

          <ConsciousnessForm
            getFormValues={setConsciousness}
            previous={() => setActiveStep(3)}
            continueTriage={continueTriage}
            triageResult={triageResult}
            setTriageResult={checkTriageResult}
            onSubmit={handleDisabilitySubmit} />
          <PersistentPainForm
            getFormValues={setPersistentPain}
            previous={() => setActiveStep(4)}
            continueTriage={continueTriage}
            setTriageResult={checkTriageResult}
            triageResult={triageResult}
            onSubmit={handlePersistentPain} />
        </NewStepperContainer >
      </DisplayNone >
      {completed == 7 && (
        <>
          <PatientTriageBarcodePrinter arrivalTime={getHumanReadableDateTime(initialRegistration?.encounter_datetime)} open={triagePrintOpen} onClose={() => setTriagePrintOpen(false)} presentingComplaints={presentingComplaints[concepts.COMPLAINTS].reduce((prev: any, current: any) => {
            return prev == "" ? current.id : prev + "," + current.id
          }, '')} triageCategory={triageResult}
            date={getHumanReadableDateTime(dateTime)}
            triagedBy={presentingComplaintsResponse?.created_by as string}
            referredFrom={referralHealthFacility}
            vitals={[
              { name: VitalFormConfig.saturationRate.short, value: vitals[VitalFormConfig.saturationRate.name] },
              { name: VitalFormConfig.heartRate.short, value: vitals[VitalFormConfig.heartRate.name] },
              { name: VitalFormConfig.bloodPressure.short, value: `${vitals[VitalFormConfig.bloodPressure.name]}/${vitals[VitalFormConfig.bloodPressureDiastolic.name]}` },
              { name: VitalFormConfig.respiratoryRate.short, value: vitals[VitalFormConfig.respiratoryRate.name] },
              { name: VitalFormConfig.temperature.short, value: vitals[VitalFormConfig.temperature.name] },
              { name: VitalFormConfig.avpu.label, value: vitals[VitalFormConfig.avpu.name] },
              { name: `${VitalFormConfig.glucose.label}(${vitals[VitalFormConfig.units.name]})`, value: vitals[VitalFormConfig.glucose.name] },
            ]} />

          <OperationSuccess
            title="Patient Triaged Successfully"
            primaryActionText="Triage more patients"
            secondaryActionText="Go Home"
            printButton={<MainButton sx={{ mx: "2px" }} variant="secondary" title={"print"} onClick={() => setTriagePrintOpen(true)} />}
            onPrimaryAction={() => {
              setShowForm(true);
              setCompleted(0);
              navigateTo("/triage");
            }}
            onSecondaryAction={() => navigateTo("/dashboard")}
          />
        </>
      )
      }

      {
        error && (
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
        )
      }

      <GenericDialog
        open={showModal}
        onClose={closeModal}
        title="Triage Decision"
      >
        <p>
          Triage status is <span style={{ color: 'green' }}>GREEN</span>. Where should this patient go next?
        </p>
        <ServiceAreaForm onSubmit={handleServiceArea} />
      </GenericDialog>

      {
        loading && !error && (
          <>
            <br />
            <br />
            <CustomizedProgressBars
              message={message}
              progress={(completed / 7) * 100}
            />
          </>
        )
      }
    </>
  );
}
