import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import financeManager from '@/handler/FinanceManager';

interface Investment {
  id: number;
  user: string;
  amount: number;
  start_date: string;
  duration_days: number;
  interest_rate: number;
  created_at: string;
  updated_at: string;
}

interface FinancialReport {
  id: number;
  total_payments: number;
  total_rewards: number;
  total_investments: number;
  total_interest: number;
  report_date: string;
}

interface FinanceContextProps {
  investments: Investment[];
  financialReports: FinancialReport[];
  loading: boolean;
  getInvestments: () => Promise<void>;
  createInvestment: (investmentData: Partial<Investment>) => Promise<void>;
  updateInvestment: (id: number, investmentData: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: number) => Promise<void>;
  getFinancialReports: () => Promise<void>;
  createFinancialReport: (reportData: Partial<FinancialReport>) => Promise<void>;
  updateFinancialReport: (id: number, reportData: Partial<FinancialReport>) => Promise<void>;
  deleteFinancialReport: (id: number) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextProps | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(false);

  const getInvestments = async () => {
    setLoading(true);
    try {
      const data = await financeManager.getInvestments();
      setInvestments(data);
    } catch (error) {
      console.error('Failed to fetch investments', error);
    } finally {
      setLoading(false);
    }
  };

  const createInvestment = async (investmentData: Partial<Investment>) => {
    setLoading(true);
    try {
      const newInvestment = await financeManager.createInvestment(investmentData);
      if (newInvestment) {
        setInvestments([...investments, newInvestment]);
      }
    } catch (error) {
      console.error('Failed to create investment', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInvestment = async (id: number, investmentData: Partial<Investment>) => {
    setLoading(true);
    try {
      const updatedInvestment = await financeManager.updateInvestment(id, investmentData);
      if (updatedInvestment) {
        setInvestments(investments.map(investment => (investment.id === id ? updatedInvestment : investment)));
      }
    } catch (error) {
      console.error('Failed to update investment', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvestment = async (id: number) => {
    setLoading(true);
    try {
      await financeManager.deleteInvestment(id);
      setInvestments(investments.filter(investment => investment.id !== id));
    } catch (error) {
      console.error('Failed to delete investment', error);
    } finally {
      setLoading(false);
    }
  };

  const getFinancialReports = async () => {
    setLoading(true);
    try {
      const data = await financeManager.getFinancialReports();
      setFinancialReports(data);
    } catch (error) {
      console.error('Failed to fetch financial reports', error);
    } finally {
      setLoading(false);
    }
  };

  const createFinancialReport = async (reportData: Partial<FinancialReport>) => {
    setLoading(true);
    try {
      const newReport = await financeManager.createFinancialReport(reportData);
      if (newReport) {
        setFinancialReports([...financialReports, newReport]);
      }
    } catch (error) {
      console.error('Failed to create financial report', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFinancialReport = async (id: number, reportData: Partial<FinancialReport>) => {
    setLoading(true);
    try {
      const updatedReport = await financeManager.updateFinancialReport(id, reportData);
      if (updatedReport) {
        setFinancialReports(financialReports.map(report => (report.id === id ? updatedReport : report)));
      }
    } catch (error) {
      console.error('Failed to update financial report', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFinancialReport = async (id: number) => {
    setLoading(true);
    try {
      await financeManager.deleteFinancialReport(id);
      setFinancialReports(financialReports.filter(report => report.id !== id));
    } catch (error) {
      console.error('Failed to delete financial report', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvestments();
    getFinancialReports();
  }, []);

  return (
    <FinanceContext.Provider value={{
      investments,
      financialReports,
      loading,
      getInvestments,
      createInvestment,
      updateInvestment,
      deleteInvestment,
      getFinancialReports,
      createFinancialReport,
      updateFinancialReport,
      deleteFinancialReport
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};