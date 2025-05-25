import { getAccountTransactions } from "@/actions/account";
import TransactionTable from "@/components/TransactionTable";
import { parse } from "path";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

const AccountPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const accountData = await getAccountTransactions(id);

  if (!accountData) {
    throw new Error("Account not found");
  }

  const {
    name,
    type,
    balance,
    _count: { transactions: acctTransactions },
    transactions,
  } = accountData;

  return (
    <div>
      <div className="space-y-8 px-5 flex justify-between items-center gap-4">
        <div>
          <h1 className="text-5xl tracking-tight capitalize sm:text-6xl font-bold gradient-title">
            {name}
          </h1>
          <p className="text-muted-foreground">
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {acctTransactions} Transactions
          </p>
        </div>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
};

export default AccountPage;
