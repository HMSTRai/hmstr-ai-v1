// app/layout.js
import "react-toastify/dist/ReactToastify.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "react-svg-map/lib/index.css";
import "leaflet/dist/leaflet.css";
import "./scss/app.scss";

import { ClerkProvider } from '@clerk/nextjs'; // Add this import

export const metadata = {
  title: "HMSTR Dashboard",
  description: "HMSTR is a popular dashboard template.",
};

import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import ThemeProvider from "./theme-provider.jsx";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-inter custom-tippy -app">
        <ClerkProvider> {/* Add this wrapper */}
          <ThemeProvider>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              {children}
            </Suspense>
          </ThemeProvider>
        </ClerkProvider> {/* End wrapper */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </body>
    </html>
  );
}