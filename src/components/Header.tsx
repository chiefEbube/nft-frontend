"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#7c3aed' }}>My NFTs</h1>
      <ConnectButton showBalance={false} />
    </header>
  );
}
