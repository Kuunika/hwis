import { useParameters } from "@/hooks";
import { getPatientLabOrder } from "@/hooks/labOrder";
import { LabRequest } from "@/interfaces";
import {
  BaseTable,
  MainButton,
  MainTypography,
  WrapperBox,
} from "@/components";
import { FaPrint } from "react-icons/fa6";
import {
  BarcodeComponent,
  LabBarcodeComponentPrintTemplate,
} from "@/components/barcode";
import {
  getOnePatient,
  getPatientsWaitingForAssessment,
} from "@/hooks/patientReg";
import { GenericDialog } from "@/components";
import { useState, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { BasicSelect } from "../basicSelect";
import { getHumanReadableDateTimeLab } from "@/helpers/dateTime";
import { getPrinters } from "@/hooks/loadStatic";

export const LabOrderTable = () => {
  const { data: printers } = getPrinters();

  // Use useRef to store the print function to avoid re-renders
  const printFuncRef = useRef<(() => any) | null>(null);

  const { params } = useParameters();
  const { data: patient } = getOnePatient(params.id as string);
  const { data: labOrders } = getPatientLabOrder(params?.id as string);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState({
    sampleType: "",
    ascension: "",
    tests: "",
    orderDate: "",
    requestingTechnician: "",
    description: "",
  });
  const [printer, setPrinter] = useState("http://localhost:3000");
  const [openDialog, setOpenDialog] = useState(false);
  const [fullResults, setFullResults] = useState([
    {
      name: "",
      value: "",
      testName: "",
    },
  ]);

  // Use useCallback to prevent unnecessary re-renders
  const handleViewClick = useCallback((results: any, name: any) => {
    const formattedResults = results.map((item: any) => ({
      name: item.indicator.name,
      value: item.value,
      testName: name,
    }));
    setFullResults(formattedResults);
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  // Use useCallback to prevent function recreation on every render
  const handleSetTriggerFunc = useCallback((func: () => any) => {
    printFuncRef.current = func;
  }, []);

  // Use useCallback for the print handler
  const handlePrint = () => {
    if (printFuncRef.current && typeof printFuncRef.current === "function") {
      printFuncRef.current();
    }
  }

  const columns = [
    {
      field: "specimen",
      headerName: "Specimen",
      flex: 1,
      renderCell: (cell: any) => {
        return cell.row.specimen.name;
      },
    },
    {
      field: "test",
      headerName: "Test(s)",
      flex: 1,
      renderCell: (cell: any) => {
        return cell.row.test.name;
      },
    },
    { field: "requesting_clinician", headerName: "Ordered By", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "accessionNumber",
      headerName: "Accession Number",
      flex: 1,
      renderCell: (cell: any) => {
        return cell.row.accession_number;
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (cell: any) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <>
              <Button
                disabled={
                  !(cell.row.test.result && cell.row.test.result.length > 0)
                }
                variant="contained"
                onClick={() => {
                  const results = cell.row.test.result;
                  handleViewClick(results, cell.row.test.name);
                }}
                sx={{
                  width: "48%",
                  padding: "4px 8px",
                }}
              >
                View
              </Button>
              <Dialog
                open={openDialog}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>
                  Test results for {fullResults[0].testName}
                </DialogTitle>
                <DialogContent>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Measure</TableCell>
                        <TableCell>Result</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fullResults.map((result: any, index) => (
                        <TableRow key={index}>
                          <TableCell>{result.name}</TableCell>
                          <TableCell>{result.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
              <MainButton
                title={"print"}
                variant="secondary"
                onClick={() => {
                  setShowDialog(true);
                  setSelectedTest({
                    sampleType: cell.row.specimen.name,
                    ascension: cell.row.accession_number,
                    orderDate: getHumanReadableDateTimeLab(cell.row.order_date),
                    tests: cell.row.test.name,
                    requestingTechnician: cell.row.requesting_clinician,
                    description: cell.row.comment_to_fulfiller,
                  });
                }}
                sx={{
                  width: "48%",
                  padding: "4px 8px",
                }}
              />
            </>
          </Box>
        );
      },
    },
  ];

  const flattenedLabOrders =
    labOrders?.flatMap((lab) =>
      lab.tests.map((test) => ({
        ...lab,
        id: test.id,
        test,
        status: test.result ? "Results Available" : "Waiting for result(s)",
      }))
    ) || [];

  return (
    <>
      {flattenedLabOrders.length === 0 ? (
        <Typography>No lab orders added</Typography>
      ) : (
        <BaseTable
          height="25ch"
          showTopBar={false}
          rowHeight={25}
          rows={flattenedLabOrders}
          columns={columns}
        />
      )}
      <GenericDialog
        maxWidth="sm"
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title={"Preview Barcode"}
      >
        <WrapperBox
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LabBarcodeComponentPrintTemplate
            printer={printer}
            orderDate={selectedTest.orderDate}
            setTriggerFunc={handleSetTriggerFunc}
            value={selectedTest.ascension}
            test={`${selectedTest.tests}|${selectedTest.ascension}|${selectedTest.requestingTechnician.split(" ")[1]}`}
            fullName={`${patient?.given_name} ${patient?.family_name}`}
            gender={patient?.gender}
            description={selectedTest.description}
          >
            <></>
          </LabBarcodeComponentPrintTemplate>
          <br />
          <BasicSelect
            getValue={(value: any) => {
              setPrinter(value);
            }}
            label="Select Printer"
            options={
              !printers
                ? []
                : printers?.map((d) => {
                    return { value: d.ip_address, label: d.name };
                  })
            }
          />
          <br />
          <MainButton title={"Print Barcode"} onClick={handlePrint} />
        </WrapperBox>
      </GenericDialog>
    </>
  );
};
