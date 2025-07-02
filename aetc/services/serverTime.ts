import { create, edit, getAll, get } from "./httpService";

export const getServerTime =()=>get<{server_time:string}>('server_time');