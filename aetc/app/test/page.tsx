"use client";
import Image from "next/image";
import { useState } from "react";
import { WrapperBox } from "@/components";
export default function Page() {
  const [part, setPart] = useState("select part");
  return (
    <WrapperBox sx={{ display: "flex" }}>
      <WrapperBox
        sx={{
          width: "50ch",
          height: "50ch",
          position: "relative",
        }}
      >
        <Image
          style={{ width: "100%", height: "100%" }}
          src="/lung.jpg"
          width={500}
          height={500}
          alt="Picture of the author"
        />

        <WrapperBox
          onClick={() => setPart("upper")}
          sx={{
            position: "absolute",
            top: "0%",
            height: "33%",
            backgroundColor: "",
            width: "100%",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(52, 152, 219, 0.5)",
            },
          }}
        >
          upper
        </WrapperBox>
        <WrapperBox
          onClick={() => setPart("middle")}
          sx={{
            position: "absolute",
            top: "33%",
            height: "33%",
            cursor: "pointer",
            backgroundColor: "",
            width: "100%",
            "&:hover": {
              backgroundColor: "rgba(52, 152, 219, 0.5)",
            },
          }}
        >
          middle
        </WrapperBox>
        <WrapperBox
          onClick={() => setPart("lower")}
          sx={{
            position: "absolute",
            top: "66%",
            backgroundColor: "",
            width: "100%",
            cursor: "pointer",
            height: "33%",
            "&:hover": {
              backgroundColor: "rgba(52, 152, 219, 0.5)",
            },
          }}
        >
          Lower
        </WrapperBox>
      </WrapperBox>

      <WrapperBox>
        <h1>{part}</h1>
      </WrapperBox>
    </WrapperBox>
  );
}
