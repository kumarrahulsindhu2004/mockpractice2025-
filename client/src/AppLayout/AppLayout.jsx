import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./Footer";
import Header from "./Header";

function AppLayout() {
  return (
    <>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: '"DM Sans", sans-serif',
            fontSize: "0.925rem",
            fontWeight: 500,
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
            border: "1px solid #e2e8f0",
          },
          success: {
            iconTheme: { primary: "#059669", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "#fff" },
          },
        }}
      />
    </>
  );
}

export default AppLayout;
