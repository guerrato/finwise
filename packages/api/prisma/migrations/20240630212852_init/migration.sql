-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'MANAGER', 'VIEWER');

-- CreateEnum
CREATE TYPE "InflowType" AS ENUM ('SALARY', 'BONUS', 'REIMBURSEMENT', 'REVENUE', 'OTHER');

-- CreateEnum
CREATE TYPE "InflowStatus" AS ENUM ('PENDING', 'RECEIVED');

-- CreateEnum
CREATE TYPE "OutflowProcessStatus" AS ENUM ('PENDING', 'PROCESSED', 'ERROR');

-- CreateEnum
CREATE TYPE "OutflowPaymentStatus" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'MONEY', 'PIX', 'TED', 'DOC', 'BOLETO', 'TRANSFER', 'DEPOSIT');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "CardNetwork" AS ENUM ('VISA', 'MASTERCARD', 'ELO', 'AMERICAN_EXPRESS', 'HIPERCARD', 'DINERS_CLUB', 'DISCOVER', 'JCB', 'AURA', 'SODEXO', 'ALELO', 'TICKET', 'VR');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('AFN', 'ALL', 'DZD', 'USD', 'EUR', 'AOA', 'XCD', 'ARS', 'AMD', 'AWG', 'AUD', 'AZN', 'BSD', 'BHD', 'BDT', 'BBD', 'BYN', 'BZD', 'XOF', 'BMD', 'BTN', 'INR', 'BOB', 'BOV', 'BAM', 'BWP', 'NOK', 'BRL', 'BND', 'BGN', 'BIF', 'CVE', 'KHR', 'XAF', 'CAD', 'KYD', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'KMF', 'CDF', 'NZD', 'CRC', 'CUC', 'CUP', 'ANG', 'CZK', 'DKK', 'DJF', 'DOP', 'EGP', 'SVC', 'ERN', 'ETB', 'FKP', 'FJD', 'XPF', 'GMD', 'GEL', 'GHS', 'GIP', 'GTQ', 'GBP', 'GNF', 'GYD', 'HTG', 'HNL', 'HKD', 'HUF', 'ISK', 'IDR', 'XDR', 'IRR', 'IQD', 'ILS', 'JMD', 'JPY', 'JOD', 'KZT', 'KES', 'KPW', 'KRW', 'KWD', 'KGS', 'LAK', 'LBP', 'LSL', 'ZAR', 'LRD', 'LYD', 'CHF', 'MOP', 'MGA', 'MWK', 'MYR', 'MVR', 'MRU', 'MUR', 'XUA', 'MXN', 'MXV', 'MDL', 'MNT', 'MAD', 'MZN', 'MMK', 'NAD', 'NPR', 'NIO', 'NGN', 'OMR', 'PKR', 'PAB', 'PGK', 'PYG', 'PEN', 'PHP', 'PLN', 'QAR', 'MKD', 'RON', 'RUB', 'RWF', 'SHP', 'WST', 'STN', 'SAR', 'RSD', 'SCR', 'SLE', 'SGD', 'XSU', 'SBD', 'SOS', 'SSP', 'LKR', 'SDG', 'SRD', 'SZL', 'SEK', 'CHE', 'CHW', 'SYP', 'TWD', 'TJS', 'TZS', 'THB', 'TOP', 'TTD', 'TND', 'TRY', 'TMT', 'UGX', 'UAH', 'AED', 'USN', 'UYI', 'UYU', 'UZS', 'VUV', 'VEF', 'VED', 'VND', 'YER', 'ZMW', 'ZWL');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userAccountRoles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userAccountRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accountId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inflows" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "type" "InflowType" NOT NULL,
    "accountId" TEXT NOT NULL,
    "destinationBankId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outflows" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "cfe12741Tax" TEXT,
    "cfeNumber" TEXT,
    "cofinsStTotal" TEXT,
    "cofinsTotal" TEXT,
    "icmsTotal" TEXT,
    "pisStTotal" TEXT,
    "pisTotal" TEXT,
    "receiptNumber" TEXT,
    "paymentStatus" "OutflowPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "processStatus" "OutflowProcessStatus" NOT NULL DEFAULT 'PENDING',
    "accountId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outflowPaymentDetails" (
    "id" UUID NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "cardId" UUID,
    "bankId" UUID,
    "outflowId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outflowPaymentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outflowItems" (
    "id" UUID NOT NULL,
    "addicionalInfo" TEXT,
    "calculusRule" TEXT,
    "cfop" TEXT,
    "cofinsAliquotPercentage" TEXT,
    "cofinsBasePrice" TEXT,
    "cofinsCode" TEXT,
    "cofinsIncentive" TEXT,
    "cofinsPrice" TEXT,
    "commentToRevenue" TEXT,
    "description" TEXT,
    "discountValue" TEXT,
    "grossValue" TEXT,
    "gtin" TEXT,
    "icmsTaxCode" TEXT,
    "ncm" TEXT,
    "netValueIcmsTax" TEXT,
    "number" INTEGER,
    "pisAliquotPercentage" TEXT,
    "pisBasePrice" TEXT,
    "pisCode" TEXT,
    "pisPrice" TEXT,
    "price12741" TEXT,
    "productOriginCode" TEXT,
    "quantity" TEXT,
    "sellerInternalCode" TEXT,
    "unitOfMeasurement" TEXT,
    "unitaryValue" TEXT,
    "outflowId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outflowItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outflowInstallments" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "outflowId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outflowInstallments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outflowSellers" (
    "id" UUID NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "cnpj" TEXT,
    "companyName" TEXT,
    "fantasyName" TEXT NOT NULL,
    "ie" TEXT,
    "im" TEXT,
    "neighborhood" TEXT,
    "stateCode" TEXT,
    "zipCode" TEXT,
    "outflowId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outflowSellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CardType" NOT NULL,
    "description" TEXT,
    "network" "CardNetwork" NOT NULL,
    "issuerBankId" UUID NOT NULL,
    "dueDay" SMALLINT,
    "closingDay" SMALLINT,
    "limit" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creditCardInvoices" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "cardId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creditCardInvoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "userAccountRoles" ADD CONSTRAINT "userAccountRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAccountRoles" ADD CONSTRAINT "userAccountRoles_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inflows" ADD CONSTRAINT "inflows_destinationBankId_fkey" FOREIGN KEY ("destinationBankId") REFERENCES "banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outflows" ADD CONSTRAINT "outflows_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outflowPaymentDetails" ADD CONSTRAINT "outflowPaymentDetails_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outflowPaymentDetails" ADD CONSTRAINT "outflowPaymentDetails_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outflowPaymentDetails" ADD CONSTRAINT "outflowPaymentDetails_outflowId_fkey" FOREIGN KEY ("outflowId") REFERENCES "outflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outflowItems" ADD CONSTRAINT "outflowItems_outflowId_fkey" FOREIGN KEY ("outflowId") REFERENCES "outflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outflowInstallments" ADD CONSTRAINT "outflowInstallments_outflowId_fkey" FOREIGN KEY ("outflowId") REFERENCES "outflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outflowSellers" ADD CONSTRAINT "outflowSellers_outflowId_fkey" FOREIGN KEY ("outflowId") REFERENCES "outflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_issuerBankId_fkey" FOREIGN KEY ("issuerBankId") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creditCardInvoices" ADD CONSTRAINT "creditCardInvoices_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
