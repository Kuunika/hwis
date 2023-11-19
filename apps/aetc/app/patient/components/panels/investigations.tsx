import { MainButton } from "shared-ui/src";
import { FaPlus } from "react-icons/fa";
import { Panel } from ".";
import { useNavigation } from "@/hooks";

export const Investigations = () => {
  const { navigateTo } = useNavigation();
  return (
    <Panel
      title="Investigations"
      icon={
        <MainButton
          variant="text"
          icon={<FaPlus />}
          onClick={() => navigateTo("/investigations")}
        />
      }
    >
      <>Investigations</>
    </Panel>
  );
};
