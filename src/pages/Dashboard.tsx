import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import EMICalculator from '@/components/EMICalculator/EMICalculator';
import { useAuth } from '@/contexts/AuthContext';
import { Loan, Payment } from '@/types/loan';
import { formatCurrency } from '@/utils/loanCalculations';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  PieChart,
  CreditCard,
  Activity 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalPrincipal: 0,
    totalEMI: 0,
    completedLoans: 0,
  });

  useEffect(() => {
    if (user) {
      // Load user's loans
      const allLoans = JSON.parse(localStorage.getItem('loanManagement_loans') || '[]');
      const userLoans = allLoans.filter((loan: Loan) => loan.userId === user.id);
      setLoans(userLoans);

      // Load user's payments
      const allPayments = JSON.parse(localStorage.getItem('loanManagement_payments') || '[]');
      const userPayments = allPayments.filter((payment: Payment) => 
        userLoans.some(loan => loan.id === payment.loanId)
      );
      setPayments(userPayments);

      // Calculate stats
      const activeLoans = userLoans.filter(loan => loan.status === 'active');
      const completedLoans = userLoans.filter(loan => loan.status === 'completed');
      
      setStats({
        totalLoans: userLoans.length,
        activeLoans: activeLoans.length,
        totalPrincipal: userLoans.reduce((sum, loan) => sum + loan.principalAmount, 0),
        totalEMI: activeLoans.reduce((sum, loan) => sum + loan.emiAmount, 0),
        completedLoans: completedLoans.length,
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-muted-foreground">
            Manage your loans and track payments professionally
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Loans</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalLoans}</p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeLoans}</p>
                </div>
                <Activity className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Principal</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(stats.totalPrincipal)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly EMI</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(stats.totalEMI)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{stats.completedLoans}</p>
                </div>
                <PieChart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="calculator">EMI Calculator</TabsTrigger>
            <TabsTrigger value="loans">My Loans</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="schedule" className="hidden lg:flex">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <EMICalculator />
          </TabsContent>

          <TabsContent value="loans">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>My Loans</CardTitle>
                <CardDescription>
                  View and manage all your loans in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loans.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No loans found. Create your first loan using the EMI Calculator.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.map((loan) => (
                      <div key={loan.id} className="p-4 bg-background rounded-lg border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-foreground">
                              {formatCurrency(loan.principalAmount)} Loan
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Created on {new Date(loan.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={loan.status === 'active' ? 'default' : 'secondary'}>
                            {loan.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">EMI Amount</p>
                            <p className="font-medium">{formatCurrency(loan.emiAmount)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Interest Rate</p>
                            <p className="font-medium">{loan.interestRate}% p.a.</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tenure</p>
                            <p className="font-medium">{loan.tenure} months</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-medium capitalize">{loan.loanType.replace('-', ' ')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Track all your loan payments and remaining balances
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payments recorded yet. Start making payments to see your history here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="p-4 bg-background rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-foreground">
                              {formatCurrency(payment.amount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Remaining Balance</p>
                            <p className="font-medium">{formatCurrency(payment.remainingBalance)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
                <CardDescription>
                  Detailed payment breakdown and upcoming installments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Payment schedule will be available after calculating a loan.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;