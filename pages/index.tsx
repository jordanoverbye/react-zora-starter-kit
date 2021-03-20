import { Fragment } from "react";
import Head from "next/head";

import { verifyMessage } from "@ethersproject/wallet";
import { useWeb3React } from "@web3-react/core";
import ETHBalance from "../components/ETHBalance";

import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MediaGrid } from "../components/MediaGrid";

import usePersonalSign from "../hooks/usePersonalSign";

export default function Home() {
  const { account, library } = useWeb3React();

  const sign = usePersonalSign();

  const handleSign = async () => {
    const msg = "Next Web3 Boilerplate Rules";
    const sig = await sign(msg);
    console.log(sig);
    console.log("isValid", verifyMessage(msg, sig) === account);
  };

  const isConnected = typeof account === "string" && !!library;

  return (
    <Fragment>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <main>
          <div className="py-32 text-center space-y-6">
            <h1 className="text-6xl font-bold ">
              🌜 Zora + NextJS Starter Kit 🌛
            </h1>
            <p className="text-lg text-gray-500">
              Utilities to set the border width for one side of an element.
            </p>
          </div>
          <MediaGrid
            items={[
              {
                name: "Hello",
                description: "Hello World",
              },
              {
                name: "Hello",
                description: "Hello World",
              },
              {
                name: "Hello",
                description: "Hello World",
              },
              {
                name: "Hello",
                description: "Hello World",
              },
              {
                name: "Hello",
                description: "Hello World",
              },
              {
                name: "Hello",
                description: "Hello World",
              },
            ]}
          />
          <h1>
            Welcome to{" "}
            <a href="https://github.com/mirshko/next-web3-boilerplate">
              Next Web3 Boilerplate
            </a>
          </h1>
          {isConnected && (
            <section>
              <ETHBalance />
              <button onClick={handleSign}>Personal Sign</button>
            </section>
          )}
        </main>
        <Footer />
      </Container>
    </Fragment>
  );
}
