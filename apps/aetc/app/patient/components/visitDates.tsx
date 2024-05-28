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
import { MainTypography } from "shared-ui/src";
import { PatientProfileContext, PatientProfileContextType } from "@/contexts";


type Prop = {
  visits: string[]
}

const dates = [
  "Today",
  "14th October, 2023",
  "14th September, 2023",
  "6th September, 2014",
];

export function VisitDates({ visits }: Prop) {
  const { setActiveVisit } = React.useContext(PatientProfileContext) as PatientProfileContextType;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

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
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            cursor: "pointer",
          }}
        >
          <h3>
            <FaCalendarDays />
          </h3>
          <MainTypography
            sx={{
              ml: "1ch",
              fontFamily: "Inter",
              lineHeight: "17px",
              letterSpacing: "0em",
              textAlign: "left",
              textTransform: "capitalize",
            }}
          >
            6th October, 2023
          </MainTypography>
        </Box>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
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

                          "&:hover": {
                            "& .icon": {
                              display: "block",
                            },
                          },
                        }}
                        key={d}
                        onClick={(event: any) => {
                          setActiveVisit(d)
                          handleClose(event)
                        }}
                      >
                        <MainTypography
                          sx={{
                            fontFamily: "Inter",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "21px",
                            letterSpacing: "0em",
                            textAlign: "left",
                          }}
                        >
                          {d}
                        </MainTypography>
                        <MainTypography className="icon">
                          <FaCheck />
                        </MainTypography>
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
