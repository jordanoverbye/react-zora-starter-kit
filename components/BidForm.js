import { useCallback, useState, useRef } from 'react';

// import { useZora } from './ZoraProvider';

export function BidForm({ id }) {
  // const { zora } = useZora();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(false);

  const amountRef = useRef();
  const sellOnShareRef = useRef();

  const handleFormSubmit = useCallback(async event => {
    event.preventDefault();
    setErrors(false);
    setIsSubmitting(true);
    try {
      // TODO

      // const currency = '0x0000000000000000000000000000000000000000'; // ETH;
      // const amount = amountRef.current.value;
      // const sellOnShare = sellOnShareRef.current.value;

      // // grant approval
      // const approval = await approveERC20(provider, currency, address, MaxUint256);

      // const bid = constructBid(
      //   currency, // currency
      //   Decimal.new(10).value, // amount 10*10^18
      //   address, // bidder address
      //   address, // recipient address (address to receive Media if bid is accepted)
      //   10 // sellOnShare
      // );

      // const tx = await zora.setBid(id, bid);
      // await tx.wait(8); // 8 confirmations to finalize

      setErrors(false);
    } catch (e) {
      console.log(e);
      setErrors(true);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="space-y-8">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <label className="block space-y-1">
          <span>Amount (ETH)</span>
          <input type="number" className="block w-full" ref={amountRef} />
        </label>
        <label className="block space-y-1">
          <span>Sell-on share</span>
          <input
            placeholder="One-time fee current owner will earn from next sale"
            type="number"
            className="block w-full"
            ref={sellOnShareRef}
          />
        </label>
        <button
          disabled={isSubmitting}
          className="block w-full bg-blue-500 text-white leading-6 py-2 px-4 border border-transparent font-normal focus:outline-black"
          type="submit"
        >
          {isSubmitting ? 'Placing Bid ... ' : 'Place Bid'}
        </button>
        {isSubmitting && (
          <div className="bg-blue-100 border border-blue-300 p-3 text-gray-700">Bidding... Please wait.</div>
        )}
        {errors && (
          <div className="bg-red-100 border border-red-300 p-3 text-gray-700">
            An error has occurred while bidding. Please check the console for more information.
          </div>
        )}
      </form>
    </div>
  );
}
