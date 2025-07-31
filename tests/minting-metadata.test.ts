import { describe, it, expect, beforeEach } from "vitest";

const mockMintContract = {
  admin: "ST1ADMIN000000000000000000000000000000000",
  lastTokenId: 0,
  tokenOwner: new Map<number, string>(),
  tokenURI: new Map<number, string>(),
  tokenBalance: new Map<string, number>(),

  isOwner(caller: string): boolean {
    return caller === this.admin;
  },

  mint(caller: string, to: string, uri: string): { value?: number; error?: number } {
    if (!this.isOwner(caller)) return { error: 100 };
    if (uri.length > 256) return { error: 103 };

    const tokenId = ++this.lastTokenId;
    this.tokenOwner.set(tokenId, to);
    this.tokenURI.set(tokenId, uri);
    const balance = this.tokenBalance.get(to) || 0;
    this.tokenBalance.set(to, balance + 1);

    return { value: tokenId };
  },

  transfer(
    caller: string,
    tokenId: number,
    sender: string,
    recipient: string
  ): { value?: boolean; error?: number } {
    const owner = this.tokenOwner.get(tokenId);
    if (!owner) return { error: 101 };
    if (owner !== sender) return { error: 102 };
    if (caller !== sender) return { error: 100 };

    this.tokenOwner.set(tokenId, recipient);
    const senderBal = this.tokenBalance.get(sender) || 1;
    this.tokenBalance.set(sender, senderBal > 0 ? senderBal - 1 : 0);
    const recipientBal = this.tokenBalance.get(recipient) || 0;
    this.tokenBalance.set(recipient, recipientBal + 1);

    return { value: true };
  },

  getBalance(who: string): { value: number } {
    return { value: this.tokenBalance.get(who) || 0 };
  },

  getOwner(tokenId: number): { value: string | null } {
    return { value: this.tokenOwner.has(tokenId) ? this.tokenOwner.get(tokenId)! : null };
  },

  getLastTokenId(): { value: number } {
    return { value: this.lastTokenId };
  },

  getTokenURI(tokenId: number): { value: string | null } {
    return { value: this.tokenURI.has(tokenId) ? this.tokenURI.get(tokenId)! : null };
  },

  transferOwnership(caller: string, newOwner: string): { value?: boolean; error?: number } {
    if (!this.isOwner(caller)) return { error: 100 };
    this.admin = newOwner;
    return { value: true };
  },
};

describe("Artefy Minting & Metadata Contract", () => {
  beforeEach(() => {
    mockMintContract.lastTokenId = 0;
    mockMintContract.tokenOwner = new Map();
    mockMintContract.tokenURI = new Map();
    mockMintContract.tokenBalance = new Map();
    mockMintContract.admin = "ST1ADMIN000000000000000000000000000000000";
  });

  it("should mint an NFT", () => {
    const result = mockMintContract.mint(
      "ST1ADMIN000000000000000000000000000000000",
      "ST1USER123456789012345678901234567890123",
      "ipfs://sample-uri"
    );
    expect(result.value).toBe(1);
    expect(mockMintContract.getOwner(1).value).toBe("ST1USER123456789012345678901234567890123");
    expect(mockMintContract.getTokenURI(1).value).toBe("ipfs://sample-uri");
  });

  it("should reject mint from non-admin", () => {
    const result = mockMintContract.mint(
      "ST1FAKE000000000000000000000000000000000",
      "ST1USER123",
      "ipfs://uri"
    );
    expect(result).toEqual({ error: 100 });
  });

  it("should transfer a token", () => {
    mockMintContract.mint("ST1ADMIN000000000000000000000000000000000", "ST1USER1", "uri");
    const result = mockMintContract.transfer("ST1USER1", 1, "ST1USER1", "ST1USER2");
    expect(result).toEqual({ value: true });
    expect(mockMintContract.getOwner(1).value).toBe("ST1USER2");
  });

  it("should prevent unauthorized transfer", () => {
    mockMintContract.mint("ST1ADMIN000000000000000000000000000000000", "ST1USER1", "uri");
    const result = mockMintContract.transfer("ST1FAKE", 1, "ST1USER1", "ST1USER2");
    expect(result).toEqual({ error: 100 });
  });

  it("should track balances correctly", () => {
    mockMintContract.mint("ST1ADMIN000000000000000000000000000000000", "ST1COLLECTOR", "uri1");
    mockMintContract.mint("ST1ADMIN000000000000000000000000000000000", "ST1COLLECTOR", "uri2");
    expect(mockMintContract.getBalance("ST1COLLECTOR").value).toBe(2);
  });

  it("should transfer contract ownership", () => {
    // Mint two tokens before transferring ownership
    mockMintContract.mint("ST1ADMIN000000000000000000000000000000000", "ST1A", "ipfs://1");
    mockMintContract.mint("ST1ADMIN000000000000000000000000000000000", "ST1B", "ipfs://2");

    const result = mockMintContract.transferOwnership(
      "ST1ADMIN000000000000000000000000000000000",
      "ST1NEWADMIN"
    );
    expect(result).toEqual({ value: true });
    expect(mockMintContract.admin).toBe("ST1NEWADMIN");

    const addResult = mockMintContract.mint("ST1NEWADMIN", "ST1ANOTHER", "ipfs://uri");
    expect(addResult.value).toBe(3); // TokenId should increment
    expect(mockMintContract.getOwner(3).value).toBe("ST1ANOTHER");
  });
});
