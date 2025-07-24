export interface Loan {
  _id: string; // MongoDB id
  loanId: string; // Add this line
  userId: string;
  principalAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  loanType: 'emi' | 'interest-only';
  status: 'active' | 'completed' | 'defaulted';
  remainingPrincipal: number;
  paidInstallments: number;
  nextDueDate?: Date;
  createdAt: string;
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  remainingBalance: number;
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