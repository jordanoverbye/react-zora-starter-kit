import { Fragment } from 'react';
import Head from 'next/head';

import { Container } from '../components/Container';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { MediaGrid } from '../components/MediaGrid';

export default function Home({ items }) {
  return (
    <Fragment>
      <Head>
        <title>Zora + Next.js Starter Kit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <main>
          <div className="py-32 text-center space-y-6">
            <h1 className="text-6xl font-bold ">🌜 Zora + Next.js Starter Kit 🌛</h1>
            <p className="text-lg text-gray-500">
              A simple starter kit intended to help assist with the creation of decentralized NFT marketplaces.
            </p>
          </div>
          <MediaGrid items={items} />
        </main>
        <Footer />
      </Container>
    </Fragment>
  );
}

export async function getStaticProps() {
  const items = await fetchMediaItems();
  return { props: { items } };
}

async function fetchMediaItems() {
  // Fetch the data from The Graph
  const request = await fetch('https://api.thegraph.com/subgraphs/name/ourzora/zora-v1-rinkeby', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query getMediaItems($first: Int!, $creator: String!) {
          medias(
            orderBy: createdAtTimestamp, 
            orderDirection: desc,
            first: $first, 
            where: { creator: $creator }
          ) {
              id
              contentURI
              metadataURI
              createdAtTimestamp
          }
        }`,
      variables: {
        first: 12,
        // ZORA saves the `creator` field in lowercase
        creator: process.env.CREATOR_ADDRESS.toLowerCase(),
      },
    }),
  });
  const json = await request.json();
  const { medias } = json.data;

  // Fetch the contents of each metadata

  const items = await Promise.all(
    medias.map(async media => {
      try {
        const request = await fetch(media.metadataURI);
        const metadata = await request.json();
        return { ...media, ...metadata };
      } catch {
        return media;
      }
    })
  );

  return items;
}
