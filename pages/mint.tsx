import { Fragment } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { Container } from '../components/Container';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

const MintForm = dynamic(() => import('../components/MintForm'), { ssr: false });

export default function Mint() {
  return (
    <Fragment>
      <Head>
        <title>Mint — Zora + Next.js Starter Kit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <main>
          <div className="py-32 text-center space-y-6">
            <h1 className="text-6xl font-bold ">Mint CryptoMedia </h1>
          </div>
          <div className="mt-8 max-w-md mx-auto">
            <MintForm />
          </div>
        </main>
        <Footer />
      </Container>
    </Fragment>
  );
}
