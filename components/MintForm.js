import { useCallback, useState, useRef } from 'react';
import { constructBidShares, constructMediaData, sha256FromBuffer, generateMetadata } from '@zoralabs/zdk';

import { useZora } from './ZoraProvider';

export function MintForm() {
  const { zora } = useZora();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(false);
  const [minted, setMinted] = useState(false);

  const nameRef = useRef();
  const descriptionRef = useRef();
  const fileRef = useRef();

  const handleFormSubmit = useCallback(
    async event => {
      event.preventDefault();
      setMinted(false);
      setErrors(false);
      setIsSubmitting(true);
      try {
        const name = nameRef.current.value;
        const description = descriptionRef.current.value;
        const file = fileRef.current.files[0];

        const { metadataHash, metadataURI } = await generateAndUploadMetadata(name, description);
        const { contentURI, contentHash } = await generateAndUploadToken(file);
        const mediaData = constructMediaData(contentURI, metadataURI, contentHash, metadataHash);
        const bidShares = constructBidShares(10, 90, 0);

        const tx = await zora.mint(mediaData, bidShares);
        const mint = await tx.wait(8);

        setMinted(mint);
      } catch (e) {
        console.log(e);
        setErrors(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [zora]
  );

  return (
    <div className="space-y-8">
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <label className="block space-y-1">
          <span>Token Name</span>
          <input type="text" className="block w-full" ref={nameRef} />
        </label>
        <label className="block space-y-1">
          <span>Token Description</span>
          <textarea className="block w-full" ref={descriptionRef} />
        </label>
        <label className="block space-y-1">
          <span>Token File</span>
          <input type="file" className="block w-full" ref={fileRef} />
        </label>
        <button
          disabled={isSubmitting}
          className="block w-full bg-blue-500 text-white leading-6 py-2 px-4 border border-transparent font-normal focus:outline-black"
          type="submit"
        >
          {isSubmitting ? 'Submitting ... ' : 'Submit'}
        </button>
        {isSubmitting && (
          <div className="bg-blue-100 border border-blue-300 p-3 text-gray-700">
            Minting.... this may take a few minutes.
          </div>
        )}
        {errors && (
          <div className="bg-red-100 border border-red-300 p-3 text-gray-700">
            An error has occurred while minting. Please check the console for more information.
          </div>
        )}
        {minted && <div className="bg-green-100 border border-green-300 p-3 text-gray-700">Minted!</div>}
      </form>
    </div>
  );
}

async function generateAndUploadMetadata(name, description) {
  const formData = new FormData();
  const metadata = {
    name,
    description,
    mimeType: 'text/plain',
    version: 'zora-20210101',
  };
  formData.append(
    'file',
    new File([JSON.stringify(metadata)], 'metadata.json', {
      type: 'text/plain',
    })
  );
  const request = await fetch('/api/upload', { method: 'POST', body: formData });
  const json = await request.json();

  const metadataURI = json.data;
  const metadataJSON = generateMetadata('zora-20210101', metadata);
  const metadataHash = sha256FromBuffer(Buffer.from(metadataJSON));

  return { metadataHash, metadataURI };
}

async function generateAndUploadToken(file) {
  const formData = new FormData();
  formData.append('file', file);
  const request = await fetch('/api/upload', { method: 'POST', body: formData });
  const json = await request.json();

  const contentURI = json.data;
  const contentHash = sha256FromBuffer(Buffer.from(contentURI));

  return { contentURI, contentHash };
}
