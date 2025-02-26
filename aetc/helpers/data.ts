import { Obs } from "@/interfaces";
import { queryClient } from "@/providers";

export const getCachedConcept = (name:string):Obs=>{
    const concept:any = queryClient.getQueryData(["concepts",name]);
 
    return  concept?.data[0] as Obs;

}

export const isUUID = (str: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };