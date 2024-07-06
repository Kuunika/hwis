import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components";
import { ProviderTheme } from "@/components/providers";
import { ContextProviders, ReactQueryProvider } from "@/providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigation } from "@/hooks";
import { OverlayLoader } from "@/components/backdrop";
import CssBaseline from '@mui/material/CssBaseline';


const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "MAHIS",
  description: "Malawi Health information system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {




  return (
    <html lang="en">
      <head>
        {/* <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Droid+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght=400;700&display=swap" rel="stylesheet" /> */}
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ReactQueryProvider>
          <ContextProviders>
            <ProviderTheme>
            <CssBaseline />
              <NavBar />
              {children}
              <OverlayLoader open={false} />
              <ToastContainer limit={1} />
            </ProviderTheme>
          </ContextProviders>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
