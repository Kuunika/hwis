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
      <body className={inter.className} suppressHydrationWarning={true}>
        <ReactQueryProvider>
          <ContextProviders>
            <ProviderTheme>
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
