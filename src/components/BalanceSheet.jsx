import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const fetchTransactions = async () => {
  // In a real app, this would fetch from an API
  const storedTransactions = localStorage.getItem('transactions');
  return storedTransactions ? JSON.parse(storedTransactions) : [];
};

const BalanceSheet = () => {
  const [date, setDate] = useState(new Date());

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const balanceSheetData = useMemo(() => {
    if (!transactions) return { assets: {}, liabilities: {}, equity: 0 };

    const filteredTransactions = transactions.filter(t => new Date(t.date) <= date);

    const assets = {
      cash: 0,
      accountsReceivable: 0,
      inventory: 0,
      equipment: 0,
      land: 0,
    };

    const liabilities = {
      accountsPayable: 0,
      loans: 0,
    };

    filteredTransactions.forEach(t => {
      if (t.type === 'income') {
        assets.cash += parseFloat(t.amount);
      } else if (t.type === 'expense') {
        assets.cash -= parseFloat(t.amount);
      }
      // Add more logic here for other types of transactions
    });

    const totalAssets = Object.values(assets).reduce((sum, value) => sum + value, 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + value, 0);
    const equity = totalAssets - totalLiabilities;

    return { assets, liabilities, equity, totalAssets, totalLiabilities };
  }, [transactions, date]);

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error fetching transactions: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Balance Sheet</h1>
      <Card>
        <CardHeader>
          <CardTitle>As of Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {Object.entries(balanceSheetData.assets).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell className="text-right">${value.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">Total Assets</TableCell>
                <TableCell className="text-right font-bold">${balanceSheetData.totalAssets.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {Object.entries(balanceSheetData.liabilities).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell className="text-right">${value.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">Total Liabilities</TableCell>
                <TableCell className="text-right font-bold">${balanceSheetData.totalLiabilities.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Owner's Equity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Owner's Equity</TableCell>
                <TableCell className="text-right">${balanceSheetData.equity.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceSheet;