import Swal from "sweetalert2";

type ConfirmationDialogType = {
  title: string;
  text: string;
  icon: "warning" | "success";
  confirmButtonText: string;
  onConfirm: () => void;
  onDismiss?: () => void;
  cancelButtonText?: string;
};

export const confirmationDialog = ({
  title,
  text,
  icon,
  onConfirm,
  confirmButtonText,
  cancelButtonText = "Cancel",
}: ConfirmationDialogType) => {
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#006401",
    confirmButtonText,
    cancelButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};

export const successDialog = ({
  title,
  text,
  icon,
  onConfirm,
  confirmButtonText,
  cancelButtonText,
  onDismiss,
}: ConfirmationDialogType) => {
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#006401",
    confirmButtonText,
    cancelButtonText,
  }).then((result) => {
    if (result.isConfirmed) onConfirm();

    if (result.isDismissed && onDismiss) onDismiss();
  });
};
