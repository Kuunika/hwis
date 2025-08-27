"use client";
import { useEffect, useState } from "react";
import { checkIfPatientIsOnWaitingForAssessmentList } from "./patientReg";

export const checkPatientIfOnWaitingAssessment = (patientId: string) => {
  const [isOnList, setIsOnList] = useState(false);

  const { data } = checkIfPatientIsOnWaitingForAssessmentList(patientId);

  useEffect(() => {
    setIsOnList(Boolean(data));
  }, [data, patientId]);

  return { isOnList: true };
};
