"use client";

import Header from "@/components/Header";
import MintNft from "@/components/MintNft";
import NftGallery from "@/components/NftGallery";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main style={{ padding: '2rem 0' }}>
      <Header />
      <MintNft />
      <NftGallery />
      <Toaster position="top-right" />
    </main>
  );
}

