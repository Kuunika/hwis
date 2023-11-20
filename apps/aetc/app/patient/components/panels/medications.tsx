import { MainButton } from "shared-ui/src";
import { Panel } from ".";
import { useNavigation } from "@/hooks";
import { FaPlus } from "react-icons/fa";

export const Medications = () => {
  const { navigateTo } = useNavigation();
  return (
    <Panel
      title="Medications"
      icon={
        <MainButton
          variant="text"
          icon={<FaPlus />}
          onClick={() => navigateTo("/medications")}
        />
      }
    >
      <>Medication</>
    </Panel>
  );
};
