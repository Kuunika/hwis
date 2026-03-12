"use client";

import dynamic from "next/dynamic";

const ReactToastifyContainer = dynamic(
  () => import("react-toastify").then((module) => module.ToastContainer),
  { ssr: false },
);

export const AppToastContainer = () => <ReactToastifyContainer limit={1} />;
