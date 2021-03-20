import { Fragment } from "react";
import Head from "next/head";

import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MediaGrid } from "../components/MediaGrid";

export default function Home() {
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
        </main>
        <Footer />
      </Container>
    </Fragment>
  );
}
