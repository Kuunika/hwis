import { MainButton, MainTypography, WrapperBox } from "@/components";
import { FaPlus } from "react-icons/fa";
import { Panel } from ".";
import { useNavigation } from "@/hooks";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect } from "react";

import { LabRequestModal } from "../labRequest";
import { LabOrderTable } from "./labOrderTable";
import { LabRequest } from "@/interfaces";




export const Investigations = () => {
  const { navigateTo } = useNavigation();
  const [open, setOpen] = useState(false);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([])

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }


  const addRequest = (lab: LabRequest) => {
    setLabRequests(requests => ([...requests, lab]))
    setOpen(false)
  }
  return (
    <Panel
      title="Investigations"
      icon={<MainButton variant="text" icon={<FaPlus />} onClick={() => { }} />}
    >
      <WrapperBox>
        <MainButton
          sx={{ borderRadius: "1px" }}
          title={"Lab Order"}
          onClick={() => setOpen(true)}
        />
      </WrapperBox>
      <LabOrderTable />
      <LabRequestModal open={open} addRequest={addRequest} onClose={() => setOpen(false)} />
    </Panel>
  );
};
