import { getPatientEncounters } from "@/services/encounter";
import { TriagePrintTemplate } from "../barcode";
import { GenericDialog } from "../dialog";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Button } from "@mui/material";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { concepts, encounters } from "@/constants";
import { useEffect, useState } from "react";
import { VitalFormConfig } from "@/app/vitals/components/vitalsForm";
import { getObservationValue } from "@/helpers/emr";
import { Obs } from "@/interfaces";
import { getHumanReadableDateTime } from "@/helpers/dateTime";

type Props = {
    open: boolean;
    onClose: () => void;
    presentingComplaints: string;
    triageCategory: string;
    date: string;
    referredFrom: string;
    triagedBy: string;
    vitals: Array<any>;
    arrivalTime: string
};

export const PatientTriageBarcodePrinter = (props: Props) => {

    console.log({ props })
    return <GenericDialog
        maxWidth="sm"
        open={props.open}
        onClose={props.onClose}
        title="Print Triage details"
    >
        <TriagePrintTemplate
            presentingComplaints={props.presentingComplaints}
            triageCategory={props.triageCategory}
            date={props.date}
            arrivalTime={props.arrivalTime}
            referredFrom={props.referredFrom}
            triagedBy={props.triagedBy}
            vitals={props.vitals}
        />
    </GenericDialog>;
};


export const FetchAndDisplayTriageBarcode = ({ patientId, activeVisitId, arrivalDateTime }: { patientId: string, activeVisitId: number, arrivalDateTime: string }) => {
    const { data } = getPatientsEncounters(patientId);
    const [vitals, setVitals] = useState<Array<{ name: string, value: string }>>([])
    const [presentingComplaints, setPresentingComplaints] = useState<string>('')
    const [referred, setReferred] = useState('')
    const [triageCategory, setTriageCategory] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [triagedBy, setTriagedBy] = useState('')
    const [open, setOpen] = useState(false)

    useEffect(() => {
        extractTriageEncounters()
    }, [data])


    const extractTriageEncounters = () => {
        const referral = getEncounterActiveVisit(encounters.REFERRAL);
        setReferred(getObservationValue(referral?.obs, concepts.REFERRED_FROM))
        const presentingComplaints = getEncounterActiveVisit(encounters.PRESENTING_COMPLAINTS)
        setPresentingComplaints(presentingComplaints?.obs.reduce((prev: any, current: Obs) => {
            return prev == "" ? current.value_text : prev + "," + current.value_text
        }, '') as string)


        const triage = getEncounterActiveVisit(encounters.TRIAGE_RESULT)

        setTriageCategory(triage?.obs[0].value)
        setDateTime(getHumanReadableDateTime(triage?.encounter_datetime))
        setTriagedBy(triage?.created_by as string)

        const encounter = getEncounterActiveVisit(encounters.VITALS)
        const obs = encounter?.obs ?? [];
        const vitals = [
            { name: VitalFormConfig.saturationRate.short, value: getObservationValue(obs, VitalFormConfig.saturationRate.name) },
            { name: VitalFormConfig.heartRate.short, value: getObservationValue(obs, VitalFormConfig.heartRate.name) },
            { name: VitalFormConfig.bloodPressure.short, value: `${getObservationValue(obs, VitalFormConfig.bloodPressure.name)}/${getObservationValue(obs, VitalFormConfig.bloodPressureDiastolic.name)}` },
            { name: VitalFormConfig.respiratoryRate.short, value: getObservationValue(obs, VitalFormConfig.respiratoryRate.name) },
            { name: VitalFormConfig.temperature.short, value: getObservationValue(obs, VitalFormConfig.temperature.name) },
            { name: VitalFormConfig.avpu.label, value: getObservationValue(obs, VitalFormConfig.avpu.name) },
            { name: `${VitalFormConfig.glucose.label}(${getObservationValue(obs, VitalFormConfig.units.name)}`, value: getObservationValue(obs, VitalFormConfig.glucose.name) },
        ]
        setVitals(vitals)

    }


    const getEncounterActiveVisit = (encounterType: string) => {
        return data?.filter(
            (d) => d?.encounter_type.uuid == encounterType
        ).find(d => d.visit_id == activeVisitId);
    }

    return <>
        <Button variant="text" sx={{ fontSize: "12px", color: "ButtonText", textTransform: "capitalize", textAlign: "left" }} onClick={() => setOpen(true)}>Triage</Button>
        <PatientTriageBarcodePrinter arrivalTime={getHumanReadableDateTime(arrivalDateTime)} open={open} onClose={() => setOpen(false)} triageCategory={triageCategory} triagedBy={triagedBy} referredFrom={referred} date={dateTime} presentingComplaints={presentingComplaints} vitals={vitals} />
    </>
}