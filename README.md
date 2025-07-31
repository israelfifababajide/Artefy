# Artefy

A decentralized protocol for authenticating, trading, and tracing the full lifecycle of physical and digital artworks using NFTs. Designed to ensure transparent provenance, enforce resale royalties, and empower creators and collectors.

---

## **Overview**

Artefy consists of **eight Clarity smart contracts**, each dedicated to a core function in the art and collectibles ecosystem:

1. **Minting & Metadata Contract** – NFT creation and metadata linking  
2. **Provenance Contract** – Tracks artwork ownership and exhibition history  
3. **Royalties Engine** – Automates royalty distribution on primary and secondary sales  
4. **Curated Marketplace Contract** – Facilitates secure sales and auctions  
5. **Physical Art Linkage Contract** – Links NFTs to verified physical pieces via oracles  
6. **Verification & Appraisal Contract** – Handles expert validation and dynamic valuation  
7. **Collector Identity Contract** – Reputation and verification for collectors and curators  
8. **Dispute Resolution Contract** – Resolves ownership/authenticity conflicts via token-voting arbitration

---

## **Features**

- On-chain artwork provenance tracking  
- Transparent, enforceable resale royalties  
- NFT issuance for both physical and digital art  
- Expert-driven validation of artworks  
- Curated marketplace with reputation scoring  
- Physical-to-digital linkage via tamper-proof proofs  
- Decentralized arbitration for disputes  
- Modular smart contract system for scalability

---

## **Smart Contracts**

### **Minting & Metadata Contract**

- Mint new artwork NFTs  
- Attach metadata via off-chain storage (IPFS, Gaia, etc.)  
- Handle editions and uniqueness

### **Provenance Contract**

- Record each change in ownership  
- Link exhibition history and gallery transfers  
- Timeline querying for authenticity checks

### **Royalties Engine**

- Define royalty splits per artwork  
- Automate payout to original artists on resale  
- Enforceable at marketplace-level

### **Curated Marketplace Contract**

- Listing and bidding mechanisms  
- Time-limited and reserve auctions  
- Sale finalization with royalty enforcement

### **Physical Art Linkage Contract**

- Store verifiable linkage hashes (e.g., NFC tags, QR, etc.)  
- Interface with trusted physical authentication oracles  
- Mark NFTs as “verified physical match”

### **Verification & Appraisal Contract**

- Register verified art experts  
- Enable appraisal scoring and signature  
- Dynamic valuation history tracking

### **Collector Identity Contract**

- Maintain collector reputation via verifiable ownership  
- Prevent Sybil attacks with identity staking  
- Display gallery and transaction history

### **Dispute Resolution Contract**

- Initiate disputes over ownership or authenticity  
- Community or expert-panel voting  
- Stakes slashed for malicious actors

---

## **Installation**

1. Install Clarinet CLI  
2. Clone this repository  
3. Run tests: `npm test`  
4. Deploy contracts: `clarinet deploy`

---

## **Usage**

Each smart contract is modular and may be deployed independently. Together, they provide a complete infrastructure for a decentralized art and collectibles ecosystem. Refer to each contract's documentation folder for more details on inputs, outputs, and permission models.

---

## **Testing**

Tests are written using Vitest and can be run with:

```bash
npm test
```

## **License**

MIT License