import { createPrinter } from "@/services/printers"
import { useMutation } from "@tanstack/react-query"

export const addPrinter=()=>{

    const addData = (printer:any)=>{
        return createPrinter(printer).then(response=> response.data)
    }
    return useMutation({
        mutationFn: addData,
    })
}