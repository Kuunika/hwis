import { MainButton, WrapperBox } from "shared-ui/src";
import { FaPlus } from "react-icons/fa";
import { Panel } from ".";
import { useNavigation } from "@/hooks";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect } from "react";
import { LabRequest } from "@/app/registration/components";
import { LabRequestModal } from "../labRequest";

export const Investigations = () => {
  const { navigateTo } = useNavigation();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }
  return (
    <Panel
      title="Investigations"
      icon={<MainButton variant="text" icon={<FaPlus />} onClick={() => {}} />}
    >
      <WrapperBox>
        <MainButton
          sx={{ borderRadius: "1px" }}
          title={"Lab Order"}
          onClick={() => setOpen(true)}
        />
      </WrapperBox>
      <>Investigations</>
      <LabRequestModal open={open} onClose={() => setOpen(false)} />
    </Panel>
  );
};
