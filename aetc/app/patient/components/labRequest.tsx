import { useEffect, useState, ChangeEvent } from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { MainTypography, WrapperBox, FormikInit, RadioGroupInput, SearchComboBox } from "@/components";

import FormControl from "@mui/material/FormControl";

import { FaRegCheckSquare, FaRegSquare, FaSearch } from "react-icons/fa";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { Concept, LabRequest, TestType } from "@/interfaces";
import { createOrder, getConceptSetMembers, getLabSpecimenTypes, getLabTestReason, getLabTestTypes } from "@/hooks/labOrder";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { getDateTime } from "@/helpers/dateTime";
import { OverlayLoader } from "@/components/backdrop";
import { BarcodeComponent } from "@/components/barcode";
import * as Yup from 'yup';
import Popover from '@mui/material/Popover';

export interface SimpleDialogProps {
  onClose: (value: string) => void;
  addRequest: (value: LabRequest) => void
}

export function LabRequestModal({ onClose, addRequest }: SimpleDialogProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [searchSample, setSearchSample] = useState<string>("");
  const [searchSampleTypes, setSearchSampleTypes] = useState<string>("");
  const [searchSpecimenSites, setSearchSpecimenSites] =
    useState<string>("");
  const [request, setRequest] = useState<any>({})
  const { data: specimenTypes, isLoading, isSuccess } = getLabSpecimenTypes()
  const { data: labReasons, isLoading: loadingReasons, isSuccess: labReasonsLoaded } = getLabTestReason();

  const [sampleName, setSampleName] = useState<string>('')
  const { data: labTests, isLoading: loadingTests, isSuccess: testLoaded, refetch, isRefetching } = getLabTestTypes(sampleName);

  
  const { params } = useParameters();
  const { data: patient } = getOnePatient(params.id as string);
  const { mutate, isPending, isSuccess: orderCreated } = createOrder()


  const handleClose = () => {
    onClose("");

  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };


  useEffect(() => {
    if (orderCreated) {
      addRequest({ ...request, id: Math.random(), status: "pending..." })
    }

  }, [orderCreated])

  useEffect(() => {
    refetch();
  }, [sampleName])




  const handleSendLab = () => {

    const order = {
      "orders": [
        {
          "patient": params.id,
          "visit": patient?.visit_uuid,
          "tests": request.tests,
          // "reason_for_test": request.sampleType,
          "reason_for_test": 'b998cdac-8d80-11d8-abbb-0024217bb78e',
          "target_lab": "Queen Elizabeth Central Hospital",
          "date": getDateTime(),
          "requesting_clinician": "admin",
          "specimen": {
            "concept": request.sample
          }
        }
      ]
    }
    mutate(order);
  }

  const handleSelectSampleType = (sample: any) => {
    setRequest((req: any) => ({ ...req, sample: sample.id }))
    setSampleName(sample.label);
  }

  const handleTestSelect = (tests: Array<number>) => {

    const mappedTests = tests.map(test => {

      return { concept: labTests?.find(lab => lab.concept_id == test)?.names[0]?.uuid }
    });

    setRequest((req: any) => ({ ...req, tests: mappedTests }))
  }

  return <LabForm onClose={() => onClose('')} />

}


const initialValues = {
  testType: "",
  sampleType: ""
}


const validationSchema = Yup.object().shape({
  testType: Yup.string().required().label("Test Type"),
  sampleType: Yup.string().required().label("Sample Type"),
})

