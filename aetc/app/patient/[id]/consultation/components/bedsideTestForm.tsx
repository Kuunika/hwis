// BedsideTestForm.tsx - Main Component
import { FormFieldContainerMultiple, FormikInit } from "@/components";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { encounters } from "@/constants";
import { getDateTime } from "@/helpers/dateTime";
import { getActivePatientDetails } from "@/hooks";
import {
  fetchConceptAndCreateEncounter,
  getPatientsEncounters,
} from "@/hooks/encounter";
import { Form } from "formik";
import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";

import { useBedsideFormData } from "@/hooks/useBedsideFormData";
import { FormRenderer } from "@/components/FormRenderer";
import { transformLabValues } from "@/utils/dataTransformer";

export const BedsideTestForm = ({ onClose }: { onClose?: () => void }) => {
  const { activeVisit, patientId } = getActivePatientDetails();

  const { mutate, isPending, isSuccess } = fetchConceptAndCreateEncounter();
  const { data: BedSideResults, isLoading: bedsideLoading } =
    getPatientsEncounters(
      patientId as string,
      `encounter_type=${encounters.BED_SIDE_TEST}`
    );
  const { data: encounterData, refetch } = getPatientsEncounters(
    patientId as string,
    `encounter_type=${encounters.BEDSIDE_INVESTIGATION_PLAN}`
  );

  const { formStructure, initialValues, validationSchema } = useBedsideFormData(
    encounterData,
    BedSideResults,
    bedsideLoading
  );

  useEffect(() => {
    refetch();
  });

  useEffect(() => {
    if (!isSuccess) return;
    toast.success("Bedside test submitted successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  }, [isSuccess]);

  const handleSubmit = (values: any) => {
    const dateTime = getDateTime();
    const transformedData = transformLabValues(values, formStructure, dateTime);
    console.log("🚀 ~ handleSubmit ~ transformedData:", transformedData);

    if (transformedData.length > 0) {
      mutate({
        encounterType: encounters.BED_SIDE_TEST,
        visit: activeVisit,
        patient: patientId,
        encounterDatetime: dateTime,
        obs: transformedData,
      });
    }
    // onClose?.();
  };

  return (
    <ContainerLoaderOverlay loading={isPending}>
      <FormikInit
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        initialValues={{ ...initialValues }}
      >
        <Form>
          <FormRenderer formStructure={formStructure} />
        </Form>
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
