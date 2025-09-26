"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { toast } from "sonner";
import axios from "axios";
import { CONTRACT_ADDRESS, CONTRACT_ABI, INITIAL_OWNER } from "@/lib/contract";

export default function MintNft() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [isMinting, setIsMinting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });

  // Check if connected user is the contract owner
  const contractOwner = INITIAL_OWNER;
  const isOwner = address && address.toLowerCase() === contractOwner.toLowerCase();

  console.log("Contract owner data:", { contractOwner, isOwner, userAddress: address });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return `ipfs://${response.data.IpfsHash}`;
  };

  const uploadMetadataToIPFS = async (metadata: {
    name: string;
    description: string;
    image: string;
    attributes: unknown[];
  }): Promise<string> => {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      }
    );

    return `ipfs://${response.data.IpfsHash}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.image) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsMinting(true);
    toast.loading("Minting in progress...");

    try {
      // Step 1: Upload image to IPFS
      const imageUrl = await uploadToIPFS(formData.image);

      // Step 2: Create metadata JSON
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        attributes: [],
      };

      // Step 3: Upload metadata to IPFS
      const tokenURI = await uploadMetadataToIPFS(metadata);

      // Step 4: Mint the NFT
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "safeMint",
        args: [address, tokenURI],
      });

      toast.success("NFT minted successfully!");
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        image: null,
      });
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Error minting NFT. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  const cardStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500'
  };

  if (!address) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Mint NFT</h2>
        <p style={{ color: '#6b7280' }}>Connect your wallet to mint NFTs</p>
      </div>
    );
  }

  return (
    <div>
      {/* Contract Owner Display */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Contract Information</h2>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Contract Owner:</strong> 
          <span style={{ 
            fontFamily: 'monospace', 
            backgroundColor: '#f3f4f6', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '0.25rem',
            marginLeft: '0.5rem',
            fontSize: '0.875rem'
          }}>
            {contractOwner.slice(0, 6)}...{contractOwner.slice(-4)}
          </span>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Your Address:</strong> 
          <span style={{ 
            fontFamily: 'monospace', 
            backgroundColor: '#f3f4f6', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '0.25rem',
            marginLeft: '0.5rem',
            fontSize: '0.875rem'
          }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <div style={{ 
          padding: '0.75rem', 
          borderRadius: '0.375rem', 
          backgroundColor: isOwner ? '#dcfce7' : '#fef2f2',
          border: `1px solid ${isOwner ? '#16a34a' : '#dc2626'}`
        }}>
          <strong style={{ color: isOwner ? '#16a34a' : '#dc2626' }}>
            {isOwner ? '✅ You are the contract owner' : '❌ You are not the contract owner'}
          </strong>
        </div>
      </div>

      {/* Mint Form */}
      {isOwner ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Mint New NFT</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Create a new NFT as the contract owner</p>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>NFT Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter NFT name"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter NFT description"
                required
                style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={inputStyle}
              />
            </div>

            <button type="submit" disabled={isMinting} style={buttonStyle}>
              {isMinting ? "Minting..." : "Mint NFT"}
            </button>
          </form>
        </div>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Mint NFT</h2>
          <p style={{ color: '#6b7280' }}>Only the contract owner can mint NFTs</p>
        </div>
      )}
    </div>
  );
}