import { Obs } from "@/interfaces";
import { queryClient } from "@/providers";

export const getCachedConcept = (name:string):Obs=>{
    return  queryClient.getQueryData(["concepts",name]) as Obs;

}