const LabForm = ({ onClose }: { onClose: () => void }) => {
  const { data: specimenTypes, isLoading, isSuccess, refetch: refetchLabSpecimen, isRefetching: refetchingLabSpecimen } = getLabSpecimenTypes()
  const [sampleName, setSampleName] = useState('')
  const { data: labTests, isLoading: loadingTests, isSuccess: testLoaded, refetch, isRefetching } = getLabTestTypes(sampleName);
  const [request, setRequest] = useState<any>({})
  const [testType, setTestType] = useState('');
  const [sampleId, setSampleId] = useState(''); // to fetch bedside test samples
  const [bedsideTestId, setBedsideTestId] = useState(''); // to fetch bedside tests for a sample
  const { data: bedsideSampleTypes, isLoading: bedsideLoading, refetch: reloadSamples, isRefetching: reloading } = getConceptSetMembers(sampleId);
  const { data: bedsideTests, isLoading: bedsideTestsLoading, refetch: reloadBedSideTests, isRefetching: reloadingBedsideTest } = getConceptSetMembers(bedsideTestId);


  const [samples, setSamples] = useState<Concept[]>([]);
  const [tests, setTests] = useState<Concept[]>([])

  const { params } = useParameters();
  const { data: patient } = getOnePatient(params.id as string);
  const { mutate, isPending, isSuccess: orderCreated } = createOrder()


  useEffect(() => {
    refetch()
  }, [sampleName])


  //TODO: this is a temporary implementation for querying beside samples and tests as waiting for proper implementation of the api
  useEffect(() => {
    if (testType == 'bedside') {
      setSampleId('beed8ce9-fd0f-4606-9911-dbb0ef9df055') // hard coded bedside
      setSamples(transformedBedsideSamples)
    } else {
      refetchLabSpecimen()
    }
  }, [testType])

  // load bedside samples
  useEffect(() => {
    reloadSamples()
  }, [sampleId])

  const transformedBedsideSamples = () => {
    if (!bedsideSampleTypes) return []
    return bedsideSampleTypes.map(c => ({
      ...c,
      names: c.names,
      name: c.names[0].name
    })).sort((a, b) => a.name.localeCompare(b.name))
  }

  const transformBedsideTests = () => {
    if (!bedsideTests) return [];
    
    let bedSideTestTypes  = [
      'Random Blood Glucose (RBS)', 
      'Fasting Blood Glucose (FBS)',
      'H. Pylori',
      'C-Reactive Protein (CRP)',
      'Haemoglobin',
      'Pregnancy Test',
      'HIV',
      'C-reactive protein',
      'Malaria Screening',
      'Blood Gas',
      'Urine Chemistries'
    ].map(name => name.toLowerCase()) as any

    return bedsideTests
    .filter(bed => bed.names.length > 0 && bed.names.some(n => n?.name))
    .map(bed => ({
      ...bed,
      name: bed.names.find(n => n?.name)?.name
    })).sort((a: any, b: any) => a.name.localeCompare(b.name))
    .filter(bed => bedSideTestTypes.includes(bed.name?.toLowerCase())); 
  };

  // transform bedside samples
  useEffect(() => {
    if (!bedsideSampleTypes) return
    const transformed = transformedBedsideSamples()

    setSamples(transformed);
  }, [bedsideSampleTypes])

  useEffect(() => {

    if (!specimenTypes) return;


    //TODO:  
    setSamples(specimenTypes)

  }, [specimenTypes, refetchingLabSpecimen])


  useEffect(() => {

    reloadBedSideTests()

  }, [bedsideTestId])


  useEffect(() => {
    const transform = transformBedsideTests()
    setTests(transform)

  }, [bedsideTests])


  useEffect(() => {

    if (!labTests) return;

    setTests(labTests)

  }, [labTests])

  // ------------------------------


  const handleSampleChange = (uuid: string) => {

    const specimen = samples?.find(specimen => specimen.names[0]?.uuid == uuid);
    if (testType == 'bedside') {
      setBedsideTestId(uuid)
      setTests(transformBedsideTests());
      return;
    }

    // if (!specimen) return;



    setSampleName(uuid)
  }

  const handleLabSend = (values: any) => {

    const mappedTests = values?.tests.map((test: any) => {
      return { concept: tests?.find(lab => lab.concept_id == test.id)?.names[0]?.uuid }
    });

    const order = {
      "orders": [
        {
          "patient": params.id,
          "visit": patient?.visit_uuid,
          "tests": mappedTests,
          // "reason_for_test": request.sampleType,
          "reason_for_test": 'b998cdac-8d80-11d8-abbb-0024217bb78e',
          "target_lab": "Blantyre Dream Project Clinic",
          "date": getDateTime(),
          "requesting_clinician": "admin",
          "specimen": {
            "concept": values.sampleType
          }
        }
      ]
    }

    mutate(order);
    onClose()
  }

  return <FormikInit initialValues={initialValues} onSubmit={handleLabSend} validationSchema={validationSchema}>
    {/* <OverlayLoader open={isPending || isLoading || isRefetching} /> */}

    <WrapperBox sx={{ display: "flex", width: "50ch" }}>
      <RadioGroupInput getValue={(test) => {
        setTestType(test)
      }
      } name="testType" options={[
        { value: "bedside", label: "Bed Side" },
        { value: "laboratory", label: "Laboratory" }]} label="Test Type" />

      <RadioGroupInput getValue={(test) => {
        setTestType(test)
      }
      } name="emergency" options={[
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }]} label="Emergency" />
      <RadioGroupInput getValue={(test) => {
        setTestType(test)
      }
      } name="urgentSample" options={[
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }]} label="Urgent Sample" />
    </WrapperBox>


    <SearchComboBox getValue={handleSampleChange} multiple={false} label="Sample Type" name="sampleType" options={samples ? samples.map(sp => ({ label: sp?.names[0]?.name, id: sp.names[0].uuid })) : []} />


    <SearchComboBox label="Tests" name="tests" options={tests ? tests.map(d => ({ id: d.concept_id, label: d.names[0]?.name })) : []} />
  </FormikInit>

}

