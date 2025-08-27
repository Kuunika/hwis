import { createTheme, useMediaQuery } from "@mui/material";

export const checkScreenSize = ()=>{
    const theme=createTheme()
    const isMediumOrSmall= useMediaQuery(theme.breakpoints.between('sm', 'md'));
    return {isMediumOrSmall}  
}