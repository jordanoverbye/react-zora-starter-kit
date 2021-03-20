import Link from 'next/link';

import Account from './Account';
import useEagerConnect from '../hooks/useEagerConnect';

export function Container({ children }: React.PropsWithChildren<{}>) {
  return <div className="container mx-auto px-4">{children}</div>;
}

export function Header() {
  const triedToEagerConnect = useEagerConnect();
  return (
    <header className="py-4 flex justify-between border-b-2">
      <Link href="/">
        <a>Zora + Next.js Starter Kit</a>
      </Link>
      <Account triedToEagerConnect={triedToEagerConnect} />
    </header>
  );
}

export function Footer() {
  return (
    <footer className="py-4 mt-32 border-t-2">
      <a href="https://github.com/jordanoverbye/react-zora-starter-kit" target="_blank">
        Github
      </a>
    </footer>
  );
}
