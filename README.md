# Zora + React Starter Kit

A simple starter kit for building Non-Fungible Token (NFT) marketplaces on the [Zora](https://zora.engineering)
protocol using [Next.js](https://nextjs.org), [The Graph](https://thegraph.com) and [Tailwind](https://tailwindcss.com).

A live demo has been deployed to Vercel, and can viewed [here](https://react-zora-starter-kit.vercel.app/).

## Getting Started

1. Clone the repository

```sh
git clone https://github.com/jordanoverbye/react-zora-starter-kit
```

2. Install dependencies

```sh
cd react-zora-starter-kit
yarn install # or npm install
```

3. Setup environment variables

```sh
cp .env.sample .env
```

Now go into `.env` and set your variables. Please note: This starter-kit uses Cloudinary for uploading files, but this could be swapped out for any file hosting provider, such as IPFS.

4. Start the development server

```
yarn dev # or npm run dev
```

## Disclaimer

This was built during the 2021 Eth Global NFT Hackathon. I am totally new to Web3/Eth development so some features are not working as expected, and parts of the code could definitely be improved.

PRs are welcome ❤️
