"use client"

import { FormContainer } from "shared-ui/src"
import { RegistrationFlow } from "./anc/registration/registrationFlow"

export default function Home() {
  return (
    <FormContainer>
      <RegistrationFlow/>
    </FormContainer>
  )
}
