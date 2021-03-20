import Link from "next/link";

import Account from "./Account";
import useEagerConnect from "../hooks/useEagerConnect";

export function Header() {
  const triedToEagerConnect = useEagerConnect();
  return (
    <header className="py-4 flex justify-between border-b-2">
      <Link href="/">
        <a>Zora + NextJS Starter Kit</a>
      </Link>
      <Account triedToEagerConnect={triedToEagerConnect} />
    </header>
  );
}
