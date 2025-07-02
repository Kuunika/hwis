"use client";
import { SearchContainer } from "@/app/registration/search/components";
import { useNavigation, useParameters } from "@/hooks";
import { NavigationBar, WrapperBox } from "@/components";
import { useContext, useEffect } from "react";
import { AuthContext, AuthContextType } from "@/contexts";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const { navigateTo } = useNavigation();
  const { loggedIn, setLoggedIn } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    if (localStorage) {
      if (!Boolean(localStorage.getItem("accessToken"))) {
        // navigateTo("/")
      }
    }
  }, []);
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    navigateTo("/");
  };
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
  return (
    <>
      {pathname === "/" ? null : (
        <NavigationBar
          loggedIn={loggedIn}
          handleLogout={handleLogout}
          onTitleClick={() => navigateTo("/dashboard")}
        />
      )}
    </>
  );
};
