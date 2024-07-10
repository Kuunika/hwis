'use client'
import { checkScreenSize } from "@/hooks";
import { PatientCardList } from "./cards/PatientCardList";
import { BaseTable } from "./tables";

type props = {
    isLoading:boolean;
    columns:any;
    rows: any;
    formatForMobileView: any
}

export const PatientTableList = ({isLoading, columns,rows,formatForMobileView}:props)=>{
    const { isMediumOrSmall } = checkScreenSize();

    return isMediumOrSmall ? (
        <PatientCardList
          loading={isLoading}
          dataList={formatForMobileView ? formatForMobileView : []}
        />
      ) : (
        <BaseTable
          loading={isLoading}
          columns={columns}
          rows={rows ? rows : []}
        />
      );
    };
