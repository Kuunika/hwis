import { AETC_VISIT_TYPE, encounters } from "@/constants";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PatientVisitService } from "mahis-api-client";
import { ToastContainer, toast } from "react-toastify";

export const addObservation = () => {
  const queryClient = useQueryClient();
  const addData = async (obsData: any) => {
    const visit = new PatientVisitService(new Date().toISOString());

    await visit.loadPatient("c0c9e5c2-cab2-43ee-89fe-4433c3997981");

    await visit.startVisit(AETC_VISIT_TYPE, new Date().toISOString());

    await visit.createEncounter(obsData.encounter, mappedData(obsData.obs));

    const notify = () =>
      toast.success("Patient vitals saved successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    notify();

    // await visit.stopVisit("");
    return new Promise((resolve, reject) => {});
  };

  return useMutation({
    mutationFn: addData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["forms"],
      });
    },
  });
};

const mappedData = (vitals: any) => {
  return Object.keys(vitals).map((vital) => {
    return {
      concept: vital,
      value: vitals[vital],
      obsDatetime: "2023-11-20",
    };
  });
};
