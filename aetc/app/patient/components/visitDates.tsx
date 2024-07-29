import * as React from "react";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { FaCalendarDays, FaCheck } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MainTypography } from "@/components";
import { PatientProfileContext, PatientProfileContextType } from "@/contexts";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { useParameters } from "@/hooks";
import { useEffect, useState } from "react";
import { ActiveVisit } from "@/interfaces";
import { getHumanReadableDate } from "@/helpers/dateTime";


export function VisitDates() {
  const { setActiveVisit, activeVisit, setOpenVisit } = React.useContext(PatientProfileContext) as PatientProfileContextType;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const {params} =useParameters()
  const [visits, setVisits]=useState<ActiveVisit[]>([])
  const [activeDate, setActiveDate]=useState<Date|string>('')


  const {data, isLoading, isSuccess}=getPatientVisitTypes(params?.id as string);

useEffect(()=>{
  if(isSuccess){
    const active=data.find(d=> !Boolean(d.date_stopped));
    if(active){
      setActiveDate(active?.date_started)
      setActiveVisit(active?.visit_id)
      setOpenVisit(true)
    } else {
      setOpenVisit(false)
    }
    setVisits(data)
  }
},[isSuccess])


  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Box
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          sx={{
            display: "flex",
            cursor: "pointer",
            alignItems:"center"
        
          }}
        >
       <MainTypography sx={{marginRight:"1ch", fontWeight:"bold"}}>Visit date:</MainTypography>
            <FaCalendarDays />
          <MainTypography
            sx={{
              marginRight:"1ch", 
              ml: "1ch",
              lineHeight: "17px",
              letterSpacing: "0em",
              textAlign: "left",
              textTransform: "capitalize",
            }}
          >
           {getHumanReadableDate(activeDate)}
          </MainTypography>
          {open?<IoIosArrowUp />:<IoIosArrowDown />}
        </Box>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
          sx={{zIndex:100000}}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
             
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {visits.map((d) => (
                      <MenuItem

                        sx={{
                          py: "2ch",
                          mx: "1ch",
                          display: "flex",
                          justifyContent: "space-between",
                          width: "240px",
                          "& .icon": {
                            display: "none",
                          },

                          // "&:hover": {
                          //   "& .icon": {
                          //     display: "block",
                          //   },
                          // },
                        }}
                        key={d.visit_id}
                        onClick={(event: any) => {
                          setActiveVisit(d.visit_id)
                          setActiveDate(d.date_started)
                          handleClose(event)
                        }}
                      >
                        <MainTypography
                          sx={{
                            lineHeight: "21px",
                            letterSpacing: "0em",
                            textAlign: "left",
                          }}
                        >
                          {getHumanReadableDate(d.date_started)}
                        </MainTypography>
                       { activeVisit==d.visit_id && <MainTypography>
                          <FaCheck />
                        </MainTypography>}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}
