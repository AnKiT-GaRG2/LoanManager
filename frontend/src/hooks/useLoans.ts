import { useState, useEffect } from 'react';
import { Loan } from '@/types/loan';
import { useAuth } from '@/contexts/AuthContext';

interface UseLoansReturn {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useLoans = (): UseLoansReturn => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLoans = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/loans/user/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }
      
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [user?.id]);

  return { loans, loading, error, refetch: fetchLoans };
};