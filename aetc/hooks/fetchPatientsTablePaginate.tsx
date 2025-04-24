import { useEffect, useState } from "react";
import { getDailyVisitsPaginated } from "@/services/patient";

export const fetchPatientsTablePaginate = (
  category: "assessment" | "triage"
) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState("");
  const [patients, setPatients] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  const fetchData = async () => {
    setLoading(true);
    const data = await getDailyVisitsPaginated(
      `category=${category}&page=${Number(paginationModel.page) + 1}&page_size=${paginationModel.pageSize}&search=${searchText}`
    );

    setPatients(data.data.data);
    setTotalPages(data.data.total_pages);
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
