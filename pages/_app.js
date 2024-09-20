import React from "react";
import Navigation from "../src/components/Navigation";
import "@styles/globals.css";
import Footer from "../src/components/Footer";

function MyApp({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <>
        <Navigation />
        <main style={{ paddingBottom: "16rem" }}>{page}</main>
        <Footer />
      </>
    ));
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
