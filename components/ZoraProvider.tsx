import { createContext, useState, useEffect, useContext } from 'react';
import { Zora } from '@zoralabs/zdk';
import { useWeb3React } from '@web3-react/core';

const ZoraContext = createContext<Zora | undefined>(undefined);

export const useZora = () => useContext(ZoraContext);

export function ZoraProvider({ children }: any) {
  const { library, chainId } = useWeb3React();
  const [zora, setZora] = useState<Zora | undefined>();

  useEffect(() => {
    if (typeof window !== 'undefined' && library && chainId) {
      const signer = library.getSigner();
      try {
        const zoraInstance = new Zora(signer, chainId);
        setZora(zoraInstance);
      } catch {
        console.log('Error initializing Zora');
      }
    }
  }, [library, chainId]);

  return <ZoraContext.Provider value={zora} children={children} />;
}
