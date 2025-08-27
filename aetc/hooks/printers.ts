import { updatePatient } from "@/services/patient"
import { createPrinter, getAPrinter, updatePrinter } from "@/services/printers"
import { useMutation, useQuery } from "@tanstack/react-query"

export const addPrinter=()=>{

    const addData = (printer:any)=>{
        return createPrinter(printer).then(response=> response.data)
    }
    return useMutation({
        mutationFn: addData,
    })
}
export const editPrinter=(printerId:string)=>{

    const addData = (printer:any)=>{
        return updatePrinter(printerId,printer).then(response=> response.data)
    }
    return useMutation({
        mutationFn: addData,
    })
}
export const getOnePrinter=(printerId:string)=>{
    const getOne = ()=>{
        return getAPrinter(printerId).then(response=> response.data)
    }
    return useQuery({
        queryKey:['printers', printerId],
        queryFn: getOne,
        enabled:true
    })
}