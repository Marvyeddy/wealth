"use client";

import { updateDefaultAccount } from "@/actions/account";
import { Account } from "@/app/(main)/dashboard/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/useFetch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

type UpdateResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

const AccountCard = ({ account }: { account: Account }) => {
  const { balance, id, isDefault, name, type } = account;

  const {
    data: updateDefaultData,
    error,
    fn: updateDefaultFn,
    loading: updateDefaultLoading,
    setData,
  } = useFetch(updateDefaultAccount) as {
    data: UpdateResponse | null;
    error: Error | null;
    loading: boolean;
    fn: (...args: any[]) => Promise<void>;
    setData: React.Dispatch<React.SetStateAction<any>>;
  };

  const handleChange = async (e: any) => {
    e.preventDefault();

    if (isDefault) {
      toast.error("You need at least one default account");
      return;
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updateDefaultData?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updateDefaultData, updateDefaultLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed group relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleChange}
            disabled={updateDefaultLoading}
            className="cursor-pointer"
          />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            ${`${parseFloat(balance).toFixed(2)}`}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="text-muted-foreground flex items-center justify-between text-sm mt-4">
          <div className="flex items-center">
            <ArrowUpRight className="text-green-500 mr-1 size-4" /> Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="text-red-500 mr-1 size-4" /> Expenses
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
