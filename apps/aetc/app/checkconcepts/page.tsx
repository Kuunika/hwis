"use client";
import { concepts } from "@/constants";
import { ConceptService } from "mahis-api-client";
import { useEffect, useState } from "react";
import { WrapperBox } from "shared-ui/src";

export default function Page() {
  const [notAvailable, setNotAvailable] = useState([]);

  useEffect(() => {
    for (let i = 0; i < keys.length; i++) {
      ConceptService.get(concepts[keys[i]])
        .then((result) => {
          if (result.concept.length == 0) {
            setNotAvailable((concept) => [
              ...concept,
              { name: keys[i], conceptId: concepts[keys[i]] },
            ]);
          }
        })
        .catch((error) => {});

      // await axios.get(
      //   `http://192.168.110.43:3000/api/v1/concepts/${concepts[keys[i]]}`,
      //   {
      //     headers: {
      //       Authorization:
      //         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMWMzZGI0OWQtNDQwYS0xMWU2LWE2NWMtMDBlMDRjNjgwMDM3IiwiZXhwIjoxNzAyOTg2MDUwfQ.0rhvSNs9QXFVDgdPfKomxG0NDMbB_PmgP1piMcd2b0k",
      //     },
      //   }
      // );
    }
  }, []);
  const keys: any = Object.keys(concepts);
  return (
    <>
      <WrapperBox sx={{ padding: "2ch" }}>
        <pre>
          <code className="json">
            <ul>
              {notAvailable.map((c: any) => (
                <li>{`{${c.name}: ${c.conceptId}}`}</li>
              ))}
            </ul>
          </code>
        </pre>
      </WrapperBox>
    </>
  );
}
