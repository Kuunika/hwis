import type { Metadata, Viewport } from "next";
import localFont from "next/font/local"; // ⬅️ use local instead of google
import "./globals.css";
import { NavBar } from "@/components";
import { ProviderTheme } from "@/components/providers";
import { ContextProviders, ReactQueryProvider } from "@/providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OverlayLoader } from "@/components/backdrop";
import CssBaseline from "@mui/material/CssBaseline";
import { PrinterDialog } from "@/components/printerDialog";
import { ErrorBoundary } from "./components/errorBoundary";

// Load Inter locally
const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const APP_NAME = "Mahis";
const APP_DEFAULT_TITLE = "Malawi Healthcare information System";
const APP_TITLE_TEMPLATE = "%s - MHIS";
const APP_DESCRIPTION = "Malawi Healthcare information System";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body
        style={{ backgroundColor: "#F6F6F6" }}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <ReactQueryProvider>
            <ContextProviders>
              <ProviderTheme>
                <CssBaseline />
                <NavBar />
                {children}
                <PrinterDialog />
                <OverlayLoader open={false} />
                <ToastContainer limit={1} />
              </ProviderTheme>
            </ContextProviders>
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
