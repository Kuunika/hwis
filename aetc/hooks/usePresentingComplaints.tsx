import { useEffect, useState } from "react";
import { getConceptFromCacheOrFetch } from "./encounter";
import { concepts } from "@/constants";

export const usePresentingComplaints = () => {
  const [presentingComplaints, setPresentingComplaints] = useState([]);
  useEffect(() => {
    (async () => {
      let complaints = await getConceptFromCacheOrFetch(
        concepts.PRESENTING_COMPLAINTS
      );
      complaints = complaints.data[0].set_members.map((complaint: any) => {
        return {
          id: complaint?.names[0]?.uuid,
          label: complaint?.names[0]?.name,
        };
      });
      setPresentingComplaints(complaints);
    })();
  }, []);

  return { presentingComplaints };
};
