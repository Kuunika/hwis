import { useEffect, useState } from "react";
import { getDailyVisitsPaginated } from "@/services/patient";
import { queryClient } from "@/providers";
import { DailyVisitPaginated, Patient } from "@/interfaces";

// Define types
type Category =
  | "assessment"
  | "triage"
  | "disposition"
  | "screening"
  | "registration";

interface PaginationModel {
  page: number;
  pageSize: number;
}

export const fetchPatientsTablePaginate = (category: Category) => {
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState<string>("");
  const [patients, setPatients] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [onSwitch, setOnSwitch] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [paginationModel, searchText, onSwitch]);

  const fetchData = async () => {
    setLoading(true);
    let date;

    if (onSwitch) {
      date = new Date().toISOString().split("T")[0];
    }

    const response = await getPatientsFromCacheOrFetch(
      category,
      paginationModel.pageSize,
      searchText,
      paginationModel.page + 1,
      date || ""
    );

    setPatients(response.data.data);
    setTotalPages(response.data.total_pages);
    setLoading(false);
  };

  return {
    loading,
    patients,
    paginationModel,
    setPaginationModel,
    searchText,
    setSearchText,
    totalPages,
    setOnSwitch,
  };
};

export const getPatientsFromCacheOrFetch = async (
  category: Category,
  pageSize: number,
  searchString: string,
  page: number,
  date: string
): Promise<any> => {
  const cacheKey = [category, pageSize, searchString, page];
  const cachedPatientList =
    queryClient.getQueryData<DailyVisitPaginated>(cacheKey);

  if (cachedPatientList) {
    console.log("using cached data", cachedPatientList);
    return cachedPatientList;
  } else {
    const patientList = await getDailyVisitsPaginated(
      `category=${category}&page=${page}&page_size=${pageSize}&search=${searchString}&date=${date}`
    );
    queryClient.setQueryData(cacheKey, patientList);

    setTimeout(() => {
      //   console.log("object");
      //   queryClient.invalidateQueries(cacheKey);
      //   queryClient.invalidateQueries({ queryKey: cacheKey, exact: true });
      queryClient.removeQueries({ queryKey: cacheKey, exact: true });
    }, 5000);

    return patientList;
  }
};
