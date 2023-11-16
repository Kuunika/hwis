"use client";
import Link from "next/link";
import { MainCard, StepperContainer } from "shared-ui/src";
import NewStepper from '../../../packages/shared-ui/src/newStepper/NewStepper';

export default function Page() {
  return (
    <>
     <NewStepper/>
      {/* <ul>
        <li>
          <Link href={"http://localhost:8000"} legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              Triage
            </a>
          </Link>
        </li>
        <li>
          <Link href={"http://localhost:8001"} legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              Registration
            </a>
          </Link>
        </li>
        <li>
          <Link href={"http://localhost:8002"} legacyBehavior>
            <a target="_blank" rel="noopener noreferrer">
              AETC
            </a>
          </Link>
        </li>
      </ul> */}
    </>
  );
}
