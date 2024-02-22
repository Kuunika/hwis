import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { WrapperBox } from "shared-ui/src";

export const DemographicsSearchSkeleton = () => {
  const leftWidth = "20ch";
  const rightWidth = "40ch";
  return (
    <WrapperBox display={"flex"}>
      <Stack sx={{ mr: "0.5ch" }} spacing={"0.5ch"}>
        <Skeleton variant="rectangular" width={leftWidth} height={60} />
        <Skeleton variant="rectangular" width={leftWidth} height={60} />
        <Skeleton variant="rectangular" width={leftWidth} height={60} />
        <Skeleton variant="rectangular" width={leftWidth} height={60} />
      </Stack>
      <Stack>
        <Skeleton variant="rectangular" width={rightWidth} height={255} />
      </Stack>
    </WrapperBox>
  );
};
