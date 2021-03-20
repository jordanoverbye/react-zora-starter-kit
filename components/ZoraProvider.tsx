import { createContext, useState, useEffect, useContext } from "react";
import { Zora } from "@zoralabs/zdk";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

const NETWORK_URL = "";
const NETWORK_CHAIN_ID = 4;

const provider = new JsonRpcProvider(NETWORK_URL, NETWORK_CHAIN_ID);
const defaultZora = new Zora(provider, NETWORK_CHAIN_ID);

const ZoraContext = createContext(defaultZora);

export const useZora = () => useContext(ZoraContext);

export function ZoraProvider({ children }: any) {
  const { library, chainId } = useWeb3React();
  const [zora, setZora] = useState<Zora>(defaultZora);

  useEffect(() => {
    if (library) {
      const signer = library.getSigner();
      setZora(new Zora(signer, chainId));
    }
  }, [library, chainId]);

  return <ZoraContext.Provider value={zora} children={children} />;
}
