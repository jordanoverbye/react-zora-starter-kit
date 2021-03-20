import React, { Fragment, useCallback, useState } from "react";
import Head from "next/head";
import { verifyMessage } from "@ethersproject/wallet";
import { useWeb3React } from "@web3-react/core";
import { Zora } from "@zoralabs/zdk";
import { Wallet } from "ethers";
import {
  constructBidShares,
  constructMediaData,
  sha256FromBuffer,
  generateMetadata,
} from "@zoralabs/zdk";

import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import ETHBalance from "../components/ETHBalance";

import usePersonalSign from "../hooks/usePersonalSign";
import { useZora } from "../components/ZoraProvider";

export default function Mint() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(false);
  const zora = useZora();

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const name = event.target.name.value;
      const description = event.target.description.value;

      try {
        const metadataJSON = generateMetadata("zora-20210101", {
          name,
          description,
          mimeType: "text/plain",
          version: "zora-20210101",
        });

        const contentHash = sha256FromBuffer(
          Buffer.from(JSON.stringify({ name, description }))
        );

        console.log({ contentHash });
        const metadataHash = sha256FromBuffer(Buffer.from(metadataJSON));
        const mediaData = constructMediaData(
          "https://ipfs.io/ipfs/bafybeifyqibqlheu7ij7fwdex4y2pw2wo7eaw2z6lec5zhbxu3cvxul6h4",
          "https://ipfs.io/ipfs/bafybeifpxcq2hhbzuy2ich3duh7cjk4zk4czjl6ufbpmxep247ugwzsny4",
          contentHash,
          metadataHash
        );

        const bidShares = constructBidShares(
          10, // creator share
          90, // owner share
          0 // prevOwner share
        );
        const tx = await zora.mint(mediaData, bidShares);
        console.log("waiting...");
        const txResult = await tx.wait(8);
        console.log({ x });
      } catch (e) {
        console.log("e", e);
        setErrors(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [zora]
  );

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
              {errors && <div>Error!</div>}
              {isSubmitting && <div>Submitting!</div>}
              {zora.readOnly ? (
                <p>Read Only!!!</p>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <label className="block">
                    <span className="text-gray-700">name</span>
                    <input
                      name="name"
                      type="text"
                      className="mt-1 block w-full"
                      placeholder=""
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">description</span>
                    <input
                      name="description"
                      type="text"
                      className="mt-1 block w-full"
                      placeholder=""
                    />
                  </label>
                  <Button type="submit">Submit</Button>
                </form>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </Container>
    </Fragment>
  );
}
