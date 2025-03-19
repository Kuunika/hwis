import { FC, ReactNode, useRef } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { WrapperBox, MainTypography } from "..";
import { MainButton } from "../buttons";
import { PatientInfoTab } from "../patientInfoTab";
import { useReactToPrint } from "react-to-print";

type Prop = {
  children: ReactNode;
};
export const TemplateWrapper: FC<Prop> = ({ children }) => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Surgical Notes",
  });

  return (
    <>
      <WrapperBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          pt: "2ch",
          pl: "2ch",
          mb: "2ch",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <MainTypography
            sx={{
              width: "24px",
              height: "24px",
              fontSize: "20px",
              fontWeight: 400,
            }}
          >
            <FaAngleLeft />
          </MainTypography>
          <MainTypography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "21px",
              pl: "1ch",
            }}
            onClick={() => window.history.back()}
          >
            Back
          </MainTypography>
        </div>

        <MainButton
          onClick={handlePrint}
          sx={{ marginRight: "20px" }}
          title="Download PDF"
        />
      </WrapperBox>
      <div ref={printRef} className="printable-content">
        <div className="print-only">
          <PatientInfoTab />
        </div>
        {children}
      </div>
      {/* CSS for Print Handling */}
      <style jsx>{`
        @media print {
          .print-only {
            display: block !important; /* Ensure visibility in print */
          }
        }
        .print-only {
          display: none; /* Hide on screen */
        }
      `}</style>
    </>
  );
};
