import { Fragment } from "react";
import Head from "next/head";

import { Container } from "../../components/Container";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";

export default function Item({ item }) {
  console.log(item);
  return (
    <Fragment>
      <Head>
        <title>Create Next App</title>
      </Head>
      <Container>
        <Header />
        <main className="py-32">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <img src={item.contentURI} className="block w-full" />
            </div>
            <div>
              <div className="space-y-12">
                <h1 className="text-4xl font-bold">{item.metadata.name}</h1>
                <p className="text-lg text-gray-500">
                  {item.metadata.description}
                </p>
                <p className="text-lg text-gray-500">
                  Created: ${item.createdAtTimestamp}
                </p>
                <a
                  className="block"
                  href={`https://rinkeby.etherscan.io/block/${item.createdAtBlockNumber}`}
                  target="_blank"
                >
                  Proof of Authenticity
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </Container>
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const query = `query getMediaItem($id: String!) {
    media(id: $id) {
      id
      contentURI
      metadataURI
      createdAtTimestamp
      createdAtBlockNumber
    }
  }`;

  const request = await fetch(
    "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1-rinkeby",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { id: "3" },
      }),
    }
  );

  const {
    data: { media },
  } = await request.json();

  const metaDataRequest = await fetch(media.metadataURI);
  const metadata = await metaDataRequest.json();

  return {
    props: {
      item: { ...media, metadata },
    },
  };
}

export async function getStaticPaths() {
  const query = `query getMediaItems($creator: String!) { medias(where: { creator: $creator }) { id } }`;
  const request = await fetch(
    "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1-rinkeby",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { creator: "0x082bd7f9454e0ae94321bcc483ffc8570bfb23f0" },
      }),
    }
  );
  const json = await request.json();

  return {
    paths: json.data.medias.map((i) => `/item/${i.id}`),
    fallback: true,
  };
}
