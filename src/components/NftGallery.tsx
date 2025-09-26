"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { toast } from "sonner";
import axios from "axios";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

interface NFT {
  tokenId: bigint;
  metadata: NFTMetadata;
}

export default function NftGallery() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | null>(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // Get user's NFT balance
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Fetch token IDs for the user
  const tokenIdContracts: any[] = [];
  if (balance && balance > 0n) {
    for (let i = 0; i < Number(balance); i++) {
      tokenIdContracts.push({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "tokenOfOwnerByIndex",
        args: [address!, BigInt(i)],
      });
    }
  }

  const { data: tokenIds } = useReadContracts({
    contracts: tokenIdContracts,
  });

  // Fetch token URIs for all owned tokens
  const tokenURIContracts: any[] = [];
  if (tokenIds) {
    tokenIds.forEach((result) => {
      if (result.status === "success" && result.result) {
        tokenURIContracts.push({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "tokenURI",
          args: [result.result as bigint],
        });
      }
    });
  }

  const { data: tokenURIs } = useReadContracts({
    contracts: tokenURIContracts,
  });

  // Fetch metadata for each NFT
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenURIs || !tokenIds) return;

      setLoading(true);
      const nftData: NFT[] = [];

      for (let i = 0; i < tokenURIs.length; i++) {
        const uriResult = tokenURIs[i];
        const tokenIdResult = tokenIds[i];

        if (uriResult.status === "success" && tokenIdResult.status === "success") {
          try {
            const tokenURI = uriResult.result as string;
            const tokenId = tokenIdResult.result as bigint;

            // Convert IPFS URL to gateway URL
            const gatewayUrl = tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
            
            const response = await axios.get(gatewayUrl);
            const metadata: NFTMetadata = response.data;

            nftData.push({
              tokenId,
              metadata,
            });
          } catch (error) {
            console.error(`Error fetching metadata for token ${i}:`, error);
          }
        }
      }

      setNfts(nftData);
      setLoading(false);
    };

    fetchMetadata();
  }, [tokenURIs, tokenIds]);

  const handleTransfer = async () => {
    if (!selectedTokenId || !recipientAddress || !address) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsTransferring(true);
    toast.loading("Transferring NFT...");

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "safeTransferFrom",
        args: [address as `0x${string}`, recipientAddress as `0x${string}`, selectedTokenId],
      });

      toast.success("NFT transferred successfully!");
      setTransferDialogOpen(false);
      setRecipientAddress("");
      setSelectedTokenId(null);
      
      // Refresh the NFT list
      window.location.reload();
    } catch (error) {
      console.error("Error transferring NFT:", error);
      toast.error("Error transferring NFT. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  const openTransferDialog = (tokenId: bigint) => {
    setSelectedTokenId(tokenId);
    setTransferDialogOpen(true);
  };

  const cardStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1rem',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  };

  if (!address) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your NFTs</h2>
        <p style={{ color: '#6b7280' }}>Please connect your wallet to see your NFTs</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your NFTs</h2>
        <p style={{ color: '#6b7280' }}>Loading your NFTs...</p>
      </div>
    );
  }

  if (!balance || balance === 0n) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your NFTs</h2>
        <p style={{ color: '#6b7280' }}>You don't own any NFTs yet</p>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your NFTs</h2>
        <p style={{ color: '#6b7280' }}>You own {Number(balance)} NFT{Number(balance) !== 1 ? 's' : ''}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {nfts.map((nft) => (
          <div key={nft.tokenId.toString()} style={cardStyle}>
            <div style={{ aspectRatio: '1', overflow: 'hidden', marginBottom: '1rem' }}>
              <img
                src={nft.metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")}
                alt={nft.metadata.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{nft.metadata.name}</h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{nft.metadata.description}</p>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Token ID: {nft.tokenId.toString()}
            </div>
            
            <button 
              style={buttonStyle}
              onClick={() => openTransferDialog(nft.tokenId)}
            >
              Transfer
            </button>
          </div>
        ))}
      </div>

      {/* Transfer Dialog */}
      {transferDialogOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Transfer NFT</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Transfer NFT to another address
            </p>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Recipient Address</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                required
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setTransferDialogOpen(false)}
                style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleTransfer} 
                disabled={isTransferring}
                style={buttonStyle}
              >
                {isTransferring ? "Transferring..." : "Confirm Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}