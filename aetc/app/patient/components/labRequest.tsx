import { LabRequestForm } from "../[id]/consultation/components/labRequestForm";
import { LabFormProps } from "@/interfaces";

export function LabRequestModal({ onClose, addRequest }: LabFormProps) {
  return (
    <div>
      <LabRequestForm onClose={onClose} addRequest={addRequest} />
    </div>
  );
}
