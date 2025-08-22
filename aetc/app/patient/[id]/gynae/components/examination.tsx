"use client";

import {
  FieldsContainer,
  FormFieldContainerLayout,
  RadioGroupInput,
  TextInputField,
  WrapperBox,
  FormikInit,
  FormValuesListener,
  MainButton,
} from "@/components";
import * as yup from "yup";
import { useRef, useState } from "react";
import DiagnosisForm from "../../consultation/components/diagnosisForm";
import { concepts } from "@/constants";
import { Abdomen } from "@/assets";
import { AbdomenFemale } from "@/assets/abdomenFemale";

interface ExamFormProps {
  onSubmit: (values: any) => void;
  initialValues?: Record<string, any>;
}

interface Circle {
  points: { x: number; y: number }[];
  id: number;
}

const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const form = {
  AbdomenImage:{name:"AbdomenImage", label:"Abdomen image" },
  bp: { name: "bp", label: "BP (mm/Hg)" },
  pr: { name: "pr", label: "PR (/min)" },
  temp: { name: "temp", label: "T (°C)" },
  rr: { name: "rr", label: "RR (/min)" },

  conjunctivaPallor: {
    name: "conjunctivaPallor",
    label: "Conjunctiva pallor?",
  },
  dehydration: { name: "dehydration", label: "Dehydration?" },
  crt: { name: "crt", label: "CRT" },

  vaginalSpeculum: {
    name: "vaginalSpeculum",
    label: "Vaginal Examination - Speculum",
  },
  digitalExam: { name: "digitalExam", label: "Digital Exam" },

  diagnosis: { name: "diagnosis", label: "Diagnosis" },
  diffDiagnosis: { name: "diffDiagnosis", label: "Differential Diagnosis" },

  urinePregnancyTest: {
    name: "urinePregnancyTest",
    label: "Urine Pregnancy Test",
  },

  haemoglobin: { name: "haemoglobin", label: "Haemoglobin (g/dl)" },
  bloodGroupRh: { name: "bloodGroupRh", label: "Blood group and Rh" },

  otherTests: { name: "otherTests", label: "Other tests" },
  uss: { name: "uss", label: "USS" },

  finalDiagnosis: { name: "finalDiagnosis", label: "Final Diagnosis" },

  plan: { name: "plan", label: "PLAN" },

  // Blood Count table inputs
  fbcWbc: { name: "fbcWbc", label: "WBC" },
  fbcHb: { name: "fbcHb", label: "HB" },
  fbcPlt: { name: "fbcPlt", label: "PLT" },
};

const schema = yup.object().shape({
  [form.bp.name]: yup.string().required("Required"),
  [form.pr.name]: yup.string().required("Required"),
  [form.temp.name]: yup.string().required("Required"),
  [form.rr.name]: yup.string().required("Required"),
  [form.conjunctivaPallor.name]: yup.string().required("Required"),
  [form.dehydration.name]: yup.string().required("Required"),
  [form.crt.name]: yup.string().required("Required"),
  [form.vaginalSpeculum.name]: yup.string().required("Required"),
  [form.digitalExam.name]: yup.string().required("Required"),
  [form.diagnosis.name]: yup.string().required("Required"),
  [form.diffDiagnosis.name]: yup.string().required("Required"),
  [form.urinePregnancyTest.name]: yup.string().required("Required"),
  [form.haemoglobin.name]: yup.string().required("Required"),
  [form.bloodGroupRh.name]: yup.string().required("Required"),
  [form.otherTests.name]: yup.string().required("Required"),
  [form.finalDiagnosis.name]: yup.string().required("Required"),
  [form.plan.name]: yup.string().required("Required"),
  [form.fbcWbc.name]: yup.string().required("Required"),
  [form.fbcHb.name]: yup.string().required("Required"),
  [form.fbcPlt.name]: yup.string().required("Required"),
  //[form.uss.name]: yup.string,
});

const defaultInitialValues = Object.keys(form).reduce(
  (acc, key) => {
    acc[key] = "";
    return acc;
  },
  {} as Record<string, string>
);

