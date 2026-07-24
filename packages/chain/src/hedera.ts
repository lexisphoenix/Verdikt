import type { AuditMessage } from "@verdikt/shared";

export interface HederaConfig {
  accountId: string;
  privateKey: string;
  network: "testnet" | "mainnet" | "previewnet";
  topicId?: string;
}

export interface HcsPublishResult {
  transactionId: string;
  topicId: string;
  status: string;
  sequenceNumber?: number;
}

export interface PayoutResult {
  transactionId: string;
  amountTinybars: number;
  recipientAccountId: string;
  status: string;
}

export function isHederaOperatorConfigured(config: Partial<HederaConfig>): boolean {
  return Boolean(config.accountId && config.privateKey && config.network);
}

/** Requires topic ID — for HCS publish only. */
export function isHederaHcsConfigured(config: Partial<HederaConfig>): boolean {
  return isHederaOperatorConfigured(config) && Boolean(config.topicId);
}

/** @deprecated use isHederaHcsConfigured or isHederaOperatorConfigured */
export function isHederaConfigured(config: Partial<HederaConfig>): boolean {
  return isHederaHcsConfigured(config);
}

async function parseHederaPrivateKey(raw: string) {
  const { PrivateKey } = await import("@hashgraph/sdk");
  const key = raw.startsWith("0x") ? raw.slice(2) : raw;
  try {
    return PrivateKey.fromStringECDSA(key);
  } catch {
    return PrivateKey.fromStringED25519(key);
  }
}

export async function createHcsTopic(config: HederaConfig): Promise<string> {
  const { Client, TopicCreateTransaction } = await import("@hashgraph/sdk");

  const client = config.network === "mainnet"
    ? Client.forMainnet()
    : config.network === "previewnet"
      ? Client.forPreviewnet()
      : Client.forTestnet();

  client.setOperator(
    config.accountId,
    await parseHederaPrivateKey(config.privateKey)
  );

  const tx = await new TopicCreateTransaction()
    .setTopicMemo("Verdikt audit trail")
    .execute(client);

  const receipt = await tx.getReceipt(client);
  return receipt.topicId!.toString();
}

export async function publishAuditMessage(
  config: HederaConfig,
  message: AuditMessage
): Promise<HcsPublishResult> {
  if (!config.topicId) {
    throw new Error("HEDERA_HCS_TOPIC_ID required for HCS publish");
  }

  const {
    Client,
    PrivateKey,
    TopicMessageSubmitTransaction,
  } = await import("@hashgraph/sdk");

  const client = config.network === "mainnet"
    ? Client.forMainnet()
    : config.network === "previewnet"
      ? Client.forPreviewnet()
      : Client.forTestnet();

  client.setOperator(
    config.accountId,
    await parseHederaPrivateKey(config.privateKey)
  );

  const tx = await new TopicMessageSubmitTransaction()
    .setTopicId(config.topicId)
    .setMessage(JSON.stringify(message))
    .execute(client);

  const receipt = await tx.getReceipt(client);

  return {
    transactionId: tx.transactionId.toString(),
    topicId: config.topicId,
    status: receipt.status.toString(),
    sequenceNumber: receipt.topicSequenceNumber?.toNumber(),
  };
}

export async function sendHbarPayout(
  config: HederaConfig,
  recipientAccountId: string,
  amountHbar: number
): Promise<PayoutResult> {
  const { Client, PrivateKey, TransferTransaction, Hbar } = await import(
    "@hashgraph/sdk"
  );

  const client = Client.forTestnet();
  client.setOperator(
    config.accountId,
    await parseHederaPrivateKey(config.privateKey)
  );

  const amountTinybars = Math.round(amountHbar * 100_000_000);
  const tx = await new TransferTransaction()
    .addHbarTransfer(config.accountId, Hbar.fromTinybars(-amountTinybars))
    .addHbarTransfer(recipientAccountId, Hbar.fromTinybars(amountTinybars))
    .execute(client);

  const receipt = await tx.getReceipt(client);

  return {
    transactionId: tx.transactionId.toString(),
    amountTinybars,
    recipientAccountId,
    status: receipt.status.toString(),
  };
}

export function mockHcsPublish(message: AuditMessage): HcsPublishResult {
  const hash = Buffer.from(JSON.stringify(message)).toString("hex").slice(0, 16);
  return {
    transactionId: `@mock.${Date.now()}.${hash}`,
    topicId: "0.0.mock",
    status: "SUCCESS",
    sequenceNumber: Math.floor(Math.random() * 10000),
  };
}

export function mockPayout(recipientAccountId: string, amountHbar: number): PayoutResult {
  return {
    transactionId: `@mock.payout.${Date.now()}`,
    amountTinybars: Math.round(amountHbar * 100_000_000),
    recipientAccountId,
    status: "SUCCESS",
  };
}

export function hederaExplorerUrl(transactionId: string, network = "testnet"): string {
  return `https://hashscan.io/${network}/transaction/${transactionId}`;
}
