import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  calculateEMI, 
  calculatePrincipal, 
  calculateTenure, 
  generateLoanSchedule,
  formatCurrency 
} from '@/utils/loanCalculations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loan } from '@/types/loan';
import { Calculator, Save, TrendingUp } from 'lucide-react';

const TENURE_OPTIONS = [6, 12, 24, 36, 60];
const INTEREST_RATE_OPTIONS = [8, 10, 12, 15, 18];
const EMI_AMOUNT_OPTIONS = [5000, 10000, 15000, 25000, 50000];

const EMICalculator: React.FC = () => {
  const [loanType, setLoanType] = useState<'emi' | 'interest-only'>('emi');
  const [principal, setPrincipal] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [tenure, setTenure] = useState<number>(0);
  const [emiAmount, setEmiAmount] = useState<number>(0);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [calculationMode, setCalculationMode] = useState<'principal' | 'rate' | 'tenure' | 'emi'>('emi');
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (principal && interestRate && tenure) {
      const result = generateLoanSchedule(principal, interestRate, tenure, loanType);
      setCalculationResult(result);
      setEmiAmount(result.emiAmount);
    }
  }, [principal, interestRate, tenure, loanType]);

  const calculateMissingValue = () => {
    let result = null;
    
    try {
      if (calculationMode === 'emi' && principal && interestRate && tenure) {
        const emi = loanType === 'emi' ? 
          calculateEMI(principal, interestRate, tenure) :
          (principal * interestRate) / (12 * 100);
        setEmiAmount(emi);
        result = generateLoanSchedule(principal, interestRate, tenure, loanType);
      } else if (calculationMode === 'principal' && emiAmount && interestRate && tenure) {
        const calc_principal = loanType === 'emi' ?
          calculatePrincipal(emiAmount, interestRate, tenure) :
          (emiAmount * 12 * 100) / interestRate;
        setPrincipal(calc_principal);
        result = generateLoanSchedule(calc_principal, interestRate, tenure, loanType);
      } else if (calculationMode === 'tenure' && principal && emiAmount && interestRate && loanType === 'emi') {
        const calc_tenure = calculateTenure(principal, emiAmount, interestRate);
        setTenure(calc_tenure);
        result = generateLoanSchedule(principal, interestRate, calc_tenure, loanType);
      }
      
      if (result) {
        setCalculationResult(result);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: "Please check your inputs and try again.",
      });
    }
  };

  const saveLoan = async () => {
    if (!calculationResult || !user) return;

    try {
      const newLoan = {
        userId: user.id,
        principalAmount: principal,
        interestRate,
        tenure,
        emiAmount: calculationResult.emiAmount,
        loanType,
        status: 'active',
        remainingPrincipal: principal,
        paidInstallments: 0,
      };

      const response = await fetch('http://localhost:5000/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLoan),
      });

      if (!response.ok) {
        throw new Error('Failed to save loan');
      }

      const savedLoan = await response.json();
      
      toast({
        title: "Loan Saved!",
        description: "Your loan has been successfully saved to your portfolio.",
      });
    } catch (error) {
      console.error('Save loan error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save loan. Please try again.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5 text-primary" />
            EMI Calculator
          </CardTitle>
          <CardDescription>
            Calculate your loan EMI with smart defaults and flexible options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Loan Type</Label>
            <RadioGroup value={loanType} onValueChange={(value: 'emi' | 'interest-only') => setLoanType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emi" id="emi" />
                <Label htmlFor="emi">EMI Loan (Principal + Interest)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="interest-only" id="interest-only" />
                <Label htmlFor="interest-only">Interest-Only Loan</Label>
              </div>
            </RadioGroup>
          </div>

          <Tabs defaultValue="calculate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculate">Quick Calculate</TabsTrigger>
              <TabsTrigger value="smart">Smart Options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculate" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal">Principal Amount (₹)</Label>
                <Input
                  id="principal"
                  type="number"
                  placeholder="Enter loan amount"
                  value={principal || ''}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (% per annum)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.1"
                  placeholder="Enter interest rate"
                  value={interestRate || ''}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Tenure (months)</Label>
                <Input
                  id="tenure"
                  type="number"
                  placeholder="Enter tenure in months"
                  value={tenure || ''}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="bg-background border-border"
                />
              </div>

              <Button onClick={calculateMissingValue} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate EMI
              </Button>
            </TabsContent>

            <TabsContent value="smart" className="space-y-4">
              <div className="space-y-3">
                <Label>Calculate Missing Value</Label>
                <RadioGroup value={calculationMode} onValueChange={(value: any) => setCalculationMode(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="emi" id="calc-emi" />
                    <Label htmlFor="calc-emi">Calculate EMI Amount</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="principal" id="calc-principal" />
                    <Label htmlFor="calc-principal">Calculate Principal</Label>
                  </div>
                  {loanType === 'emi' && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tenure" id="calc-tenure" />
                      <Label htmlFor="calc-tenure">Calculate Tenure</Label>
                    </div>
                  )}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tenure Options (months)</Label>
                  <div className="flex flex-wrap gap-2">
                    {TENURE_OPTIONS.map((option) => (
                      <Badge
                        key={option}
                        variant={tenure === option ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setTenure(option)}
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interest Rate Options (% p.a.)</Label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_RATE_OPTIONS.map((option) => (
                      <Badge
                        key={option}
                        variant={interestRate === option ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setInterestRate(option)}
                      >
                        {option}%
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>EMI Amount Options</Label>
                  <div className="flex flex-wrap gap-2">
                    {EMI_AMOUNT_OPTIONS.map((option) => (
                      <Badge
                        key={option}
                        variant={emiAmount === option ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setEmiAmount(option)}
                      >
                        ₹{option.toLocaleString()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={calculateMissingValue} className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                Smart Calculate
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {calculationResult && (
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
            <CardDescription>
              Your loan breakdown and payment schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-primary rounded-lg text-primary-foreground">
                <p className="text-sm opacity-90">Monthly Payment</p>
                <p className="text-2xl font-bold">{formatCurrency(calculationResult.emiAmount)}</p>
              </div>
              
              <div className="p-4 bg-gradient-secondary rounded-lg text-secondary-foreground">
                <p className="text-sm opacity-90">Total Interest</p>
                <p className="text-2xl font-bold">{formatCurrency(calculationResult.totalInterest)}</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Principal Amount</p>
                <p className="text-xl font-semibold text-foreground">{formatCurrency(principal)}</p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-semibold text-foreground">{formatCurrency(calculationResult.totalAmount)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Interest Rate:</span>
                <span className="font-medium">{interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tenure:</span>
                <span className="font-medium">{tenure} months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Loan Type:</span>
                <span className="font-medium capitalize">{loanType.replace('-', ' ')}</span>
              </div>
            </div>

            <Button onClick={saveLoan} className="w-full" variant="secondary">
              <Save className="mr-2 h-4 w-4" />
              Save Loan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EMICalculator;