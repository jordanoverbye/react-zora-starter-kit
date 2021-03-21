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
      <Link href="/">
        <a className="inline-block text-2xl font-semibold">zOrbs</a>
      </Link>
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
        Built by Jordan Overbye for Eth Global NFT Hack 2021.{' '}
        <a
          className="underline"
          href="https://github.com/jordanoverbye/react-zora-starter-kit"
          target="_blank"
          rel="noreferrer"
        >
          View Source
        </a>
      </p>
    </footer>
  );
}
