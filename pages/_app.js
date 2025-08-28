import "../styles/globals.css";
import Head from "next/head";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Bonnes Recettes</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
