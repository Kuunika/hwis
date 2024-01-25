import { YES } from "@/constants";
import { TriageResult } from "@/interfaces";
import { useEffect, useState } from "react";

export const useConditions = () => {
  const [conditions, useConditions] = useState<any>({});
  const [triageResult, setTriageResult] = useState<TriageResult>("");
  const [aggregateOrCondition, setAggregateOrCondition] =
    useState<boolean>(false);

  const updateConditions = (prop: string, formValue: string) => {
    if (formValue == "") {
      return;
    }

    useConditions((values: any) => {
      return { ...values, [prop]: formValue == YES };
    });
  };

  useEffect(() => {
    const formConditions = Object.keys(conditions);

    const aggregOrCondition = formConditions.reduce((acc, currentValue) => {
      return acc || conditions[currentValue];
    }, false);

    if (aggregOrCondition) {
      setTriageResult("red");
    } else {
      setTriageResult("");
    }

    setAggregateOrCondition(aggregOrCondition);
  }, [conditions]);

  return {
    conditions,
    updateConditions,
    triageResult,
    aggregateOrCondition,
    setTriageResult,
  };
};
