"use client";

import { FaPager } from "react-icons/fa6";
import { FcTemplate, FcTodoList, FcList } from "react-icons/fc";
import { MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import Link from "next/link";

export default function Home() {
  return (
    <WrapperBox
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <MenuCard icon={<FcTemplate />} title="Form Builder" />
      <MenuCard icon={<FcTodoList />} title="Data Element" />
      <MenuCard icon={<FcList />} title="Option Sets" />
    </WrapperBox>
  );
}

type Prop = {
  icon: any;
  title: string;
};

const MenuCard = ({ icon, title }: Prop) => {
  return (
    <Link href="/build-form" style={{ textDecoration: "none" }}>
      <MainPaper
        sx={{
          display: "flex",
          px: 1,
          py: 2,
          width: "25ch",
          cursor: "pointer",
          m: 1,
        }}
      >
        <MainTypography variant="h2" mr={3}>
          {icon}
        </MainTypography>

        <WrapperBox>
          <MainTypography variant="h5">{title}</MainTypography>
          <br />
          <MainTypography
            variant="subtitle2"
            color={"gray"}
            fontStyle={"italic"}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            vehicula odio vel arcu semper
          </MainTypography>
        </WrapperBox>
      </MainPaper>
    </Link>
  );
};
