# MyNFT dApp Frontend

A complete Next.js frontend for the MyNFT smart contract deployed on Base Mainnet. This dApp allows users to connect their wallet, view their NFTs, transfer them, and provides a special interface for the contract owner to mint new NFTs.

## 🚀 What is this dApp?

This is a **decentralized application (dApp)** that interacts with a smart contract on the blockchain. Think of it as a website that can talk directly to the blockchain without needing a middleman.

### Key Features:
- **Wallet Connection**: Connect using RainbowKit with support for multiple wallets
- **Owner-Only Minting**: Only the contract owner can mint new NFTs
- **IPFS Integration**: Images and metadata are stored on IPFS using Pinata
- **NFT Gallery**: View all NFTs owned by the connected user
- **Transfer Functionality**: Transfer NFTs to other addresses
- **Responsive Design**: Beautiful UI built with vanilla CSS

## 🎯 How Does It Work? (Beginner's Guide)

### 1. **Smart Contract Basics**
- A **smart contract** is like a digital agreement that runs automatically on the blockchain
- Our contract is deployed at: `0x0F193B9Fb0728aF9f693AB41665B0fDf0a89fe3E`
- It follows the **ERC-721 standard** (the standard for NFTs)
- It has an **owner** (the person who deployed it) who has special privileges

### 2. **The Owner System**
```
Contract Owner = The person who deployed the contract
├── Can mint new NFTs ✅
├── Can transfer ownership to someone else
└── Has special privileges that regular users don't have

Regular Users = Anyone who connects their wallet
├── Can view their own NFTs ✅
├── Can transfer their NFTs to others ✅
└── Cannot mint new NFTs ❌
```

### 3. **How Minting Works**
When the contract owner wants to create a new NFT:

1. **Upload Image**: The image file is uploaded to IPFS (InterPlanetary File System)
   - IPFS is like a decentralized storage system
   - It gives back a unique link (like `ipfs://QmABC123...`)

2. **Create Metadata**: A JSON file is created with:
   ```json
   {
     "name": "My Cool NFT",
     "description": "This is an awesome NFT",
     "image": "ipfs://QmABC123..."
   }
   ```

3. **Upload Metadata**: The JSON file is also uploaded to IPFS

4. **Mint on Blockchain**: The smart contract's `safeMint` function is called with:
   - `to`: The owner's wallet address
   - `uri`: The IPFS link to the metadata

### 4. **How Viewing NFTs Works**
When you want to see your NFTs:

1. **Check Balance**: Ask the contract "How many NFTs does this wallet own?"
2. **Get Token IDs**: For each NFT you own, get its unique ID number
3. **Get Metadata**: For each token ID, get its metadata URI from IPFS
4. **Fetch Details**: Download the JSON metadata and image from IPFS
5. **Display**: Show the image, name, and description in a nice gallery

### 5. **How Transferring Works**
When you want to send an NFT to someone:

1. **Choose NFT**: Select which NFT you want to transfer
2. **Enter Address**: Type the recipient's wallet address
3. **Call Contract**: The `safeTransferFrom` function moves the NFT
4. **Update Gallery**: Refresh to show the updated NFT list

## 🔧 Technical Architecture

### Frontend (This App)
- **Next.js**: React framework for building web applications
- **Wagmi**: Library for interacting with Ethereum blockchain
- **RainbowKit**: Beautiful wallet connection interface
- **IPFS**: Decentralized storage for images and metadata

### Backend (Smart Contract)
- **Solidity**: Programming language for smart contracts
- **OpenZeppelin**: Library with secure, tested contract templates
- **ERC-721**: Standard for non-fungible tokens (NFTs)

### Data Flow
```
User Action → Frontend → Wagmi → Blockchain → Smart Contract
     ↓
IPFS Storage ← Metadata ← Image Upload ← File Selection
```

## 📋 Contract Information

- **Contract Address**: `0x0F193B9Fb0728aF9f693AB41665B0fDf0a89fe3E`
- **Network**: Base Mainnet
- **Contract Type**: ERC-721 NFT with OpenZeppelin standards

## 🛠️ Setup Instructions

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

## 🎮 How to Use the dApp

### For Contract Owner:
1. **Connect Wallet**: Click "Connect Wallet" and select your wallet
2. **Verify Ownership**: You should see "✅ You are the contract owner"
3. **Mint NFT**: Fill out the form with name, description, and image
4. **Submit**: Click "Mint NFT" and confirm the transaction
5. **View**: Your new NFT will appear in the gallery

### For Regular Users:
1. **Connect Wallet**: Click "Connect Wallet" and select your wallet
2. **View NFTs**: See all NFTs you own in the gallery
3. **Transfer**: Click "Transfer" on any NFT to send it to someone else
4. **Enter Address**: Type the recipient's wallet address
5. **Confirm**: Click "Confirm Transfer" and approve the transaction

## 🔍 Understanding the Code

### Key Components:

1. **Header.tsx**: Shows the app title and wallet connection button
2. **MintNft.tsx**: Handles NFT creation (owner only)
3. **NftGallery.tsx**: Displays and manages user's NFTs
4. **contract.ts**: Contains the smart contract address and ABI

### Key Functions:

- `useAccount()`: Gets the connected wallet address
- `useReadContract()`: Reads data from the smart contract
- `useWriteContract()`: Writes data to the smart contract
- `useReadContracts()`: Reads multiple contract calls at once

## 🚨 Troubleshooting

### WalletConnect Error
If you see a 403 error for WalletConnect, make sure you've set up your Project ID correctly in the environment variables.

### IPFS Upload Issues
Ensure your Pinata JWT token has the correct permissions for pinning files and JSON.

### Contract Interaction Errors
Make sure you're connected to Base Mainnet and have some ETH for gas fees.

### "Loading..." Forever
This usually means:
- The contract address is incorrect
- You're on the wrong network (should be Base Mainnet)
- The contract doesn't exist at that address

## 📚 Learning Resources

- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Wagmi Documentation](https://wagmi.sh/)
- [IPFS Documentation](https://docs.ipfs.tech/)

## 📄 License

MIT License