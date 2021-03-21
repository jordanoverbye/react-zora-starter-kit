import { ZoraProvider } from '../components/ZoraProvider';

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <ZoraProvider>
      <Component {...pageProps} />
    </ZoraProvider>
  );
}
