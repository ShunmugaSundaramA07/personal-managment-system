
import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, Calendar, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  recurring?: boolean;
}

interface Budget {
  category: string;
  limit: number;
  spent: number;
}

const FinanceTracker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 5000,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01',
      recurring: true
    },
    {
      id: '2',
      type: 'expense',
      amount: 1200,
      category: 'Housing',
      description: 'Rent payment',
      date: '2024-01-01',
      recurring: true
    },
    {
      id: '3',
      type: 'expense',
      amount: 85,
      category: 'Food',
      description: 'Grocery shopping',
      date: '2024-01-05'
    },
    {
      id: '4',
      type: 'expense',
      amount: 45,
      category: 'Transportation',
      description: 'Gas station',
      date: '2024-01-06'
    },
    {
      id: '5',
      type: 'income',
      amount: 500,
      category: 'Freelance',
      description: 'Web design project',
      date: '2024-01-08'
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food', limit: 400, spent: 285 },
    { category: 'Transportation', limit: 200, spent: 145 },
    { category: 'Entertainment', limit: 150, spent: 75 },
    { category: 'Shopping', limit: 300, spent: 225 }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Other'];
  const expenseCategories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Utilities', 'Other'];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
      recurring: newTransaction.recurring
    };

    setTransactions([transaction, ...transactions]);

    // Update budget if it's an expense
    if (transaction.type === 'expense') {
      setBudgets(budgets.map(budget => 
        budget.category === transaction.category
          ? { ...budget, spent: budget.spent + transaction.amount }
          : budget
      ));
    }

    setNewTransaction({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      recurring: false
    });
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Transaction added successfully"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'safe';
  };

  const getBudgetColor = (status: string) => {
    switch (status) {
      case 'danger': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Finance</h2>
          <p className="text-slate-600 dark:text-slate-300">Track your income, expenses, and budgets</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover:scale-105 transition-transform">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newTransaction.type} onValueChange={(value: 'income' | 'expense') => setNewTransaction({...newTransaction, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                />
              </div>
              <Button onClick={addTransaction} className="w-full">
                Add Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                <p className="text-sm text-slate-500">This month</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                <p className="text-sm text-slate-500">This month</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Net Income</p>
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netIncome)}
                </p>
                <p className="text-sm text-slate-500">This month</p>
              </div>
              <div className={`p-3 rounded-lg ${netIncome >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                <DollarSign className={`h-6 w-6 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyTransactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description || transaction.category}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {formatDate(transaction.date)}
                          </span>
                          {transaction.recurring && (
                            <Badge variant="outline" className="text-xs">Recurring</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Budget Overview
              </CardTitle>
              <CardDescription>Track your spending against your budget limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const percentage = (budget.spent / budget.limit) * 100;
                  const status = getBudgetStatus(budget);
                  
                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{budget.category}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getBudgetColor(status)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${
                          status === 'danger' ? 'text-red-600' :
                          status === 'warning' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {percentage.toFixed(1)}% used
                        </span>
                        <span className="text-slate-500">
                          {formatCurrency(budget.limit - budget.spent)} remaining
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceTracker;
