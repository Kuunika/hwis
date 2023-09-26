"use client";

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
      <MenuCard icon={<FcTemplate />} link="/build-form" title="Form Builder" />
      <MenuCard
        icon={<FcTodoList />}
        link="/data-elements"
        title="Data Element"
      />
      <MenuCard icon={<FcList />} link="/option-sets" title="Option Sets" />
    </WrapperBox>
  );
}

type Prop = {
  icon: any;
  title: string;
  link: string;
};

const MenuCard = ({ icon, title, link }: Prop) => {
  return (
    <Link href={link} style={{ textDecoration: "none" }}>
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
