import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';

import '../styles/globals.css';

function getWeb3Library(provider) {
  return new Web3Provider(provider);
}

export default function App({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}
