import React, { Fragment, useCallback, useState } from 'react';
import Head from 'next/head';
import { constructBidShares, constructMediaData, sha256FromBuffer, generateMetadata } from '@zoralabs/zdk';

import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

import { useZora } from '../components/ZoraProvider';

export default function Mint() {
  const zora = useZora();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(false);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const name = event.target.elements.name.value;
        const description = event.target.elements.description.value;
        const file = event.target.elements.file.files[0];

        const { metadataHash, metadataURI } = await generateAndUploadMetadata(name, description);

        const { contentURI, contentHash } = await generateAndUploadToken(file);

        const mediaData = constructMediaData(contentURI, metadataURI, contentHash, metadataHash);

        const bidShares = constructBidShares(
          10, // creator share
          90, // owner share
          0 // prevOwner share
        );

        const tx = await zora.mint(mediaData, bidShares);
        const txResult = await tx.wait(8);

        console.log('done');
      } catch (e) {
        console.log('e', e);
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
                    <span className="text-gray-700">Token Name</span>
                    <input name="name" type="text" className="mt-1 block w-full" />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Token Description</span>
                    <input name="description" type="text" className="mt-1 block w-full" />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Token File</span>
                    <input type="file" name="file" className="mt-1 block w-full" />
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

async function generateAndUploadMetadata(name: string, description: string) {
  const formData = new FormData();
  const metadata = {
    name,
    description,
    mimeType: 'text/plain',
    version: 'zora-20210101',
  };
  formData.append(
    'file',
    new File([JSON.stringify(metadata)], 'metadata.json', {
      type: 'text/plain',
    })
  );
  const request = await fetch('api/upload', { method: 'POST', body: formData });
  const json = await request.json();

  const metadataURI = json.data;
  const metadataJSON = generateMetadata('zora-20210101', metadata);
  const metadataHash = sha256FromBuffer(Buffer.from(metadataURI));

  return { metadataHash, metadataURI };
}

async function generateAndUploadToken(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const request = await fetch('api/upload', { method: 'POST', body: formData });
  const json = await request.json();

  const contentURI = json.data;
  const contentHash = sha256FromBuffer(Buffer.from(contentURI));

  return { contentURI, contentHash };
}
