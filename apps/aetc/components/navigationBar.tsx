"use client";
import { SearchContainer } from "@/app/registration/search/components";
import { useNavigation } from "@/hooks";
import { NavigationBar, WrapperBox } from "shared-ui/src";
import { useContext, useEffect } from "react";
import { AuthContext, AuthContextType } from "@/contexts";



export const NavBar = () => {
  const { navigateTo } = useNavigation();
  const { loggedIn, setLoggedIn } = useContext(AuthContext) as AuthContextType

  useEffect(() => {
    if (!loggedIn) {
      navigateTo("/")
    }
  }, [])


  const handleLogout = () => {
    localStorage.clear()
    setLoggedIn(false)
    navigateTo("/")
  }

  const search = (
    <WrapperBox
      sx={{
        width: "496px",
        position: "relative",
        backgroundColor: "#fff",
        borderRadius: "8px",
        height: "48px",
      }}
    >
      <SearchContainer label="" placeHolder="Search Patient" initialValue="" />
    </WrapperBox>
  );

  // return <NavigationBar onTitleClick={() => navigateTo("/")} search={search} />;
  return <>
    <NavigationBar loggedIn={loggedIn} handleLogout={handleLogout} onTitleClick={() => navigateTo("/dashboard")} />
  </>
};
