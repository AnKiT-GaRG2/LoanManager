export interface Loan {
  id: string;
  userId: string;
  principalAmount: number;
  interestRate: number;
  tenure: number; // in months
  emiAmount: number;
  loanType: 'emi' | 'interest-only';
  createdAt: string;
  status: 'active' | 'completed' | 'defaulted';
  remainingPrincipal: number;
  paidInstallments: number;
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  isPrepayment: boolean;
  notes?: string;
}

export interface LoanCalculation {
  emiAmount: number;
  totalInterest: number;
  totalAmount: number;
  schedule: PaymentSchedule[];
}

export interface PaymentSchedule {
  installmentNumber: number;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  paymentDate: string;
}