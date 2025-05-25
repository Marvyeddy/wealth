"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeNumber = (obj: any) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }

  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }

  return serialized;
};

export const updateDefaultAccount = async (accountId: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: {
        isDefault: false,
      },
    });

    const account = await prisma.account.update({
      where: {
        userId: user.id,
        id: accountId,
      },
      data: {
        isDefault: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeNumber(account) };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const getAccountTransactions = async (accountId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: {
          date: "desc",
        },
      },
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  return {
    ...serializeNumber(account),
    transactions: account.transactions.map(serializeNumber),
  };
};

export async function bulkDeleteTransactions(transactionIds: string[]) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });
    const accountBalanceCharges = transactions.reduce((acc: any, tx: any) => {
      const change = tx.type === "EXPENSE" ? tx.amount : -tx.amount;
      acc[tx.accountId] = (acc[tx.accountId] || 0) + change;
      return acc;
    }, {});
  } catch (error) {}
}
