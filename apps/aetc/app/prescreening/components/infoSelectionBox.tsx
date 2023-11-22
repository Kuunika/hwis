import { MainTypography, WrapperBox } from "shared-ui/src";

interface Information {
  title: string;
  infoList: {
    id: string;
    body: string;
  }[];
}

export const InformationRow = () => {
  const clinicalInfo = {
    title: "Clinical Information",
    infoList: [
      {
        id: "1",
        body: "Illum odio egestas tincidunt eligendi culpa. Sapien sem eum! Aut posuere officiis animi earum accusamus",
      },
      {
        id: "2",
        body: "Auctor eum ligula possimus, donec vel nec leo, inceptos itaque",
      },
      {
        id: "3",
        body: "Auctor eum ligula possimus, donec vel nec leo, inceptos itaque",
      },
      {
        id: "4",
        body: "Auctor eum ligula possimus, donec vel nec leo, inceptos itaque",
      },
      {
        id: "5",
        body: "Auctor eum ligula possimus, donec vel nec leo, inceptos itaque",
      },
    ],
  };

  const presentingInfo = { ...clinicalInfo, title: "Presenting Complaints" };
  const differentialDiagnosis = {
    ...clinicalInfo,
    title: "Differential Diagnosis",
  };
  return (
    <WrapperBox sx={{ display: "flex" }}>
      <InformationBox info={clinicalInfo} />
      <InformationBox info={presentingInfo} />
      <InformationBox info={differentialDiagnosis} />
    </WrapperBox>
  );
};

interface Prop {
  info: Information;
}

export const InformationBox = ({ info }: Prop) => {
  return (
    <WrapperBox sx={{ padding: "1ch", m: "0.5ch" }}>
      <MainTypography variant="h5">{info.title}</MainTypography>
      <WrapperBox
        sx={{
          width: "30ch",
          height: "40ch",
          overflow: "scroll",
        }}
      >
        {info.infoList.map((i) => (
          <WrapperBox
            key={i.id}
            sx={{
              cursor: "pointer",
              my: "1ch",
              p: "1ch",
              "&:hover": { backgroundColor: "#F6F6F6" },
            }}
          >
            <MainTypography>{i.body}</MainTypography>
          </WrapperBox>
        ))}
      </WrapperBox>
    </WrapperBox>
  );
};
