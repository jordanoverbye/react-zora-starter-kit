import { Fragment } from "react";
import Head from "next/head";

import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export default function Mint() {
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
            <h1 className="text-6xl font-bold ">Mint CryptoMedia </h1>
          </div>
          <div className="mt-8 max-w-md mx-auto">
            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-gray-700">Full name</span>
                <input
                  type="text"
                  className="mt-1 block w-full"
                  placeholder=""
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Email address</span>
                <input
                  type="email"
                  className="mt-1 block w-full"
                  placeholder="john@example.com"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">When is your event?</span>
                <input type="date" className="mt-1 block w-full" />
              </label>
              <label className="block">
                <span className="text-gray-700">What type of event is it?</span>
                <select className="block w-full mt-1">
                  <option>Corporate event</option>
                  <option>Wedding</option>
                  <option>Birthday</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Additional details</span>
                <textarea className="mt-1 block w-full" rows="3"></textarea>
              </label>
              <div className="block">
                <div className="mt-2">
                  <div>
                    <label className="inline-flex items-center">
                      <input type="checkbox" checked="" />
                      <span className="ml-2">
                        Email me news and special offers
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </Container>
    </Fragment>
  );
}
