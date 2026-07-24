-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ensName" TEXT,
    "walletAddress" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "endpointUrl" TEXT,
    "agentContext" TEXT,
    "reputationScore" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "VerificationJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientAgentId" TEXT NOT NULL,
    "providerAgentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskSpec" TEXT NOT NULL,
    "rubricJson" TEXT NOT NULL,
    "deliverableUrl" TEXT,
    "deliverableText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "hcsTopicId" TEXT,
    "hcsTransactionId" TEXT,
    "hcsSequenceNumber" INTEGER,
    "taskSpecHash" TEXT,
    "deliverableHash" TEXT,
    "verdictHash" TEXT,
    "payoutTransactionId" TEXT,
    "payoutAmountHbar" REAL,
    "payoutStatus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VerificationJob_clientAgentId_fkey" FOREIGN KEY ("clientAgentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VerificationJob_providerAgentId_fkey" FOREIGN KEY ("providerAgentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Verdict" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "verificationJobId" TEXT NOT NULL,
    "pass" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "recommendedPayoutBps" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "rawJson" TEXT NOT NULL,
    "verifierSignature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Verdict_verificationJobId_fkey" FOREIGN KEY ("verificationJobId") REFERENCES "VerificationJob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_ensName_key" ON "Agent"("ensName");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_walletAddress_key" ON "Agent"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Verdict_verificationJobId_key" ON "Verdict"("verificationJobId");