// registration workflow, patient lists(screening, assessments, triage), dde search workflow,
// lab request form

export const TestList = ({ onSelectTest, testTypes, loading }: { loading?: boolean, testTypes: TestType[], onSelectTest: (test: string | number) => void }) => {
  const [search, setSearch] = useState<string>("");


  return (
    <WrapperBox>
      <br />
      <MainTypography variant="h5" sx={{ my: "1ch" }}>
        Tests
      </MainTypography>
      <SearchInput setSearch={setSearch} placeHolder="search test" />
      <br />
      {
        loading ? <>fetching tests...</> :
          <>
            {testTypes.length > 0 ? <ListSelect multiple={true} onSelectItem={onSelectTest} list={testTypes ? testTypes.map(d => ({ id: d.concept_id, label: d.name })) : []} search={search} /> : <>No Tests on the selected sample</>}
          </>
      }
    </WrapperBox>
  );
};

export const SearchInput = ({
  setSearch,
  placeHolder = "search",
}: {
  setSearch: (search: string) => void;
  placeHolder?: string;
}) => {
  return (
    <FormControl sx={{ width: "100%", mb: "2ch" }} variant="outlined">
      <OutlinedInput
        id="outlined-adornment-weight"
        size="small"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setSearch(event.target.value);
        }}
        endAdornment={
          <InputAdornment position="end">
            <FaSearch />
          </InputAdornment>
        }
        placeholder={placeHolder}
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          "aria-label": "weight",
        }}
      />
    </FormControl>
  );
};

export const ListSelect = ({
  list,
  search = "",
  height = "50ch",
  onSelectItem,
  multiple = false
}: {
  list: Array<{ id: string | number, label: string }>;
  search?: string;
  height?: string;
  onSelectItem: (item: any) => void,
  multiple?: boolean
}) => {
  const [selected, setSelected] = useState<string | number>("");
  const [selectMultiple, setSelectMultiple] = useState<Array<any>>([])

  useEffect(() => {
    onSelectItem(selectMultiple)
  }, [selectMultiple])

  const handleSelect = (lab: any) => {
    if (multiple) {
      setSelectMultiple(select => {

        const index = select.findIndex(test => test == lab.id);

        if (index < 0) {

          return [...select, lab.id]
        }

        return select.filter(test => test != lab.id);

      })

      return
    }
    setSelected(lab.id);
    onSelectItem(lab)
  }


  const checkIfSelected = (id: any) => {
    if (multiple) {

      return selectMultiple.find(select => select == id) ? true : false;
    }

    return id == selected
  }

  return (
    <WrapperBox
      sx={{
        overflowY: "scroll",
        height,
      }}
    >
      {list
        .filter((test) => test.label.toLowerCase().includes(search.toLowerCase()))
        .map((lab) => (
          <WrapperBox
            key={lab.label}
            onClick={() => handleSelect(lab)}
            sx={{
              display: "flex",
              alignItems: "center",
              py: "1ch",
              px: "0.5ch",
              cursor: "pointer",
              backgroundColor: lab.id == selected ? "#DDEEDD" : "",
              color: lab.id == selected ? "#006401" : "",
            }}
          >
            {/* {lab.id == selected ? <FaRegCheckSquare /> : <FaRegSquare />} */}
            {checkIfSelected(lab.id) ? <FaRegCheckSquare /> : <FaRegSquare />}
            <MainTypography sx={{ ml: "1ch" }}>{lab.label}</MainTypography>
          </WrapperBox>
        ))}
    </WrapperBox>
  );
};


// Specimen Sites
const specimenSites = [
  "Vein",
  "Artery",
  "Bladder",
  "Rectum",
  "Mouth",
  "Lung",
  "Brain",
  "Nasopharynx",
  "Skin",
  "Wound",
  "Joint",
];
