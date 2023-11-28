import { useState } from "react";

export const useConditions = () => {
  const [conditions, useConditions] = useState<any>({});

  const updateConditions = (prop: string, formValue: string) => {
    if (formValue == undefined) {
      return;
    }
    useConditions((values: any) => {
      return { ...values, [prop]: formValue == "true" };
    });
  };

  return { conditions, updateConditions };
};
