import { FormikInit, GenericDialog, SearchComboBox } from "@/components";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { concepts, encounters } from "@/constants";
import { getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { getObservation } from "@/helpers/emr";
import { getActivePatientDetails, useNavigation, useSubmitEncounter } from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getConceptSet } from "@/hooks/getConceptSet";
import { closeCurrentVisit } from "@/hooks/visit";
import { Box, Button, Typography } from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

const schema = yup.object().shape({
  [concepts.PATIENT_REFERRED_TO]: yup.string().required("Patient Referred To"),
});

type Props = {
  open: boolean;
  onClose: () => void;
};
export const ShowUnderAgeDialog = ({ open, onClose }: Props) => {
  const [no, setNo] = useState(false);
  const { activeVisitId, activeVisit } = getActivePatientDetails();
  const { data: serviceAreas, isLoading: serviceAreaLoading } = getConceptSet(
    concepts.SERVICE_AREAS
  );
  const { mutate: closeVisit, isSuccess: visitClosed, isPending  } = closeCurrentVisit();
  const {navigateTo}=useNavigation()



  useEffect(() => {
    if (visitClosed) { 
      onClose();
      navigateTo(`/dashboard`);

    }
  }, [visitClosed]);

  const onFinishSubmission = () => {
    closeVisit( activeVisit as string);
  };

  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.PATIENT_CARE_AREA,
    onFinishSubmission
  );

  const handleSubmitForm = (values: any) => {
    handleSubmit(getObservations(values, getDateTime()));
  };

  return (
    <GenericDialog
      open={open}
      title="Under Age"
      maxWidth="sm"
      onClose={onClose}
    >
      <ContainerLoaderOverlay loading={serviceAreaLoading || isLoading ||isPending}>
        <Typography variant="body1" gutterBottom>
          {" "}
          The patient is below the age of 13. Do you want to proceed with the
          registration?
        </Typography>
        <Box>
          <Button variant="contained" onClick={onClose}>
            Yes
          </Button>
          <Button onClick={() => setNo(true)}>No</Button>
        </Box>
        {no && (
          <>
            <br />
            <Typography variant="body1" gutterBottom>
              Select the service areas you would like to direct the patient
            </Typography>
            <br />
            <FormikInit
              onSubmit={handleSubmitForm}
              validationSchema={schema}
              initialValues={{ [concepts.PATIENT_REFERRED_TO]: "" }}
            >
              {serviceAreas.length > 0 && (
                <SearchComboBox
                  name={concepts.PATIENT_REFERRED_TO}
                  label={"Areas"}
                  options={serviceAreas.map((serviceArea: any) => ({
                    label: serviceArea.name,
                    id: serviceArea.uuid,
                  }))}
                  multiple={false}
                />
              )}
            </FormikInit>
          </>
        )}
      </ContainerLoaderOverlay>
    </GenericDialog>
  );
};
