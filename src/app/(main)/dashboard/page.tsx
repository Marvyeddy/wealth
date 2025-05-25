import CreateAccountDrawer from "@/components/CreateAccountDrawer";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { getUserAccounts } from "@/actions/dashboard";
import AccountCard from "@/components/AccountCard";

export interface Account {
  name: string;
  type: string;
  balance: string;
  isDefault: boolean;
  id: string;
}

const DashboardPage = async () => {
  const accounts: Account[] = (await getUserAccounts()) || [];
  return (
    <div className="px-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center pt-5 text-muted-foreground h-full">
              <PlusIcon className="size-10 mb-2" />
              <p className="font-medium text-sm">Add new account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 &&
          accounts.map((account) => {
            return <AccountCard key={account.id} account={account} />;
          })}
      </div>
    </div>
  );
};

export default DashboardPage;
