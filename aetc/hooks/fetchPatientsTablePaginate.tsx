import { useEffect, useState } from "react";
import { getPatientCategoryListPaginated } from "./patientReg";

export const fetchPatientsTablePaginate = (category:'assessment'|'triage') => {
    const [searchText, setSearchText] = useState("");
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const { data, refetch, isPending } = getPatientCategoryListPaginated(
        paginationModel,
        category,
        searchText
    );

      useEffect(() => {

        refetch();
      }, [paginationModel]);
    

    return { data, refetch, isPending, paginationModel, setPaginationModel, searchText, setSearchText }
}