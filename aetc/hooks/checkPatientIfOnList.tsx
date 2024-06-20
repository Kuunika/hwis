import { useEffect, useState } from "react"
import { getPatientsWaitingForAssessment } from "./patientReg";

export const checkPatientIfOnWaitingAssessment = (patientId: string) => {
    const [isOnList, setIsOnList] = useState(false);
    const { data: patients } = getPatientsWaitingForAssessment();

    useEffect(() => {

        const found = patients?.find(p => p.uuid == patientId);

        if (found) return setIsOnList(true)

        setIsOnList(false)

    }, [patients, patientId])

    return { isOnList }

}