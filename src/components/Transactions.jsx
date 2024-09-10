import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import TransactionForm from './TransactionForm';
import TransactionDialog from './TransactionDialog';

const fetchTransactions = async () => {
  const storedTransactions = localStorage.getItem('transactions');
  return storedTransactions ? JSON.parse(storedTransactions) : [];
};

const Transactions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const queryClient = useQueryClient();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const addTransactionMutation = useMutation({
    mutationFn: (newTransaction) => {
      const updatedTransactions = [...(transactions || []), { id: Date.now(), ...newTransaction }];
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      return Promise.resolve({ id: Date.now(), ...newTransaction });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('transactions');
      setIsFormOpen(false);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: (updatedTransaction) => {
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      return Promise.resolve(updatedTransaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('transactions');
      setSelectedTransaction(null);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (id) => {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      return Promise.resolve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('transactions');
    },
  });

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransactionMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error fetching transactions: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
              <p className="text-gray-500 mb-4">Add a transaction and it will show up here.</p>
              <Button onClick={() => setIsFormOpen(true)}>Add Your First Transaction</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>${parseFloat(transaction.amount).toFixed(2)}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(transaction)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {isFormOpen && (
        <TransactionForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={(data) => addTransactionMutation.mutate(data)}
        />
      )}
      {selectedTransaction && (
        <TransactionDialog
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onUpdate={(updatedTransaction) => updateTransactionMutation.mutate(updatedTransaction)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </div>
  );
};

export default Transactions;