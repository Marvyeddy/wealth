"use client";

import { Transaction } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/category";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Clock,
  MoreHorizontalIcon,
  RefreshCcw,
  SearchIcon,
  Trash,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) =>
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((t) => (typeFilter ? t.type === typeFilter : true))
      .filter((t) =>
        recurringFilter === "recurring"
          ? t.isRecurring
          : recurringFilter === "non-recurring"
          ? !t.isRecurring
          : true
      );
  }, [transactions, searchTerm, typeFilter, recurringFilter]);

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];

    sorted.sort((a, b) => {
      const field = sortConfig.field as keyof Transaction;
      const aValue = a[field];
      const bValue = b[field];

      if (field === "date") {
        const aTime = new Date(aValue as string | Date).getTime();
        const bTime = new Date(bValue as string | Date).getTime();
        return sortConfig.direction === "asc" ? aTime - bTime : bTime - aTime;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [filteredTransactions, sortConfig]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * transactionsPerPage;
    return sortedTransactions.slice(start, start + transactionsPerPage);
  }, [sortedTransactions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, recurringFilter]);

  const handleSort = (field: string) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const router = useRouter();

  const handleSelect = (id: string) => {
    setSelectedId((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedId((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const handleBulkDelete = () => {};

  const handleClearFilter = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedId([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-2.5 text-muted-foreground size-4" />
          <Input
            className="pl-8"
            value={searchInput}
            placeholder="Search Transactions...."
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => setRecurringFilter(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring only</SelectItem>
            </SelectContent>
          </Select>

          {selectedId.length > 0 && (
            <Button variant={"destructive"} onClick={handleBulkDelete}>
              <Trash className="size-4" />
              Delete selected ({selectedId.length})
            </Button>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant={"outline"}
              onClick={handleClearFilter}
              title="Clear Filters"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedId.length === filteredTransactions.length &&
                    filteredTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date{" "}
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUpIcon className="w-4 h-4 ml-2" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 ml-2" />
                    ))}
                </div>
              </TableHead>

              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category{" "}
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUpIcon className="w-4 h-4 ml-2" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 ml-2" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount{" "}
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUpIcon className="w-4 h-4 ml-2" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 ml-2" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-3"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedId.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.date), "pp")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      className="px-2 py-1 text-sm text-white rounded-lg"
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right"
                    style={{
                      color:
                        transaction.type === "EXPENSE"
                          ? "#ef4444" // red-500
                          : "#22c55e", // green-500
                      fontWeight: "bold",
                    }}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant={"outline"}
                              className="gap-1 bg-purple-100 text-purple-800 p-2 rounded-full hover:bg-purple-200"
                            >
                              <RefreshCcw className="size-3" />
                              {transaction.recurringInterval
                                ? RECURRING_INTERVALS[
                                    transaction.recurringInterval
                                  ]
                                : ""}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div>New Date:</div>
                              <div>
                                {transaction.nextRecurringDate
                                  ? format(
                                      new Date(transaction.nextRecurringDate),
                                      "PP"
                                    )
                                  : "N/A"}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge
                        variant={"outline"}
                        className="p-2 gap-1 rounded-full"
                      >
                        <Clock className="size-3" />
                        One-Time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size={"icon"}
                          className="p-0 w-8 h-8"
                          variant={"ghost"}
                        >
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mr-12">
                        <DropdownMenuLabel
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(
                              `transaction/create?edit=${transaction.id}`
                            );
                          }}
                        >
                          Edit
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
