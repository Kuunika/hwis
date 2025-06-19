// config/testOptions.ts
import { concepts } from "@/constants";

export const getTestStatusOptions = () => [
  { value: concepts.POSITIVE, label: "Positive" },
  { value: concepts.NEGATIVE, label: "Negative" },
  { value: concepts.INDETERMINATE, label: "Indeterminate" },
];
