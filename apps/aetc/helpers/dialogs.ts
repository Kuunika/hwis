import Swal from "sweetalert2";

type ConfirmationDialogType = {
  title: string;
  text: string;
  icon: "warning" | "success";
  confirmButtonText: string;
  onConfirm: () => void;
};

export const confirmationDialog = ({
  title,
  text,
  icon,
  onConfirm,
  confirmButtonText,
}: ConfirmationDialogType) => {
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#006401",
    confirmButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};
