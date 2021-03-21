import { Fragment, useState } from 'react';
import Head from 'next/head';
import { formatCurrency } from '@coingecko/cryptoformat';

import { Container, Header, Footer } from '../../components/Layout';
// import { BidForm } from '../../components/BidForm';

export default function Item({ item }) {
  const [tab, setTab] = useState('Ownership');
  return (
    <Fragment>
      <Head>
        <title>{item.name} — Zora + Next.js Starter Kit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <main className="py-24 space-y-32">
          <section className="grid grid-cols-2 gap-16">
            <div>
              <img src={item.contentURI} className="block w-full" alt={item.name} />
            </div>
            <div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-6xl font-bold">{item.name}</h1>
                  <p className="text-xl text-gray-400">{item.description}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b">
                    <div className="flex">
                      <button
                        className={`"text-gray-500 p-2 ${tab === 'Ownership' && 'text-blue-500'}`}
                        onClick={() => setTab('Ownership')}
                      >
                        Ownership
                      </button>
                      <button
                        className={`"text-gray-500 p-2 ${tab === 'Current Bids' && 'text-blue-500'}`}
                        onClick={() => setTab('Current Bids')}
                      >
                        Current Bids
                      </button>

                      <button
                        className={`"text-gray-500 p-2 ${tab === 'Bid' && 'text-blue-500'}`}
                        onClick={() => setTab('Bid')}
                      >
                        Bid
                      </button>
                    </div>
                  </div>
                  <div>
                    {tab === 'Ownership' && (
                      <div className="bg-gray-100 p-4 space-y-2 rounded-lg">
                        <span className="block text-xl">{item.creator.id}</span>
                        <a
                          className="inline-block py-1 px-3 text-gray-400 border border-gray-300 rounded-lg"
                          href={`https://etherscan.io/address/${item.creator.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Etherscan &#x2197;
                        </a>
                      </div>
                    )}
                    {tab === 'Current Bids' && (
                      <div>
                        {item.currentBids.length === 0 ? (
                          <div className="bg-gray-100 p-4 rounded-lg">
                            <span className="text-gray-600">No current bids</span>
                          </div>
                        ) : (
                          item.currentBids.map((bid, idx) => (
                            <tr key={bid.id} className={idx % 2 == 0 ? 'bg-gray-100' : undefined}>
                              <td className="p-2">{formatCurrency(bid.amount, bid.currency.symbol, 'en')}</td>
                              <td className="p-2">
                                <a
                                  href={`https://etherscan.io/address/${bid.bidder.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {bid.bidder.id}
                                </a>
                              </td>
                              <td className="p-2">
                                {formatDistance(new Date(bid.createdAtTimestamp * 1000), new Date(), {
                                  addSuffix: true,
                                })}
                              </td>
                            </tr>
                          ))
                        )}
                      </div>
                    )}
                    {/* {tab === 'Bid' && <BidForm id={item} />} */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </Container>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  // Fetch data from the graph
  const request = await fetch(process.env.ZORA_SUB_GRAPH_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query getMediaItem($id: String!) {
        media(id: $id) {
          id
          contentURI
          metadataURI
          createdAtTimestamp
          createdAtBlockNumber
          creator { id }
          owner { id }
          currentBids {
            id
            amount
            createdAtTimestamp
            createdAtBlockNumber
            currency { id symbol }
            bidder { id }
            sellOnShare      
          }
          inactiveBids {
            id
            amount
            createdAtTimestamp
            currency { id symbol }
            bidder { id }
            sellOnShare   
          }
        }
      }`,
      variables: { id },
    }),
  });
  const {
    data: { media },
  } = await request.json();

  if (media.creator.id !== process.env.NEXT_PUBLIC_CREATOR_ADDRESS) {
    return { notFound: true };
  }

  // Fetch the contents of the metadata
  const metaDataRequest = await fetch(media.metadataURI);
  const metadata = await metaDataRequest.json();
  return {
    props: {
      item: { ...media, ...metadata },
    },
  };
}
