"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/forgot-password", { email });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Link href="../login">Back</Link>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">reset password</button>
    </form>
  );
};

export default ForgotPassword;
