import { MainTypography, WrapperBox } from "@/components";
import { Panel } from ".";
import { useVitals } from "@/hooks";
import { BasicSelect } from "../basicSelect";

import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";

import { VisitDates } from "../visitDates";

export const VitalsPanel = () => {
  const { setActivePage, options, isLoading, vitals } = useVitals();

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }
  return (
    <Panel title={"Vitals"} icon={<VisitDates />}>
      <WrapperBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <WrapperBox width={"20%"}>
          <BasicSelect
            getValue={(value: any) => setActivePage(Number(value))}
            label=""
            options={options}
          />
        </WrapperBox>
      </WrapperBox>

      <WrapperBox sx={{ display: "flex", flexWrap: "wrap" }}>
        {vitals.map(({ name, value }: any) => (
          <Cell key={`${value}${name}`} title={name} value={value} />
        ))}
      </WrapperBox>
    </Panel>
  );
};

const Cell = ({ title, value }: { title: string; value: string }) => {
  return (
    <WrapperBox
      sx={{
        width: "15ch",
        display: "flex",
        flexDirection: "column",
        my: "0.5ch",
        alignItems: "center",
      }}
    >
      <MainTypography variant="caption" textAlign={"center"}>
        {title}
      </MainTypography>
      <MainTypography variant="h5">{value}</MainTypography>
    </WrapperBox>
  );
};
