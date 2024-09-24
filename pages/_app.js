import React from "react";
import Navigation from "../src/components/Navigation";
import "@styles/globals.css";
import Footer from "../src/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@contexts/AuthProvider";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();

  const getLayout =
    Component.getLayout ||
    ((page) => (
      <>
        <Navigation />
        <main style={{ paddingBottom: "16rem" }}>{page}</main>
        <Footer />
      </>
    ));
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
