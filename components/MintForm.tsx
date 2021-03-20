import { useCallback, useState } from 'react';
import { constructBidShares, constructMediaData, sha256FromBuffer, generateMetadata } from '@zoralabs/zdk';

import { useZora, ZoraProvider } from './ZoraProvider';

export default function MintForm() {
  return (
    <ZoraProvider>
      <Form />
    </ZoraProvider>
  );
}

function Form() {
  const zora = useZora();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(false);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        // @ts-ignore
        const name = event.target.elements.name.value;
        // @ts-ignore
        const description = event.target.elements.description.value;
        // @ts-ignore
        const file = event.target.elements.file.files[0];

        const { metadataHash, metadataURI } = await generateAndUploadMetadata(name, description);

        const { contentURI, contentHash } = await generateAndUploadToken(file);

        const mediaData = constructMediaData(contentURI, metadataURI, contentHash, metadataHash);

        const bidShares = constructBidShares(
          10, // creator share
          90, // owner share
          0 // prevOwner share
        );

        const tx = await zora.mint(mediaData, bidShares);
        const txResult = await tx.wait(8);

        console.log('done');
      } catch (e) {
        console.log('e', e);
        setErrors(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [zora]
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {errors && <div>Error!</div>}
      {isSubmitting && <div>Submitting!</div>}
      {zora && zora.readOnly ? (
        <p>Read Only!!!</p>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <label className="block">
            <span className="text-gray-700">Token Name</span>
            <input name="name" type="text" className="mt-1 block w-full" />
          </label>
          <label className="block">
            <span className="text-gray-700">Token Description</span>
            <input name="description" type="text" className="mt-1 block w-full" />
          </label>
          <label className="block">
            <span className="text-gray-700">Token File</span>
            <input type="file" name="file" className="mt-1 block w-full" />
          </label>
          <button
            className="w-full sm:w-auto flex-none bg-gray-50 text-gray-400 hover:text-gray-900 font-mono leading-6 py-3 sm:px-6 border border-gray-200 rounded-xl flex items-center justify-center space-x-2 sm:space-x-4 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 focus:outline-none transition-colors duration-200"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

async function generateAndUploadMetadata(name: string, description: string) {
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
  const request = await fetch('api/upload', { method: 'POST', body: formData });
  const json = await request.json();

  const metadataURI = json.data;
  const metadataJSON = generateMetadata('zora-20210101', metadata);
  const metadataHash = sha256FromBuffer(Buffer.from(metadataURI));

  return { metadataHash, metadataURI };
}

async function generateAndUploadToken(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const request = await fetch('api/upload', { method: 'POST', body: formData });
  const json = await request.json();

  const contentURI = json.data;
  const contentHash = sha256FromBuffer(Buffer.from(contentURI));

  return { contentURI, contentHash };
}
