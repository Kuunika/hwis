import { useEffect, useState } from "react";
import { MainButton, MainTypography } from "@/components";
import { GenericDialog } from ".";
import { closeCurrentVisit } from "@/hooks/visit";
import { OverlayLoader } from "./backdrop";
import { SxProps } from "@mui/material";

export const AbscondButton = ({
  patientId,
  visitId,
  onDelete,
  sx,
  dialogTitle = "Abscond Patient",
  dialogConfirmationMsg = "Are you sure the patient absconded?",
  buttonTitle = "Abscond",
}: {
  buttonTitle?: string;
  dialogConfirmationMsg?: string;
  dialogTitle?: string;
  patientId: string;
  visitId: string;
  onDelete: () => void;
  sx?: SxProps;
}) => {
  const {
    mutate: closeVisit,
    isPending,
    isSuccess: visitClosed,
  } = closeCurrentVisit();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  useEffect(() => {
    if (visitClosed) {
      // handleAbscond();
      onDelete();
    }
  }, [visitClosed]);

  const handleAbscond = () => {
    closeVisit(visitId);
  };
  return (
    <>
      <MainButton
        size="small"
        variant="secondary"
        sx={{ fontSize: "12px", ...sx }}
        title={buttonTitle}
        onClick={handleClick}
      />
      <GenericDialog
        maxWidth="sm"
        title={dialogTitle}
        open={open}
        onClose={() => setOpen(false)}
      >
        <OverlayLoader open={isPending} />
        <MainTypography>{dialogConfirmationMsg}</MainTypography>
        <br />
        <MainButton title={"Yes"} onClick={handleAbscond} />
        <MainButton
          sx={{ ml: 0.3 }}
          variant="secondary"
          title={"No"}
          onClick={() => setOpen(false)}
        />
      </GenericDialog>
    </>
  );
};
