import { useState } from "react";

export const useFormLoading = () => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  return {
    loading,
    setLoading,
    completed,
    setCompleted,
    showForm,
    setShowForm,
    message,
    setMessage,
    error,
    setError,
  };
};
