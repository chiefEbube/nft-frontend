# MyNFT dApp Frontend

A complete Next.js frontend for the MyNFT smart contract deployed on Base Mainnet.

## Features

- **Wallet Connection**: Connect using RainbowKit with support for multiple wallets
- **Owner-Only Minting**: Only the contract owner can mint new NFTs
- **IPFS Integration**: Images and metadata are stored on IPFS using Pinata
- **NFT Gallery**: View all NFTs owned by the connected user
- **Transfer Functionality**: Transfer NFTs to other addresses
- **Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui

## Contract Information

- **Contract Address**: `0x0F193B9Fb0728aF9f693AB41665B0fDf0a89fe3E`
- **Network**: Base Mainnet
- **Contract Type**: ERC-721 NFT with OpenZeppelin standards

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# WalletConnect Project ID
# Get your project ID from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Pinata API Keys for IPFS
# Get your API keys from https://pinata.cloud/
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_here
```

### 2. Get WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create an account and sign in
3. Create a new project
4. Copy your Project ID
5. Add it to your `.env.local` file

### 3. Get Pinata API Key

1. Go to [Pinata](https://pinata.cloud/)
2. Create an account and sign in
3. Go to API Keys section
4. Create a new API key with pinning permissions
5. Copy the JWT token
6. Add it to your `.env.local` file

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## How It Works

### Minting Process

1. **Owner Check**: Only the contract owner can access the minting form
2. **Image Upload**: The selected image is uploaded to IPFS via Pinata
3. **Metadata Creation**: A JSON metadata file is created with name, description, and IPFS image URL
4. **Metadata Upload**: The metadata JSON is uploaded to IPFS
5. **Smart Contract Call**: The `safeMint` function is called with the metadata IPFS URL

### NFT Display

1. **Balance Check**: Fetches the user's NFT balance using `balanceOf`
2. **Token ID Retrieval**: Gets all token IDs owned by the user
3. **Metadata Fetching**: Retrieves token URIs and fetches metadata from IPFS
4. **Rendering**: Displays NFTs in a responsive grid layout

### Transfer Process

1. **Dialog Interface**: Click "Transfer" button opens a dialog
2. **Address Input**: Enter recipient's wallet address
3. **Smart Contract Call**: Calls `safeTransferFrom` function
4. **Confirmation**: Shows success/error notifications

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Header.tsx          # App header with wallet connection
│   ├── MintNft.tsx        # Owner-only minting component
│   └── NftGallery.tsx     # NFT display and transfer component
└── lib/
    └── contract.ts         # Contract ABI and address
```

## Technologies Used

- **Next.js 15**: React framework with App Router
- **Wagmi**: Ethereum library for React
- **RainbowKit**: Wallet connection UI
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful UI components
- **Sonner**: Toast notifications
- **Axios**: HTTP client for IPFS uploads
- **Pinata**: IPFS pinning service

## Smart Contract Functions Used

- `owner()`: Get contract owner address
- `balanceOf(address)`: Get NFT balance for an address
- `tokenOfOwnerByIndex(address, index)`: Get token ID by index
- `tokenURI(tokenId)`: Get metadata URI for a token
- `safeMint(to, uri)`: Mint new NFT (owner only)
- `safeTransferFrom(from, to, tokenId)`: Transfer NFT

## Troubleshooting

### WalletConnect Error
If you see a 403 error for WalletConnect, make sure you've set up your Project ID correctly in the environment variables.

### IPFS Upload Issues
Ensure your Pinata JWT token has the correct permissions for pinning files and JSON.

### Contract Interaction Errors
Make sure you're connected to Base Mainnet and have some ETH for gas fees.

## License

MIT License