const ExamForm: React.FC<ExamFormProps> = ({ onSubmit, initialValues: prefill }) => {
  const [formValues, setFormValues] = useState(defaultInitialValues);
  
  

  const [showForm, setShowForm] = useState(false);
  const [circles, setCircles] = useState<Circle[]>([]);
  const drawing = useRef(false);
  const points = useRef<{ x: number; y: number }[]>([]);
  const idCounter = useRef(0);
  const [currentCircle, setCurrentCircle] = useState<Circle | null>(null);
  const [submittedData, setSubmittedData] = useState<string[]>([]);

      const handleMouseDown = () => {
    drawing.current = true;
    points.current = [];
  };


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawing.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    points.current.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };


  const handleMouseUp = () => {
    drawing.current = false;

    if (isCircle(points.current)) {
      const newCircle = { points: [...points.current], id: idCounter.current++ };
      setCurrentCircle(newCircle); // only hold it temporarily
      setShowForm(true);
      console.log("New circle coordinates:", newCircle.points);
    }

    points.current = [];
  };

    // Basic circle detection based on bounding box
  const isCircle = (pts: { x: number; y: number }[]) => {
    if (pts.length < 10) return false;

    const xs = pts.map(p => p.x);
    const ys = pts.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    const minSize = 30;
    const aspectRatio = width / height;

    return width > minSize && height > minSize && Math.abs(aspectRatio - 1) < 0.3;
  };


    const closeForm = () => {
    setShowForm(false);
    setCurrentCircle(null); // discard if not submitted
  };

  const renderPolyline = (pts: { x: number; y: number }[]): string => {
    return pts.map(p => `${p.x},${p.y}`).join(" ");
  };


  const handleFromSubmission = (values: any) => {
    console.log("Examination Details Submitted:", values);
    onSubmit(values);
  };

  return (
    <WrapperBox
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "1ch",
        marginTop: "20px",
        position: "relative", //added
      }}
    >
      <FormikInit
        initialValues={{...defaultInitialValues, ...(prefill || {})}}
        validationSchema={schema}
        onSubmit={handleFromSubmission}
        submitButtonText="Submit"
      >
        <FormValuesListener getValues={setFormValues} />

        <FieldsContainer sx={{ gap: 3 }}>
          <TextInputField
            name={form.bp.name}
            label={form.bp.label}
            id="bp"
            type="number"
          />
          <TextInputField
            name={form.pr.name}
            label={form.pr.label}
            id="pr"
            type="number"
          />
          <TextInputField
            name={form.temp.name}
            label={form.temp.label}
            id="temp"
            type="number"
          />
          <TextInputField
            name={form.rr.name}
            label={form.rr.label}
            id="rr"
            type="number"
          />
        </FieldsContainer>
        <br />
        {/* Conjunctiva Pallor & Dehydration */}
        <FieldsContainer sx={{ gap: 5, alignItems: "center" }}>
          <RadioGroupInput
            name={form.conjunctivaPallor.name}
            label={form.conjunctivaPallor.label}
            options={yesNoOptions}
          />
          <RadioGroupInput
            name={form.dehydration.name}
            label={form.dehydration.label}
            options={yesNoOptions}
          />
        </FieldsContainer>
        <br />
        <FieldsContainer sx={{ gap: 5, alignItems: "center" }}>
          <TextInputField
            name={form.crt.name}
            label={form.crt.label}
            id="crt"
            multiline
            rows={3}
            sx={{ m: 0, width: "100%" }}
          />
        </FieldsContainer>
        <br />

        {/* Vaginal & Digital Exam */}
        <p>Vaginal Examination</p>
   <FieldsContainer sx={{ flexDirection: "column" }}>
        <FieldsContainer sx={{ flexDirection: "column" }}>
          <TextInputField
            name={form.vaginalSpeculum.name}
            label={form.vaginalSpeculum.label}
            multiline
            rows={3}
            sx={{ m: 0, width: "100%" }}
            id="vaginalSpeculum"
          />
          <br />
          <TextInputField
            name={form.digitalExam.name}
            label={form.digitalExam.label}
            multiline
            rows={3}
            sx={{ m: 0, width: "100%" }}
            id="digitalExam"
          />
        </FieldsContainer>
        <FieldsContainer sx={{ flexDirection: "row" }}>
            
        {/*<Abdomen onClick={handleClick} />*/}
        <Abdomen style={{ position: "relative" }} />
        
              {/* SVG overlay to show circles */}
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                {/* Completed circles */}
                {circles.map(circle => (
                  <polyline
                    key={circle.id}
                    points={renderPolyline(circle.points)}
                    stroke="green"
                    strokeWidth={3}
                    fill="none"
                  />
                ))}
        
                {/* Circle being drawn */}
                {drawing.current && (
                  <polyline
                    points={renderPolyline(points.current)}
                    stroke="green"
                    strokeWidth={2}
                    fill="none"
                  />
                )}
              </svg>
        
              {/* Invisible layer to capture drawing */}
              <div
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
        
              {/* Form */}
              {showForm && currentCircle && (
                <div
                  style={{
                    position: "absolute",
                    top: "20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "white",
                    padding: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                    zIndex: 10,
                  }}
                >
                  <FormikInit
                    onSubmit={values => {
                      setSubmittedData(prev => [...prev, values.name]);
                      setCircles(prev => [...prev, currentCircle]); // only add when submitted
                      setCurrentCircle(null);
                      setShowForm(false);
                      console.log("Submitted:", values);
                    }}
                    validationSchema={schema}
                    initialValues={{ name: "" }}
                    submitButton={false}
                  >
                    <TextInputField id="name" name="name" label="Name" />
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <button
                        type="submit"
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "green",
                          border: "none",
                          borderRadius: "4px",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Next
                      </button>
        
                      <button
                        type="button"
                        onClick={closeForm}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "red",
                          border: "none",
                          borderRadius: "4px",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </FormikInit>
                </div>
              )}
        
              {/* Display submitted data below */}
              {submittedData.length > 0 && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "8px",
                    background: "#f0f0f0",
                    borderRadius: "4px",
                  }}
                >
                  <h4>Submitted Data:</h4>
                  <ul>
                    {submittedData.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}


        </FieldsContainer>


   </FieldsContainer>
        <br />

        {/* Diagnosis & Differential Diagnosis */}
        <FieldsContainer sx={{ gap: 3, flexDirection: "column" }}>
          <DiagnosisForm conceptType={"name"} />
          {/* <TextInputField
                name={form.diagnosis.name}
                label={form.diagnosis.label}
                multiline
                rows={1}
                id=""
              /> */}
          {/* <TextInputField
                name={form.diffDiagnosis.name}
                label={form.diffDiagnosis.label}
                multiline
                rows={1}
                id=""
              /> */}
          <DiagnosisForm conceptType={concepts.DIFFERENTIAL_DIAGNOSIS} />
        </FieldsContainer>
        <br />

        {/* Investigations */}
        <FieldsContainer sx={{ gap: 3, flexDirection: "column" }}>
          <p>Investigations</p>
          {/* Urine Pregnancy Test */}
          <RadioGroupInput
            name={form.urinePregnancyTest.name}
            label={form.urinePregnancyTest.label}
            options={[
              { label: "Positive", value: "positive" },
              { label: "Negative", value: "negative" },
            ]}
          />

          <TextInputField
            name={form.haemoglobin.name}
            label={form.haemoglobin.label}
            multiline
            rows={2}
            id="haemoglobin"
          />
          <TextInputField
            name={form.bloodGroupRh.name}
            label={form.bloodGroupRh.label}
            multiline
            rows={2}
            id="bloodGroupRh"
          />
          <TextInputField
            name={form.otherTests.name}
            label={form.otherTests.label}
            multiline
            rows={2}
            id="otherTests"
          />
          <TextInputField
            name={form.uss.name}
            label={form.uss.label}
            multiline
            rows={2}
            id="uss"
          />
        </FieldsContainer>
        <br />

        {/* FBC Table */}
        <p>FBC</p>
        <FieldsContainer sx={{ gap: 2, flexWrap: "nowrap" }}>
          <TextInputField
            name={form.fbcWbc.name}
            label={form.fbcWbc.label}
            id="fbcWbc"
            sx={{ width: "60px" }}
          />
          <TextInputField
            name={form.fbcHb.name}
            label={form.fbcHb.label}
            id="fbcHb"
            sx={{ width: "60px" }}
          />
          <TextInputField
            name={form.fbcPlt.name}
            label={form.fbcPlt.label}
            id="fbcPlt"
            sx={{ width: "60px" }}
          />
        </FieldsContainer>
        <br />

        {/* Final Diagnosis & Plan */}
        <FieldsContainer sx={{ gap: 3, flexDirection: "column" }}>
          <DiagnosisForm conceptType={concepts.FINAL_DIAGNOSIS} />
          {/* <TextInputField
                name={form.finalDiagnosis.name}
                label={form.finalDiagnosis.label}
                multiline
                rows={2}
                id=""
              /> */}

          <TextInputField
            name={form.plan.name}
            label={form.plan.label}
            sx={{ m: 0, width: "100%" }}
            multiline
            rows={4}
            id="plan"
          />
        </FieldsContainer>
      </FormikInit>
    </WrapperBox>
  );
};

export default ExamForm;
