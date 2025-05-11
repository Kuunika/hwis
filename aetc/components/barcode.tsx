import React, { ReactNode, useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import { MainButton, MainTypography, WrapperBox } from "@/components";
import * as htmlToImage from "html-to-image";
import zplImageConvert from "@replytechnologies/zpl-image-convert";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { PrinterSelect } from "./printerSelect";
import { BasicSelect } from "@/app/patient/components/basicSelect";

interface Props {
  value: string;
  display?: string;
  children: ReactNode;
  setTriggerFunc: (func: any) => void;
  printer: string;
  orderDate?: string;
}
export const PatientRegistrationBarcodeTemplate: React.FC<Props> = ({
  value,
  children,
  setTriggerFunc,
  printer,
  orderDate,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const convertToCanvas = async () => {
      const element = document.getElementById("barcode");
      if (element) {
        const canvas = await htmlToImage.toCanvas(element);
        downloadZplData("test", canvas, printer);
      }
    };
    setTriggerFunc(() => convertToCanvas);
  }, [printer]);

  return (
    <WrapperBox
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div id="barcode">
        <WrapperBox
          sx={{
            pb: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          ref={ref}
        >
          {children}
          <Barcode
            width={6}
            height={120}
            margin={0}
            displayValue={false}
            value={value}
          />
        </WrapperBox>
      </div>
    </WrapperBox>
  );
};

export const BarcodeComponent: React.FC<Props> = ({
  value,
  children,
  setTriggerFunc,
  printer,
  orderDate,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const convertToCanvas = async () => {
      const element = document.getElementById("barcode");
      if (element) {
        const canvas = await htmlToImage.toCanvas(element);
        downloadZplData("test", canvas, printer);
      }
    };
    setTriggerFunc(() => convertToCanvas);
  }, [printer]);

  return (
    <WrapperBox
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div id="barcode">
        <WrapperBox
          sx={{
            pb: "2px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "13ch",
          }}
          ref={ref}
        >
          {children}
          <Barcode
            width={1}
            height={40}
            margin={0}
            displayValue={false}
            value={value}
          />
          <Typography variant="caption">{value}</Typography>
          <Typography variant="caption">Order date: {orderDate}</Typography>
        </WrapperBox>
      </div>
    </WrapperBox>
  );
};

const downloadZplData = async (
  labelName: string,
  canvas: HTMLCanvasElement,
  printer: string
) => {
  const base64 = canvas.toDataURL("image/png");
  try {
    const gfa = await zplImageConvert.encode(base64);
    const zpl = `^XA^FO20,20${gfa}^XZ`;

    await axios.post(`${printer}/print`, { zpl });

    // const blob = new Blob([zpl], { type: 'text/plain' });

    // const url = window.URL.createObjectURL(blob);

    // const downloadLink = document.createElement('a');
    // downloadLink.href = url;
    // downloadLink.download = `${labelName}.raw.z64.zpl`;

    // downloadLink.click();

    // window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error encoding image to ZPL:", error);
  }
};

type TriagePrintTempProp = {
  vitals: { name: string; value: string | number }[];
  date: string;
  arrivalTime: string;
  referredFrom: string;
  triageCategory: string;
  triagedBy: string;
  presentingComplaints?: string;
};

export const TriagePrintTemplate: React.FC<TriagePrintTempProp> = ({
  presentingComplaints,
  vitals,
  date,
  arrivalTime,
  referredFrom,
  triageCategory,
  triagedBy,
}) => {
  const [printer, setPrinter] = useState("");
  const [reason, setReason] = useState("");

  const convertToCanvas = async () => {
    const element = document.getElementById("triage");
    if (element) {
      const canvas = await htmlToImage.toCanvas(element);
      downloadZplData("test", canvas, printer);
    }
  };

  return (
    <Box>
      <div id="triage">
        <WrapperBox
          sx={{
            p: "5px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography variant="body2" mr={"1ch"}>
              Arrival Date Time: {arrivalTime}
            </Typography>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Typography variant="body2" mr={"1ch"}>
                Triage Date Time: {date}
              </Typography>
              <Typography variant="body2">
                Referred From: {referredFrom}
              </Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography mr={"1ch"} variant="body1">
                Category: {triageCategory}
              </Typography>
              <Typography variant="body1">Reason: {reason}</Typography>
            </Box>

            <Typography sx={{ mt: "1ch" }} variant="subtitle1">
              Presenting Complaints: {presentingComplaints}{" "}
            </Typography>

            <WrapperBox sx={{ display: "flex", border: "dashed", my: "1ch" }}>
              {vitals.map(({ name, value }: any) => (
                <Cell key={`${value}${name}`} title={name} value={value} />
              ))}
            </WrapperBox>

            <Typography variant="body1">Triaged By: {triagedBy}</Typography>
          </Box>
        </WrapperBox>
      </div>

      <BasicSelect
        getValue={(value: any) => setReason(value)}
        label={"Reasons for triage category:"}
        options={[
          {
            value: "Vitals above/below threshold",
            label: "Vitals above/below threshold",
          },
          {
            value: "Airway/Breathing compromised",
            label: "Airway/Breathing compromised",
          },
          {
            value: "Blood circulation compromised",
            label: "Blood circulation compromised",
          },
          {
            value: "Disability",
            label: "Disability",
          },
          {
            value: "Persistent pain and other concerns ",
            label: "Persistent pain and other concerns ",
          },
        ]}
      />
      <br />
      <br />
      <PrinterSelect getValue={(value: string) => setPrinter(value)} />
      <br />
      <br />
      <MainButton onClick={convertToCanvas} title={"print"} />
    </Box>
  );
};

const Cell = ({ title, value }: { title: string; value: string }) => {
  return (
    <WrapperBox
      sx={{
        mx: "0.5ch",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <MainTypography variant="h6" textAlign={"center"}>
        {title}
      </MainTypography>
      <MainTypography variant="h6">{value}</MainTypography>
    </WrapperBox>
  );
};

export const LabBarcodeComponentPrintTemplate: React.FC<Props> = ({
  value,
  children,
  setTriggerFunc,
  printer,
  orderDate,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convertToCanvas = async () => {
      const element = document.getElementById("barcode");
      if (element) {
        const originalCanvas = await htmlToImage.toCanvas(element);
    
        // Fixed size
        const fixedWidth = 700;
        const fixedHeight = 300;
    
        // Create a new canvas with fixed size
        const resizedCanvas = document.createElement("canvas");
        resizedCanvas.width = fixedWidth;
        resizedCanvas.height = fixedHeight;
    
        const ctx = resizedCanvas.getContext("2d");
    
        if (ctx) {
          // Optional: Fill background white to avoid transparency
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, fixedWidth, fixedHeight);
    
          // Draw original canvas onto resized canvas, scaling it
          ctx.drawImage(
            originalCanvas,
            0, 0, originalCanvas.width, originalCanvas.height, // source
            0, 0, fixedWidth, fixedHeight                      // destination
          );
    
          // Now pass the resized canvas to your printer function
          downloadZplData("test", resizedCanvas, printer);
        }
      }
    };
    setTriggerFunc(() => convertToCanvas);
  }, [printer]);

  return (
      <div id="barcode">
        <Box
          sx={{
          
            pb: "2px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          
          }}
          ref={ref}
        >
          {children}
          <Barcode
            height={50}
            margin={0}
            displayValue={false}
            value={value}
           
          />
          <Typography variant="caption">{value}</Typography>
          <Typography variant="caption">Order date: {orderDate}</Typography>
        </Box>
      </div>
  );
};
