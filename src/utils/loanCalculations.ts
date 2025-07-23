import { LoanCalculation, PaymentSchedule } from '@/types/loan';

export const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
               (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

export const calculatePrincipal = (emi: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / (12 * 100);
  const principal = (emi * (Math.pow(1 + monthlyRate, tenure) - 1)) / 
                   (monthlyRate * Math.pow(1 + monthlyRate, tenure));
  return Math.round(principal);
};

export const calculateTenure = (principal: number, emi: number, rate: number): number => {
  const monthlyRate = rate / (12 * 100);
  const tenure = Math.log(1 + (principal * monthlyRate) / emi) / 
                Math.log(1 + monthlyRate);
  return Math.round(tenure);
};

export const calculateInterestOnlyPayment = (principal: number, rate: number): number => {
  return Math.round((principal * rate) / (12 * 100));
};

export const generateLoanSchedule = (
  principal: number, 
  rate: number, 
  tenure: number, 
  loanType: 'emi' | 'interest-only'
): LoanCalculation => {
  const schedule: PaymentSchedule[] = [];
  let remainingBalance = principal;
  let totalInterest = 0;

  if (loanType === 'interest-only') {
    const monthlyInterest = calculateInterestOnlyPayment(principal, rate);
    
    for (let i = 1; i <= tenure; i++) {
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + i);
      
      schedule.push({
        installmentNumber: i,
        emiAmount: monthlyInterest,
        principalAmount: i === tenure ? principal : 0, // Principal paid only in last installment
        interestAmount: monthlyInterest,
        remainingBalance: i === tenure ? 0 : principal,
        paymentDate: paymentDate.toISOString(),
      });
      
      totalInterest += monthlyInterest;
    }
    
    return {
      emiAmount: monthlyInterest,
      totalInterest,
      totalAmount: principal + totalInterest,
      schedule,
    };
  } else {
    const emiAmount = calculateEMI(principal, rate, tenure);
    const monthlyRate = rate / (12 * 100);
    
    for (let i = 1; i <= tenure; i++) {
      const interestAmount = Math.round(remainingBalance * monthlyRate);
      const principalAmount = emiAmount - interestAmount;
      remainingBalance -= principalAmount;
      
      if (remainingBalance < 0) remainingBalance = 0;
      
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + i);
      
      schedule.push({
        installmentNumber: i,
        emiAmount,
        principalAmount,
        interestAmount,
        remainingBalance,
        paymentDate: paymentDate.toISOString(),
      });
      
      totalInterest += interestAmount;
    }
    
    return {
      emiAmount,
      totalInterest,
      totalAmount: principal + totalInterest,
      schedule,
    };
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};