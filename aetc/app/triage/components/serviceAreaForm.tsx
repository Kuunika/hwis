import { SelectInputField, FormikInit, MainButton, FormValuesListener, TextInputField, FormContainer, FormFieldContainer, SearchComboBox } from "@/components";
import * as Yup from "yup";
import { concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import { useEffect, useState } from "react";
import { getConceptSet } from "@/hooks/getConceptSet";
import { CircularProgress } from "@mui/material";

type Prop = {
  onSubmit: (values: any) => void;
  triageStatus: string;
};





export const ServiceAreaForm = ({ onSubmit, triageStatus }: Prop) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [showOther, setShowOther] = useState(false);
  const [otherId, setOtherId] = useState<string | null>(null);
  const [serviceAreaOptions, setServiceAreaOptions] = useState<{ label: string; id: string }[]>([]);

  const { data: serviceAreas, isLoading: serviceAreaLoading } = getConceptSet("Service areas");
  const { data: aetcServiceAreas, isLoading: aetcServiceAreaLoading } = getConceptSet("AETC service areas");

  const form = {
    Referred: {
      name: concepts.PATIENT_REFERRED_TO,
      label: "Patient Referred to",
    },
    Other_Area: {
      name: concepts.OTHER_AETC_SERVICE_AREA,
      label: "Other Area",
    },
  };

  const initialValues = getInitialValues(form);

  useEffect(() => {
    if (triageStatus && (serviceAreas || aetcServiceAreas)) {
      const selectedList = triageStatus === "yellow" ? aetcServiceAreas : serviceAreas;

      if (selectedList) {
        const options = selectedList.map((serviceArea: any) => ({
          label: serviceArea.name,
          id: serviceArea.uuid,
        }));
        setServiceAreaOptions(options);
        const otherOption = options.find((option: { id: string, label: string }) => option.label === "Other");
        setOtherId(otherOption ? otherOption.id : null);
      }
    }
  }, [triageStatus, serviceAreas, aetcServiceAreas]);

  useEffect(() => {
    if (formValues && otherId !== null) {
      const showOther = formValues[form.Referred.name] && formValues[form.Referred.name] === otherId
      setShowOther(showOther);
      if (!showOther) {
        setFormValues((prev) => {
          delete prev[form.Other_Area.name];
          return prev;
        });
    }}
  }, [formValues, otherId]);

  const schema = Yup.object().shape({
    [form.Referred.name]: Yup.string().label(form.Referred.label).required("This field is required"),
    [form.Other_Area.name]: Yup.string().when(form.Referred.name, {
      is: (serviceArea: string) => serviceArea === otherId,
      then: (schema) => schema.required("This field is required"),
      otherwise: (schema) => schema.optional(),
    }),
  });

  return (
    <>{(aetcServiceAreaLoading || serviceAreaLoading) && <CircularProgress />}
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={true}
    >
      <FormValuesListener getValues={setFormValues} />
      <FormFieldContainer direction="column">
        {serviceAreaOptions.length > 0 && (
          <SearchComboBox name={form.Referred.name} label={form.Referred.label} options={serviceAreaOptions} multiple={false} />
        )}

        {showOther && <TextInputField id={form.Other_Area.name} name={form.Other_Area.name} label={form.Other_Area.label} />}
      </FormFieldContainer>

    </FormikInit>
    </>
  );
};