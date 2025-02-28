import { useEffect, useState } from "react";
import {
  MainTypography,
  WrapperBox,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  Header,
} from "@/components";
import { Concept, LabFormProps, LabRequest, TestType } from "@/interfaces";
import {
  createOrder,
  getConceptSetMembers,
  getLabSpecimenTypes,
  getLabTestReason,
  getLabTestTypes,
} from "@/hooks/labOrder";
import { getActivePatientDetails, useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { getDateTime } from "@/helpers/dateTime";
import * as Yup from "yup";
import { Typography } from "@mui/material";

export const LabRequestForm = ({ onClose, addRequest }: LabFormProps) => {
  const [sampleName, setSampleName] = useState<string>("");
  const [request, setRequest] = useState<any>({});
  const {
    data: specimenTypes,
    isLoading,
    isSuccess,
    refetch: refetchLabSpecimen,
    isRefetching: refetchingLabSpecimen,
  } = getLabSpecimenTypes();
  const {
    data: labTests,
    isLoading: loadingTests,
    isSuccess: testLoaded,
    refetch,
    isRefetching,
  } = getLabTestTypes(sampleName);
  const [testType, setTestType] = useState("");
  const [sampleId, setSampleId] = useState("");
  const [bedsideTestId, setBedsideTestId] = useState("");
  const {
    data: bedsideSampleTypes,
    isLoading: bedsideLoading,
    refetch: reloadSamples,
    isRefetching: reloading,
  } = getConceptSetMembers(sampleId);

  const {
    data: bedsideTests,
    isLoading: bedsideTestsLoading,
    refetch: reloadBedSideTests,
    isRefetching: reloadingBedsideTest,
  } = getConceptSetMembers(bedsideTestId);

  const [samples, setSamples] = useState<Concept[]>([]);
  const [tests, setTests] = useState<Concept[]>([]);

  const { params } = useParameters();
  // const { data: patient } = getOnePatient(params.id as string);
  const { activeVisit, patientId } = getActivePatientDetails();
  const { mutate, isPending, isSuccess: orderCreated } = createOrder();

  useEffect(() => {
    refetch();
  }, [sampleName]);

  useEffect(() => {
    reloadSamples();
  }, [sampleId]);

  useEffect(() => {
    if (!bedsideSampleTypes) return;
    const transformed = transformedBedsideSamples();
    setSamples(transformed);
  }, [bedsideSampleTypes]);

  useEffect(() => {
    if (!specimenTypes) return;
    setSamples(specimenTypes);
  }, [specimenTypes, refetchingLabSpecimen]);

  useEffect(() => {
    reloadBedSideTests();
  }, [bedsideTestId]);

  useEffect(() => {
    const transform = transformBedsideTests();
    setTests(transform);
  }, [bedsideTests]);

  useEffect(() => {
    if (!labTests) return;
    setTests(labTests);
  }, [labTests]);

  const transformedBedsideSamples = () => {
    if (!bedsideSampleTypes) return [];
    return bedsideSampleTypes
      .map((c) => ({
        ...c,
        names: c.names,
        name: c.names[0].name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const transformBedsideTests = () => {
    if (!bedsideTests) return [];
    const bedSideTestTypes = [
      "Random Blood Glucose (RBS)",
      "Fasting Blood Glucose (FBS)",
      "H. Pylori",
      "C-Reactive Protein (CRP)",
      "Haemoglobin",
      "Pregnancy Test",
      "HIV",
      "C-reactive protein",
      "Malaria Screening",
      "Blood Gas",
      "Urine Chemistries",
    ].map((name) => name.toLowerCase());

    return bedsideTests
      .filter((bed) => bed.names.length > 0 && bed.names.some((n) => n?.name))
      .map((bed) => ({
        ...bed,
        name: bed.names.find((n) => n?.name)?.name || "",
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((bed) => bedSideTestTypes.includes(bed.name?.toLowerCase()));
  };

  const handleLabSend = (values: any) => {
    const mappedTests = values?.tests.map((test: any) => {
      return {
        concept: tests?.find((lab) => lab.concept_id === test.id)?.names[0]
          ?.uuid,
      };
    });

    const order = {
      orders: [
        {
          patient: patientId,
          visit: activeVisit,
          tests: mappedTests,
          reason_for_test: "b998cdac-8d80-11d8-abbb-0024217bb78e",
          target_lab: "Blantyre Dream Project Clinic",
          date: getDateTime(),
          requesting_clinician: "admin",
          specimen: {
            concept: values.sampleType,
          },
        },
      ],
    };

    mutate(order);
    onClose();
  };

  return (
    <FormikInit
      initialValues={{ testType: "", sampleType: "" }}
      onSubmit={handleLabSend}
      validationSchema={Yup.object().shape({
        // testType: Yup.string().required().label("Test Type"),
        tests: Yup.array().required().label("Tests"),
        sampleType: Yup.string().required().label("Sample Type"),
      })}
    >
      <Typography variant="h6">Lab Order</Typography>
      <SearchComboBox
        getValue={setSampleName}
        multiple={false}
        label="Sample Type"
        name="sampleType"
        sx={{ mb: 2 }}
        options={
          samples
            ? samples.map((sp) => ({
                label: sp?.names[0]?.name,
                id: sp.names[0].uuid,
              }))
            : []
        }
      />
      <SearchComboBox
        label="Tests"
        name="tests"
        options={
          tests
            ? tests.map((d) => ({ id: d.concept_id, label: d.names[0]?.name }))
            : []
        }
      />
      <br />
      <WrapperBox sx={{ display: "flex", width: "50ch" }}>
        {/* <RadioGroupInput
          getValue={(test) => setTestType(test)}
          name="testType"
          options={[
            { value: "bedside", label: "Bed Side" },
            { value: "laboratory", label: "Laboratory" },
          ]}
          label="Test Type"
        /> */}
        <RadioGroupInput
          getValue={(test) => setTestType(test)}
          row
          name="emergency"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          label="Emergency"
        />
        <RadioGroupInput
          getValue={(test) => setTestType(test)}
          row
          name="urgentSample"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          label="Urgent Sample"
        />
      </WrapperBox>
    </FormikInit>
  );
};
