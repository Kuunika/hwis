"use client";
import { useState } from "react";

import { createContext, FC, ReactNode } from "react";

export type AuthContextType = {
    loggedIn: boolean;
    setLoggedIn: (value: any) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(Boolean(localStorage.getItem("accessToken")));




    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
