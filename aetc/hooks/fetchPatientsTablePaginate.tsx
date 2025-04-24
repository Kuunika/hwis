import { useEffect, useState } from "react";
import { getDailyVisitsPaginated } from "@/services/patient";
import { queryClient } from "@/providers";
import { DailyVisitPaginated, Patient } from "@/interfaces";

// Define types
type Category = "assessment" | "triage";

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

  useEffect(() => {
    fetchData();
  }, [paginationModel, searchText]);

  const fetchData = async () => {
    setLoading(true);
    const response = await getPatientsFromCacheOrFetch(
      category,
      paginationModel.pageSize,
      searchText,
      paginationModel.page + 1
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
  };
};

export const getPatientsFromCacheOrFetch = async (
  category: Category,
  pageSize: number,
  searchString: string,
  page: number
): Promise<any> => {
  const cacheKey = [category, pageSize, searchString, page];
  const cachedPatientList =
    queryClient.getQueryData<DailyVisitPaginated>(cacheKey);

  if (cachedPatientList) {
    console.log("using cached data", cachedPatientList);
    return cachedPatientList;
  } else {
    const patientList = await getDailyVisitsPaginated(
      `category=${category}&page=${page}&page_size=${pageSize}&search=${searchString}`
    );
    queryClient.setQueryData(cacheKey, patientList);

    return patientList;
  }
};
