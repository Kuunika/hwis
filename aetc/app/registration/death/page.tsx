"use client";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from "@mui/material";
import { MiddlePageLayout } from "@/components/layouts";
import { BroughtDeadForm } from "../components";
import { useNavigation } from "@/hooks";
import { FaAngleLeft } from "react-icons/fa6";

export default function BroughtDead() {
  const { navigateTo } = useNavigation(); // Initialize navigation

  return (
    <>
      <MiddlePageLayout title="Brought Dead" showBackButton={false}>

        <BroughtDeadForm />
      </MiddlePageLayout>
    </>
  );
}
