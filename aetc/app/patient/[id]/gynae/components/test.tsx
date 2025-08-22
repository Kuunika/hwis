


import { Abdomen } from "@/assets";
import { AbdomenFemale } from "@/assets/abdomenFemale";
import { FormikInit, TextInputField, WrapperBox } from "@/components";
import { useState, useRef } from "react";
import * as yup from "yup";

interface Circle {
  points: { x: number; y: number }[];
  id: number;
}

const schema = yup.object().shape({
  name: yup.string().required("Required"),
});

const TestForm = () => {
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

  return (
    <WrapperBox sx={{ position: "relative" }}>
      {/* <Abdomen style={{ position: "relative" }} /> */}
       <AbdomenFemale/>

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
    </WrapperBox>
  );
};

export default TestForm;
