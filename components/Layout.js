import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useZora } from './ZoraProvider';

export function Container({ children }) {
  return <div className="container mx-auto px-4" children={children} />;
}

export function Header() {
  const [loading, setLoading] = useState(false);
  const { address, authenticate } = useZora();

  const handleConnectClick = useCallback(async () => {
    setLoading(true);
    try {
      await authenticate();
    } catch (e) {
      // TODO handle errors
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [authenticate]);

  return (
    <header className="pt-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <Link href="/">
          <a className="text-3xl font-semibold">zOrbs</a>
        </Link>
        <span className="inline-block py-1 px-2 text-gray-400 text-xs border border-gray-200 rounded-lg">
          {process.env.NEXT_PUBLIC_ETH_NETWORK}
        </span>
      </div>
      {address ? (
        <div className="flex space-x-3">
          {address === process.env.NEXT_PUBLIC_CREATOR_ADDRESS && (
            <Link href="/mint">
              <a className="bg-blue-500 text-white leading-6 py-2 px-4 border border-transparent font-normal focus:outline-black rounded-xl">
                Mint
              </a>
            </Link>
          )}
          <span className="bg-gray-100 text-gray-500 leading-6 py-2 px-4 border border-transparent rounded-xl font-semibold">
            {address.substr(0, 5)}...{address.slice(address.length - 5)}
          </span>
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white leading-6 py-2 px-4 border border-transparent font-normal focus:outline-black rounded-xl"
          onClick={handleConnectClick}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 pb-8 text-center">
      <p className="text-gray-400">
        Built by Jordan Overbye for the 2021 Eth Global NFT Hackathon.{' '}
        <a
          className="underline"
          href="https://github.com/jordanoverbye/react-zora-starter-kit"
          target="_blank"
          rel="noreferrer"
        >
          View Source &#x2197;
        </a>
      </p>
    </footer>
  );
}
